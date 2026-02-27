# 🐱 喵嗚評語助手 (Meow Comment Helper)

> 專為國小導師打造的 AI 評語工具——用 Google Gemini 將觀察紀錄轉化為專業評語，還能處理行為量表與多元紀錄，一鍵匯出學校格式的 Excel。

## 🚀 快速開始

### 線上版（推薦）

開啟 **[GitHub Pages](https://neriakto.github.io/Meow-Comment-Helper/)**，跟隨新手引導精靈完成設定即可使用。

### 單機版

下載 ZIP 解壓後，雙擊 `index.html` 開啟，操作同線上版。

### 取得 API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/apikey)
2. 點擊 **"Create API key in new project"**
3. 複製產生的 `AIza...` 金鑰，貼入助手中

> 💡 想再看一次引導？點擊頂部工具列 API Key 旁的 **❓** 按鈕即可重新開啟。

## 📋 三步驟工作流

### Step 1：評語生成（📝 評語）

1. 點擊「🏡 貓窩管理」建立班級（年級、班序、人數）
2. 選擇學生，輸入姓名與觀察紀錄
3. 點擊「🐾 幫我寫」，AI 會生成**老師評語**與**學籍卡箴言**
4. 可手動修改結果，或使用 🔒 鎖定滿意的欄位後重新生成另一欄

### Step 2：行為評量（📊 行為量表）

1. 切換至「📊 行為量表」頁籤
2. 點擊 **⚡ 一鍵預設** 快速填入「大部分符合」
3. 針對例外項目微調

### Step 3：多元紀錄（🏆 多元紀錄）

1. 切換至「🏆 多元紀錄」頁籤
2. 填入團體活動、公共服務、特殊表現
3. 點擊 **📥 匯出** 下載 Excel（雙層表頭，相容學校匯入格式）

## ✨ 主要功能

| 功能 | 說明 |
|------|------|
| **AI 雙軌模型** | 🌱 免費版使用 Gemini 2.0 Flash；💎 付費版解鎖 Gemini 2.5/3.0 Pro |
| **內容鎖定** | 鎖定滿意的欄位，AI 只重新生成未鎖定的部分 |
| **自定義標籤** | 自訂各領域的快速觀察標籤，雲端同步跨裝置漫遊 |
| **雲端備份** | 透過 Google Apps Script 備份至 Google Sheets |
| **公用電腦模式** | API Key 僅存於記憶體，關閉視窗即消失 |
| **Excel 匯出入** | 雙層表頭格式，100% 相容學校系統；匯出自動消毒防公式注入 |
| **RWD 響應式** | 手機與桌機皆可舒適操作 |

## ☁️ 雲端同步設定（選用）

雲端同步讓您的資料可以跨裝置使用，需自行部署 Google Apps Script 後端：

1. 點擊應用內「☁️ 雲端同步」按鈕
2. 展開內嵌教學，一鍵複製 GAS 程式碼
3. 前往 [Google Apps Script](https://script.google.com/) 建立專案並貼上
4. **修改程式碼中的 `var SECRET = "meow1234"` 為您的專屬密語**
5. 部署為網頁應用程式，將網址貼回助手

## ⚙️ 進階：Config 預設（選用）

在 `index.html` 同目錄建立 `config.js`，可讓助手自動帶入金鑰：

```javascript
window.APP_CONFIG = {
    GEMINI_API_KEY: "您的_AIza_開頭金鑰",
    GAS_URL: "您的_Google_Script_網址"
};
```

## 📐 技術架構

Vue.js 3 + Tailwind CSS 單頁應用，透過 CDN 載入，無需建置工具。資料存於瀏覽器 LocalStorage，可選配 Google Sheets 雲端備份。AI 引擎為 Google Gemini API，支援自動模型降級。

## 📄 授權

MIT License — 歡迎教育工作者自由使用與修改。
