<template>
  <div class="h-full p-4 md:p-8 overflow-y-auto pb-32 max-w-5xl mx-auto">
    <div class="mb-6 flex justify-between items-center">
       <h2 class="text-2xl font-bold text-[#5D4037]">行為量表評等</h2>
       <button @click="handleSetDefault" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition text-sm font-bold">
          ⚡ 一鍵預設 (大部分符合)
       </button>
    </div>

    <div v-if="currentStudent && currentStudent.behavior" class="space-y-6">
       <div v-for="(config, category) in BEHAVIOR_CONFIG" :key="category"
            class="bg-white rounded-3xl shadow-sm border-2 border-[#FFE0B2] p-6">
          <h3 class="text-lg font-bold text-[#5D4037] mb-4 pb-2 border-b border-[#FFE0B2]">【{{ category }}】</h3>
          
          <div class="space-y-4 mb-6">
             <div v-for="(item, idx) in config.items" :key="idx"
                  class="flex flex-col md:flex-row md:items-center gap-2">
                <label class="text-[#5D4037] font-medium flex-1">{{ item }}</label>
                <select v-model="currentStudent.behavior[category].items[idx]"
                        class="px-3 py-2 border-2 border-[#FFE0B2] rounded-xl bg-white outline-none focus:border-[#FFB74D] w-full md:w-auto">
                   <option value="">請選擇</option>
                   <option v-for="opt in BEHAVIOR_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
                </select>
             </div>
          </div>
          
          <div class="pt-4 border-t border-[#FFE0B2]">
             <label class="text-sm font-bold text-[#8D6E63] block mb-2">具體建議：</label>
             <textarea v-model="currentStudent.behavior[category].suggestion" 
                       rows="2" placeholder="請輸入具體建議..."
                       class="w-full p-3 border-2 border-[#FFE0B2] rounded-xl resize-none outline-none focus:border-[#FFB74D]"></textarea>
          </div>
       </div>
    </div>
    <div v-else class="text-center py-20 text-[#8D6E63]">
       請先選擇學生...
    </div>
  </div>
</template>

<script setup>
import { useStudentDB } from '../composables/useStudentDB';
import { BEHAVIOR_CONFIG, BEHAVIOR_OPTIONS } from '../config/constants';

const { currentStudent, initializeStudentData, db } = useStudentDB();

const handleSetDefault = () => {
    if (!currentStudent.value) return;
    initializeStudentData(currentStudent.value);
    Object.keys(BEHAVIOR_CONFIG).forEach(category => {
        BEHAVIOR_CONFIG[category].items.forEach((_, idx) => {
            currentStudent.value.behavior[category].items[idx] = '大部分符合';
        });
    });
    // Trigger reactive update if needed
    db.activeClassId = db.activeClassId;
};
</script>
