<template>
  <div class="flex h-full w-full bg-[#FFF8F0] relative overflow-hidden">
    
    <!-- Sidebar -->
    <Sidebar 
      @toggle-class-manager="showClassManager = true"
      @open-cloud-sync="showCloudModal = true"
      @export-excel="handleExport"
      @open-panic="handlePanic"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300"
         :class="isSidebarOpen ? 'ml-0 opacity-50 md:opacity-100' : ''">
       
       <!-- Desktop Top Bar (New V7.5 Style) -->
       <div class="hidden md:flex items-center justify-between p-2 px-4 bg-[#FFF8E1] border-b border-[#FFE0B2] shrink-0 gap-4">
          <!-- Left: Key Settings -->
          <div class="flex items-center gap-3">
             <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-[#FFE0B2]">
                <span class="text-xs">🔑</span>
                <span class="text-xs font-bold text-green-500" v-if="apiKey">OK</span>
                <input v-else type="password" v-model="apiKey" placeholder="Input Key..." 
                       class="w-24 text-xs outline-none bg-transparent">
             </div>
             
             <label class="flex items-center gap-1 text-xs text-[#8D6E63] font-bold cursor-pointer">
                <input type="checkbox" v-model="isPublicMode" class="accent-[#FFB74D]">
                公用
             </label>
             <span class="text-[10px] bg-[#8D6E63] text-white rounded-full w-4 h-4 flex items-center justify-center cursor-help" title="公用電腦模式：重整後自動清除 Key">?</span>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-3">
             <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-[#8D6E63]">領域：</span>
                <select v-model="selectedSubject" class="text-xs font-bold text-[#5D4037] bg-white border border-[#FFE0B2] px-2 py-1 rounded-lg outline-none focus:border-[#FFB74D]">
                   <option v-for="s in ['一般導師', '國語文', '數學', '英語文', '藝術', '健康與體育', '自然科學', '社會']" :key="s" :value="s">{{ s }}</option>
                </select>
             </div>

             <button @click="showCloudModal = true" class="flex items-center gap-1 px-3 py-1.5 bg-[#42A5F5] hover:bg-[#2196F3] text-white rounded-lg text-xs font-bold shadow-sm transition">
                ☁️ 同步
             </button>
             <button @click="handleExport" class="flex items-center gap-1 px-3 py-1.5 bg-[#00C853] hover:bg-[#00E676] text-white rounded-lg text-xs font-bold shadow-sm transition">
                📥 匯出
             </button>
          </div>
       </div>

       <!-- Mobile Header (Simplified) -->
       <div class="md:hidden flex items-center p-3 bg-white border-b border-[#FFE0B2] justify-between">
          <button @click="isSidebarOpen = !isSidebarOpen" class="text-2xl">🍔</button>
          <h1 class="font-bold text-[#5D4037]">喵嗚評語助手</h1>
          <button @click="showCloudModal = true" class="text-xl">☁️</button>
       </div>

       <!-- Tabs Header -->
       <div v-if="currentStudent" class="bg-white border-b border-[#FFE0B2] flex shrink-0 overflow-x-auto no-scrollbar">
          <button v-for="tab in tabs" :key="tab.id"
                  @click="activeTab = tab.id"
                  class="flex-1 px-4 py-3 text-center font-bold text-sm md:text-base border-b-4 transition-colors whitespace-nowrap"
                  :class="activeTab === tab.id ? 'border-[#FFB74D] text-[#FF6F00] bg-[#FFF3E0]' : 'border-transparent text-[#A1887F] hover:bg-gray-50'">
             {{ tab.label }}
          </button>
       </div>

       <!-- Tab Content -->
       <div v-if="currentStudent" class="flex-1 overflow-hidden relative bg-[#FFF8F0]">
          <CommentTab v-if="activeTab === 'comment'" />
          <BehaviorTab v-if="activeTab === 'behavior'" />
          <RecordTab v-if="activeTab === 'records'" />
       </div>

       <!-- Empty State -->
       <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div class="text-9xl mb-6 cursor-pointer hover:scale-110 transition drop-shadow-lg"
               @click="isSidebarOpen = true">😺</div>
          <p class="text-2xl font-bold text-[#5D4037] mb-2">歡迎來到喵嗚評語助手 V7.6！</p>
          <p class="text-lg text-[#8D6E63] mb-4">點擊左上角選單，選擇一隻小貓吧 🐾</p>
          <button v-if="!apiKey" @click="showWizard = true" class="px-6 py-2 bg-[#FFB74D] text-white rounded-full font-bold shadow-lg hover:bg-[#FFA726]">
             設定 API Key
          </button>
       </div>
    </div>

    <!-- Modals -->
    <ClassManager v-if="showClassManager" @close="showClassManager = false" />
    <CloudSync v-if="showCloudModal" @close="showCloudModal = false" />
    <Wizard v-if="showWizard" @close="showWizard = false" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import CommentTab from './components/CommentTab.vue';
import BehaviorTab from './components/BehaviorTab.vue';
import RecordTab from './components/RecordTab.vue';
import ClassManager from './components/ClassManager.vue';
import CloudSync from './components/CloudSync.vue';
import Wizard from './components/Wizard.vue';

import { useStudentDB } from './composables/useStudentDB';
import { useSettings } from './composables/useSettings';
import * as XLSX from 'xlsx';

const { isSidebarOpen, currentStudent, db, currentClassData, switchClass, initDB, selectedSubject } = useStudentDB();
const { apiKey, initSettings, isPublicMode } = useSettings();

const activeTab = ref('comment');
const showClassManager = ref(false);
const showCloudModal = ref(false);
const showWizard = ref(false);

const tabs = [
    { id: 'comment', label: '1. 評語撰寫' },
    { id: 'behavior', label: '2. 行為量表' },
    { id: 'records', label: '3. 多元紀錄' }
];

onMounted(() => {
    initDB(); // Load DB
    initSettings();
    if (!apiKey.value && !localStorage.getItem('gemini_api_key')) {
        showWizard.value = true;
    }
    // Logic to show class manager if no classes exists is handled in ClassManager or DB init
    const savedDB = localStorage.getItem('gemini_comments_v4_db');
    if (!savedDB) {
        showClassManager.value = true;
    }
});

const handleExport = () => {
    if (!currentClassData.value) return;
    const wb = XLSX.utils.book_new();
    // Export implementation (Simplified for now, similar to Logic)
    // Detailed export logic can be extracted to useStudentDB or useExport
    alert('匯出功能暫時簡化'); 
};

// Panic logic moved to CloudSync or kept here? Kept here for global access if needed, 
// strictly speaking CloudSync handles it now, but we can pass it or keep it.
// Let's remove handlePanic from here if it is fully handled in CloudSync, 
// BUT ClassManager/Sidebar emitted it. Sidebar no longer emits it.
// CloudSync will handle it internally.

</script>
