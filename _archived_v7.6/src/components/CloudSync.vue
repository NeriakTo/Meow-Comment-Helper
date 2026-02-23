  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border-[6px] border-blue-100">
       <div class="p-6 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
          <h3 class="font-black text-[#1565C0] text-2xl flex items-center gap-2"><span>☁️</span> 貓貓雲端同步</h3>
          <button @click="$emit('close')" class="text-3xl text-blue-300 hover:text-blue-500">×</button>
       </div>
       
       <div class="p-6 space-y-6">
          
          <div class="flex items-center gap-2 text-[#F57C00] font-bold cursor-pointer hover:underline" @click="openTutorial">
              <span>▶</span> 還沒有雲端貓窩？教我怎麼蓋一個！ 🛠️
          </div>

          <div>
             <label class="text-sm font-bold text-[#8D6E63] block mb-2">您的 GOOGLE SCRIPT 網址 (GAS URL)</label>
             <input type="text" v-model="gasUrl" placeholder="https://script.google.com/..." 
                    class="w-full text-sm p-4 border-2 border-[#FFE0B2] rounded-xl outline-none focus:border-[#FFB74D] shadow-inner text-gray-500 font-mono">
          </div>
          <div>
             <label class="text-sm font-bold text-[#8D6E63] block mb-2">🔐 通關密語 (SECRET TOKEN)</label>
             <input type="password" v-model="gasSecret" placeholder="......." 
                    class="w-full text-sm p-4 border-2 border-[#FFE0B2] rounded-xl outline-none focus:border-[#FFB74D] shadow-inner text-gray-500 font-mono tracking-widest">
             <div class="text-xs text-[#A1887F] mt-1">⚠️ 此密語須與 GAS 後端程式碼中的密語一致，才能成功同步。</div>
          </div>
          
          <div class="flex gap-4 pt-2">
             <button @click="handleUpload" :disabled="isSyncing || !gasUrl"
                     class="flex-1 py-4 bg-white border-2 border-[#FFB74D] text-[#FF6F00] font-black rounded-2xl shadow-sm hover:bg-[#FFF3E0] disabled:opacity-50 flex flex-col justify-center items-center gap-1 transition-transform active:scale-95">
                <span class="text-2xl bg-[#FFB74D] text-white w-8 h-8 flex items-center justify-center rounded-lg">↑</span>
                上傳備份
             </button>
             <button @click="handleDownload" :disabled="isSyncing || !gasUrl"
                     class="flex-1 py-4 bg-white border-2 border-[#42A5F5] text-[#1565C0] font-black rounded-2xl shadow-sm hover:bg-blue-50 disabled:opacity-50 flex flex-col justify-center items-center gap-1 transition-transform active:scale-95">
                <span class="text-2xl bg-[#42A5F5] text-white w-8 h-8 flex items-center justify-center rounded-lg">↓</span>
                下載還原
             </button>
          </div>

          <div v-if="status" class="text-center text-sm font-bold p-3 rounded-xl bg-gray-100 mt-2"
               :class="status.includes('❌') ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'">
             {{ status }}
          </div>

          <div class="border-t border-gray-100 pt-6 mt-4">
              <button @click="handlePanic" class="w-full py-3 bg-[#FF5252] text-white font-black rounded-xl shadow-lg hover:bg-[#FF1744] flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <span>🗑️</span> 清除所有敏感資料 (Panic Button)
              </button>
              <div class="text-center text-xs text-[#A1887F] mt-2">
                  ⚠️ 此操作將清除 API Key、GAS 網址、通關密語，並重新整理頁面。
              </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSettings } from '../composables/useSettings';
import { useStudentDB } from '../composables/useStudentDB';

const emit = defineEmits(['close']);
const { gasUrl, gasSecret } = useSettings();
const { db, activeClassId } = useStudentDB();

const isSyncing = ref(false);
const status = ref('');

const handleUpload = async () => {
    isSyncing.value = true;
    status.value = '☁️ 上傳中...';
    try {
        const payload = {
            secret: gasSecret.value || 'meow1234',
            data: db
        };
        // Use sendBeacon-like behavior logic with simple fetch
        const response = await fetch(gasUrl.value, { 
            method: 'POST', 
            body: JSON.stringify(payload) // CORS might be tricky with GAS, assumes Content-Type text/plain usually
        });
        const res = await response.json();
        if (res.result === 'success') {
            status.value = `✅ 成功! (${new Date().toLocaleTimeString()})`;
        } else {
            throw new Error(res.message || res.error || '驗證失敗');
        }
    } catch (e) {
        status.value = '❌ 失敗: ' + e.message;
    } finally {
        isSyncing.value = false;
    }
};

const handleDownload = async () => {
    if (!confirm('確定要從雲端還原嗎？這將覆蓋本機目前的所有資料。')) return;
    isSyncing.value = true;
    status.value = '☁️ 下載中...';
    try {
        const response = await fetch(gasUrl.value + (gasSecret.value ? `?secret=${gasSecret.value}` : '')); // Simple GET
        // Note: GAS POST/GET standardization depends on user Implementation. 
        // Assuming GET returns JSON data directly or wrapped.
        const cloudData = await response.json();
        
        // Handle wrapped data if necessary, here we assume it returns the DB object
        if (cloudData && cloudData.classes) {
            Object.assign(db, cloudData); // Reactive update
            status.value = `✅ 還原成功！`;
            // Force re-render of current view if needed
            // switchClass logic might be needed to reset detailed views
            confirm('還原完成，建議重新整理頁面以確保顯示正確。');
        } else {
            throw new Error('資料格式錯誤');
        }
    } catch (e) {
        status.value = '❌ 失敗: ' + e.message;
    } finally {
        isSyncing.value = false;
    }
};

const handlePanic = () => {
    if (confirm('🔥 確定要清除所有機密資料嗎？(包含 API Key, GAS 設定)')) {
        localStorage.clear();
        location.reload();
    }
};

const openTutorial = () => {
    window.open('https://github.com/kevin5531324/Meow-Comment-Helper', '_blank');
};
</script>
