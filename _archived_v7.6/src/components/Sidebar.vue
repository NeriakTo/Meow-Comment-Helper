<template>
  <div class="h-full flex flex-col bg-white border-r-2 border-[#FFE0B2] shadow-xl z-20 transition-all duration-300 relative"
       :class="isSidebarOpen ? 'w-80 translate-x-0 absolute md:relative' : 'w-0 md:w-80 -translate-x-full md:translate-x-0 absolute md:relative overflow-hidden md:overflow-visible'">
    
    <!-- Header -->
    <div class="p-4 bg-gradient-to-r from-[#FFF3E0] to-white border-b-2 border-[#FFE0B2] shrink-0">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-xl font-black text-[#5D4037] tracking-tight flex items-center gap-2">
          <span>🐱</span> 喵嗚評語助手 <span class="text-xs bg-[#FFB74D] text-white px-1.5 py-0.5 rounded-md">V7.6</span>
        </h1>
        <button @click="emit('toggle-class-manager')" class="p-1.5 hover:bg-[#FFE0B2] rounded-lg transition text-[#8D6E63]" title="班級管理">
          ⚙️
        </button>
      </div>

      <!-- Class Info -->
      <div class="bg-white/80 rounded-2xl p-3 border border-[#FFE0B2] shadow-sm mb-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-[#8D6E63] uppercase tracking-wider">Current Class</span>
          <span class="text-[10px] bg-[#E8F5E9] text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">
            {{ db.classes[db.activeClassId]?.students?.length || 0 }} 人
          </span>
        </div>
        <div class="font-bold text-lg text-[#5D4037] truncate">{{ currentClassData.name }}</div>
      </div>

      <!-- Search -->
      <div class="relative group">
        <input type="text" v-model="searchQuery" placeholder="輸入姓名或座號..."
               class="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#FFE0B2] rounded-xl text-sm focus:border-[#FFB74D] outline-none transition-all shadow-sm group-hover:shadow-md">
        <span class="absolute left-3 top-2.5 text-[#FFB74D]">🔍</span>
      </div>
    </div>

    <!-- Student List -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2 no-scrollbar">
      <template v-if="filteredStudents.length > 0">
        <div v-for="student in filteredStudents" :key="student.id"
             @click="selectStudent(student.originalIndex)"
             class="group p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden"
             :class="currentIdx === student.originalIndex ? 
                'bg-[#FFF3E0] border-[#FFB74D] shadow-md scale-[1.02] z-10' : 
                'bg-white border-transparent hover:border-[#FFE0B2] hover:bg-white'">
          
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-3">
              <div class="font-mono text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors shrink-0"
                   :class="currentIdx === student.originalIndex ? 'bg-[#FFB74D] text-white border-[#FFB74D]' : 'bg-[#FFF8F0] text-[#8D6E63] border-[#FFE0B2]'">
                 {{ student.id }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-bold text-[#5D4037] text-base group-hover:text-[#FF6F00] transition-colors truncate">
                  {{ student.name || '未命名' }}
                </span>
                <span class="text-[11px] text-[#A1887F] truncate">
                   {{ student.polished_comment ? '✨ 已生成評語' : (student.raw_comment ? '📝 已有紀錄' : '☁️ 尚未開始') }}
                </span>
              </div>
            </div>
            <div v-if="student.polished_comment" class="text-xl animate-bounce">😺</div>
          </div>
        </div>
      </template>
      <div v-else class="text-center py-10 text-[#A1887F] opacity-60">
        <div class="text-4xl mb-2">😿</div>
        <p>找不到這隻貓咪...</p>
      </div>
    </div>

    <!-- Footer Actions -->
    <!-- Footer Info -->
    <div class="p-2 text-center text-[10px] text-[#D7CCC8] border-t border-[#FFE0B2]">
       Meow Helper v7.6
    </div>
  </div>
</template>

<script setup>
import { useStudentDB } from '../composables/useStudentDB';

const { 
  db, currentClassData, filteredStudents, currentIdx, searchQuery, 
  selectStudent, isSidebarOpen
} = useStudentDB();

const emit = defineEmits(['toggle-class-manager', 'open-cloud-sync', 'export-excel', 'open-panic']);
</script>
