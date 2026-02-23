import { ref } from 'vue';
import { useSettings } from './useSettings';
import { FREE_MODELS, PAID_MODELS } from '../config/constants';

// We put isGenerating here so it can be shared or local. Local per call? 
// No, UI needs to know if generating. 
const isGenerating = ref(false);

export function useAI() {
    const { apiKey, keyTier } = useSettings();

    const generateComment = async (student, pushToHistory) => {
        if (!apiKey.value) { alert('請輸入 Key'); return; }
        if (!student.name) { alert('請輸入姓名'); return; }
        if (!student.raw_comment) { alert('請輸入紀錄'); return; }

        const isCommentLocked = student.locked_comment;
        const isMottoLocked = student.locked_motto;

        if (isCommentLocked && isMottoLocked) {
            alert('⚠️ 評語與箴言皆已鎖定，無法生成！請先解鎖欲修改的欄位。');
            return;
        }

        isGenerating.value = true;
        const originalComment = student.polished_comment;

        if (!isCommentLocked) {
            student.polished_comment = "🐾 貓貓思考中...";
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        let taskInstruction = '';
        if (isCommentLocked && !isMottoLocked) {
            taskInstruction = '⚠️ 任務限制：使用者已鎖定「comment」欄位，請**僅生成 motto (八字箴言)**，comment 欄位請回傳空字串。';
        } else if (!isCommentLocked && isMottoLocked) {
            taskInstruction = '⚠️ 任務限制：使用者已鎖定「motto」欄位，請**僅生成 comment (暖心評語)**，motto 欄位請回傳空字串。';
        } else {
            taskInstruction = '請同時生成 comment 與 motto。';
        }

        const prompt = `
        角色設定：你現在身兼兩個角色。
        1. 【給家長看】你是一位溫暖、正向的台灣國小導師。
        2. 【給校方存檔】你是一位**客觀、嚴格、不帶感情**的教務處紀錄人員。
        
        輸入資料：
        - 學生姓名：${student.name}
        - 觀察紀錄：${student.raw_comment}
        
        ${taskInstruction}
        
        任務：請根據「觀察紀錄」進行分析，並輸出 JSON 格式結果。
        
        *** 關鍵邏輯 (Motto 生成規則) ***
        請先在心裡對「觀察紀錄」進行評分 (Score 1-10)：
        - 分數 1-4 (負面/需改進)：內容包含干擾上課、作業缺交、打架、無禮、粗心等。
        - 分數 5-7 (普通/好壞參半)：有優點也有明顯缺點。
        - 分數 8-10 (正面/優良)：絕大多數為正向描述。
        
        Motto 選擇策略：
        - 若分數 <= 4：請給予「鼓勵改進、溫和勸導」的箴言 (如：學會尊重，友愛同學)。
        - 若分數 5-7：請給予「肯定優點、提醒細節」的箴言 (如：持之以恆，漸入佳境)。
        - 若分數 >= 8：請給予「高度讚賞、期許未來」的箴言 (如：品學兼優，明日之星)。
        
        輸出格式 (JSON Only)：
        {
          "analysis": "簡短分析你的評分邏輯 (Ex: 攻擊行為扣分，主動值日加分，總分 4)",
          "comment": "以『導師』角色撰寫，語氣溫暖，約 50-100 字。需包含觀察到的具體事實並給予鼓勵。針對缺點請婉轉表達期待。",
          "motto": "以『紀錄員』角色撰寫，僅輸出 8 個字的四字成語組合 (Ex: 專注學習，日益精進)。請務必符合上述評分邏輯！"
        }
        `;

        try {
            const models = keyTier.value === 'paid' ? PAID_MODELS : FREE_MODELS;
            let success = false;
            let result = null;

            for (const model of models) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.value}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseMimeType: "application/json" }
                        }),
                        signal: controller.signal
                    });

                    if (!response.ok) {
                        if (response.status === 429) continue;
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
                        result = JSON.parse(data.candidates[0].content.parts[0].text);
                        success = true;
                        break;
                    }
                } catch (err) {
                    console.warn(`Model ${model} failed`, err);
                    if (err.name === 'AbortError') throw new Error('生成逾時 (30s)');
                }
            }

            if (!success || !result) throw new Error('所有模型皆忙碌或失敗，請稍後再試。');

            // Apply results
            if (!isMottoLocked && result.motto) student.motto = result.motto;

            if (!isCommentLocked && result.comment) {
                student.polished_comment = result.comment;
                if (pushToHistory) pushToHistory(result.comment);
            } else if (!isCommentLocked) {
                student.polished_comment = originalComment || '';
            }

        } catch (error) {
            console.error(error);
            if (!isCommentLocked) student.polished_comment = originalComment || '';
            alert('生成失敗: ' + error.message);
        } finally {
            clearTimeout(timeoutId);
            isGenerating.value = false;
        }
    };

    return {
        isGenerating,
        generateComment
    };
}
