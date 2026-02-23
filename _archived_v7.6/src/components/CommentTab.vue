<template>
  <div class="h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto pb-32">
    
    <!-- Header -->
    <div class="flex items-center gap-4 mb-2">
      <div class="font-mono text-3xl md:text-5xl font-black text-[#FFB74D] drop-shadow-sm">{{ currentStudent.id }}</div>
      <div>
        <input type="text" v-model="currentStudent.name" placeholder="請輸入姓名"
               class="text-2xl md:text-4xl font-black text-[#5D4037] bg-transparent border-b-2 border-dashed border-[#FFCC80] focus:border-[#FFB74D] outline-none w-full placeholder-[#D7CCC8]">
      </div>
    </div>

    <!-- Main Grid -->
    <div class="flex flex-col lg:flex-row gap-6 h-full">
      
      <!-- Left: Raw Input & Tags -->
      <div class="flex-1 flex flex-col gap-4">
        <!-- Tags Area -->
        <div class="bg-white rounded-3xl p-4 shadow-sm border border-[#FFE0B2]">
           <div class="flex justify-between items-center mb-3">
             <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button v-for="subject in ['一般導師', '國語文', '數學', '英語文', '藝術', '健康與體育', '自然科學', '社會']" :key="subject"
                        @click="selectedSubject = subject"
                        class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border"
                        :class="selectedSubject === subject ? 'bg-[#FFB74D] text-white border-[#FFB74D]' : 'bg-transparent text-[#8D6E63] border-[#FFE0B2] hover:bg-[#FFF3E0]'">
                  {{ subject }}
                </button>
             </div>
             <!-- Edit Tags Toggle -->
             <button @click="isEditingTags = !isEditingTags" class="text-xs text-[#8D6E63] underline shrink-0 ml-2">
               {{ isEditingTags ? '完成' : '編輯' }}
             </button>
           </div>
           
           <div class="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
              <button v-for="(tag, idx) in currentTags" :key="idx"
                      @click="isEditingTags ? null : addTag(tag)"
                      class="px-3 py-1.5 rounded-xl text-sm transition-all duration-200 border relative group"
                      :class="isEditingTags ? 'bg-gray-50 border-gray-200 cursor-default pl-2 pr-7' : 'bg-[#FFF8F0] border-[#FFE0B2] text-[#6D4C41] hover:bg-[#FFE0B2] shadow-sm hover:-translate-y-0.5'">
                 {{ tag }}
                 <span v-if="isEditingTags" @click.stop="removeCustomTag(idx)" 
                       class="absolute right-1 top-1.5 w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs hover:bg-red-200 cursor-pointer">×</span>
              </button>
              
              <!-- Add Tag Input -->
              <div v-if="isEditingTags" class="flex gap-1">
                 <input type="text" v-model="newTagInput" @keyup.enter="handleDetailAddTag" placeholder="新標籤"
                        class="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#FFB74D]">
                 <button @click="handleDetailAddTag" class="text-green-600 font-bold">+</button>
                 <button @click="resetTags" class="text-xs text-red-400 underline ml-1">重置</button>
              </div>
           </div>
        </div>

        <!-- Raw Textarea -->
        <div class="flex-1 bg-white rounded-3xl p-4 shadow-sm border-2 border-[#FFE0B2] relative group focus-within:border-[#FFB74D] transition-colors flex flex-col">
          <textarea v-model="currentStudent.raw_comment" 
                    class="flex-1 w-full resize-none outline-none text-[#5D4037] text-base leading-relaxed placeholder-[#D7CCC8]"
                    placeholder="請輸入觀察紀錄，或點擊上方標籤..."></textarea>
          <div class="text-right mt-2 text-xs text-[#D7CCC8] font-bold pointer-events-none">
             {{ currentStudent.raw_comment.length }} 字
          </div>
        </div>
      </div>

      <!-- Right: AI Result -->
      <div class="flex-1 flex flex-col gap-4">
         
         <!-- Motto (Top) -->
         <div class="bg-white rounded-3xl p-4 shadow-sm border border-[#FFE0B2] flex items-center gap-3 relative overflow-hidden"
              :class="currentStudent.locked_motto ? 'bg-gray-50' : ''">
            <div class="bg-[#FFCC80] text-white text-xs font-bold px-2 py-0.5 rounded absolute top-0 left-0">Motto</div>
            <button @click="currentStudent.locked_motto = !currentStudent.locked_motto" 
                   class="absolute top-2 right-2 text-sm z-10 opacity-50 hover:opacity-100">
               {{ currentStudent.locked_motto ? '🔒' : '🔓' }}
            </button>
            <div class="text-center w-full pt-2">
               <input type="text" v-model="currentStudent.motto" placeholder="等待生成..."
                      :readonly="currentStudent.locked_motto"
                      class="w-full text-xl font-bold text-[#5D4037] tracking-widest font-serif text-center outline-none bg-transparent placeholder-[#E0E0E0]">
            </div>
         </div>

         <!-- Comment (Bottom) -->
         <div class="flex-1 flex flex-col bg-white rounded-3xl shadow-lg border-2 overflow-hidden ring-1 ring-[#FFE0B2] relative transition-all"
               :class="currentStudent.locked_comment ? 'border-red-300' : 'border-[#FFCC80]'">
            
            <div class="p-3 bg-gradient-to-r from-[#FFF8F0] to-white border-b border-[#FFCC80] flex justify-between items-center">
               <h3 class="font-bold text-[#5D4037] flex items-center gap-2 text-sm">✨ 老師評語</h3>
               <div class="flex items-center gap-2">
                  <button v-if="currentStudent.polished_comment" @click="copyResult" class="text-xs text-[#8D6E63] font-bold hover:bg-[#FFF3E0] px-2 py-1 rounded-2xl transition">複製</button>
                  
                  <!-- History Controls -->
                  <div class="flex items-center gap-1 border-l border-r border-[#FFCC80] px-2 mx-1">
                     <button @click="undo" :disabled="!canUndo"
                             class="text-sm px-2 py-0.5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFF3E0]" title="Undo">↩</button>
                     <button @click="redo" :disabled="!canRedo"
                             class="text-sm px-2 py-0.5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFF3E0]" title="Redo">↪</button>
                  </div>

                  <button @click="currentStudent.locked_comment = !currentStudent.locked_comment" 
                          class="text-sm px-2 py-0.5 rounded-full transition-all"
                          :class="currentStudent.locked_comment ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'">
                      {{ currentStudent.locked_comment ? '🔒' : '🔓' }}
                  </button>
               </div>
            </div>

            <textarea v-model="currentStudent.polished_comment" 
                      @blur="handleBlur"
                      :readonly="currentStudent.locked_comment"
                      class="flex-1 w-full p-4 md:p-6 pb-20 resize-none focus:outline-none text-[#5D4037] leading-relaxed text-sm md:text-base transition-all"
                      :class="currentStudent.locked_comment ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'"
                      placeholder="貓貓生成的暖心評語將顯示於此..."></textarea>
            
            <!-- FAB -->
            <div class="absolute bottom-6 right-6 z-10">
               <button @click="handleGenerate" :disabled="isGenerating"
                       class="flex items-center justify-center gap-2 px-8 py-4 rounded-full shadow-xl transition-all transform active:scale-95 hover:scale-110 disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none text-white font-bold text-base bg-[#FFB74D] hover:bg-[#FFA726]">
                   <span v-if="isGenerating">🐾 思考中...</span>
                   <span v-else>🐾 幫我寫</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStudentDB } from '../composables/useStudentDB';
import { useAI } from '../composables/useAI';
import { useHistory } from '../composables/useHistory';
import { DEFAULT_TAGS } from '../config/constants';

const { currentStudent, currentTags, selectedSubject, db } = useStudentDB();
const { isGenerating, generateComment } = useAI();
const { undo, redo, pushToHistory, canUndo, canRedo } = useHistory(currentStudent);

const isEditingTags = ref(false);
const newTagInput = ref('');

const addTag = (tag) => {
    if (currentStudent.value) {
        currentStudent.value.raw_comment += (currentStudent.value.raw_comment ? '、' : '') + tag;
    }
};

const handleDetailAddTag = () => {
    const tagName = newTagInput.value.trim();
    if (!tagName) return;
    if (!db.customTags) db.customTags = JSON.parse(JSON.stringify(DEFAULT_TAGS));
    if (!db.customTags[selectedSubject.value]) {
        db.customTags[selectedSubject.value] = [...(DEFAULT_TAGS[selectedSubject.value] || [])];
    }
    if (!db.customTags[selectedSubject.value].includes(tagName)) {
        db.customTags[selectedSubject.value].push(tagName);
    }
    newTagInput.value = '';
};

const removeCustomTag = (index) => {
    if (!db.customTags || !db.customTags[selectedSubject.value]) return;
    if (confirm(`確定刪除？`)) {
        db.customTags[selectedSubject.value].splice(index, 1);
    }
};

const resetTags = () => {
    if (confirm(`還原預設？`)) {
        if (!db.customTags) db.customTags = {};
        db.customTags[selectedSubject.value] = [...(DEFAULT_TAGS[selectedSubject.value] || [])];
    }
};

const handleBlur = () => {
    if (currentStudent.value) pushToHistory(currentStudent.value.polished_comment);
};

const handleGenerate = () => {
    generateComment(currentStudent.value, pushToHistory);
};

const copyResult = () => {
    if (currentStudent.value && currentStudent.value.polished_comment) {
        navigator.clipboard.writeText(currentStudent.value.polished_comment);
    }
};
</script>
