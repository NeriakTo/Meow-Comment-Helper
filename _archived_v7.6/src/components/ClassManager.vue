<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border-[6px] border-[#FFE0B2]">
      
      <!-- Custom Header -->
      <div class="p-6 bg-[#FFE0B2] flex justify-between items-center shrink-0">
        <h2 class="text-2xl font-black text-[#5D4037] flex items-center gap-2">
           <span class="text-3xl">🏠</span> 貓窩管理
        </h2>
        <button @click="$emit('close')" class="text-3xl text-[#8D6E63] hover:text-[#5D4037] transition-transform hover:scale-110">×</button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 space-y-8 bg-white">
        
        <!-- Class List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div v-for="(cls, id) in db.classes" :key="id"
                  class="p-4 rounded-3xl border-[3px] transition-all relative group cursor-pointer"
                  :class="db.activeClassId === id ? 'border-[#FFB74D] bg-[#FFF8E1]' : 'border-gray-200 hover:border-[#FFE0B2]'"
                  @click="handleSwitch(id)">
                
                <div v-if="db.activeClassId === id" class="absolute top-4 right-4 bg-white border border-[#FFB74D] text-[#FF6F00] text-xs font-bold px-2 py-0.5 rounded-full">
                    當前
                </div>

                <div class="font-black text-[#5D4037] text-xl mb-1">{{ cls.name }}</div>
                <div class="text-sm text-[#8D6E63]">
                    {{ cls.grade || '?' }}年{{ cls.classNum || '?' }}班 
                    <span v-if="cls.alias" class="text-gray-400">({{ cls.alias }})</span>
                </div>
                <div class="text-xs text-[#A1887F] mt-2 font-bold">{{ cls.students?.length || 0 }} 隻小貓</div>
                
                <button @click.stop="deleteClass(id)" 
                        class="absolute bottom-4 right-4 p-2 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    🗑️
                </button>
             </div>
        </div>

        <hr class="border-t border-[#FFE0B2]/50" />

        <!-- Add New Class -->
        <div class="bg-[#FFF8F0] rounded-3xl p-6 border-[3px] border-[#FFE0B2]">
           <h3 class="font-bold text-[#5D4037] mb-4 flex items-center gap-2">
              <span class="bg-[#8D6E63] text-white text-xs px-1 rounded">NEW</span> 建立新班級
           </h3>
           
           <div class="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div class="flex flex-col">
                  <label class="text-xs text-[#8D6E63] font-bold mb-1">年級 (數字)</label>
                  <input type="number" v-model="newGrade" placeholder="如: 4" 
                         class="p-3 rounded-2xl border-2 border-[#FFE0B2] outline-none focus:border-[#FFB74D] text-center font-bold text-[#5D4037]">
              </div>
              <div class="flex flex-col">
                  <label class="text-xs text-[#8D6E63] font-bold mb-1">班序 (數字)</label>
                  <input type="number" v-model="newClassNum" placeholder="如: 7" 
                         class="p-3 rounded-2xl border-2 border-[#FFE0B2] outline-none focus:border-[#FFB74D] text-center font-bold text-[#5D4037]">
              </div>
           </div>

           <div class="mb-4">
              <label class="text-xs text-[#8D6E63] font-bold mb-1 flex items-center gap-1">別名： <span class="font-normal text-gray-400">(選填)</span></label>
              <input type="text" v-model="newAlias" placeholder="選填" 
                     class="w-full p-3 rounded-2xl border-2 border-[#FFE0B2] outline-none focus:border-[#FFB74D] text-[#5D4037]">
           </div>

           <div class="flex items-end gap-4">
               <div class="w-1/3">
                   <label class="text-xs text-[#8D6E63] font-bold mb-1">人數：</label>
                   <input type="number" v-model="newCount" 
                          class="w-full p-3 rounded-2xl border-2 border-[#FFE0B2] outline-none focus:border-[#FFB74D] text-center font-bold">
               </div>
               <button @click="handleCreate" class="flex-1 py-3 bg-[#FFB74D] text-white font-black text-lg rounded-2xl shadow-md hover:bg-[#FFA726] transition-transform active:scale-95">
                  建立
               </button>
           </div>
        </div>

        <!-- Import -->
        <div class="bg-[#FFF8F0] rounded-3xl p-6 border-[3px] border-[#FFE0B2]">
           <h3 class="font-bold text-[#5D4037] mb-4 flex items-center gap-2">
              <span>📂</span> 匯入舊 Excel
           </h3>
           <label class="flex items-center justify-center w-full p-4 bg-white border-2 border-dashed border-[#FFE0B2] rounded-2xl cursor-pointer hover:border-[#FFB74D] hover:bg-[#FFFDE7] transition-colors">
               <span class="font-bold text-[#8D6E63]">選擇檔案匯入</span>
               <input type="file" accept=".xlsx" @change="onFileChange" class="hidden">
           </label>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStudentDB } from '../composables/useStudentDB';

const emit = defineEmits(['close']);
const { db, createClass, switchClass, deleteClass, handleImportExcel } = useStudentDB();

const newGrade = ref('');
const newClassNum = ref('');
const newAlias = ref('');
const newCount = ref(30);

const handleSwitch = (id) => {
    switchClass(id);
    emit('close');
};

const handleCreate = () => {
    if ((!newGrade.value || !newClassNum.value) && !newAlias.value) {
        alert('請至少輸入年級/班級或別名');
        return;
    }
    createClass(null, newGrade.value, newClassNum.value, newCount.value, newAlias.value);
    emit('close');
};

const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        await handleImportExcel(file);
        emit('close');
    } catch(err) {
        alert(err.message);
    }
};
</script>
