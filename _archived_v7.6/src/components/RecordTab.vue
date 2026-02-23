<template>
  <div class="h-full p-4 md:p-8 overflow-y-auto pb-32 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold text-[#5D4037] mb-6">多元表現紀錄</h2>

    <div v-if="currentStudent && currentStudent.records" class="space-y-4">
       <div class="bg-white rounded-3xl shadow-sm border-2 border-[#FFE0B2] p-6">
          <label class="font-bold text-[#5D4037] block mb-2">團體活動紀錄</label>
          <textarea v-model="currentStudent.records.groupActivity" rows="3" 
                    class="w-full p-3 border-2 border-[#FFE0B2] rounded-xl resize-none outline-none focus:border-[#FFB74D]"></textarea>
       </div>
       
       <div class="bg-white rounded-3xl shadow-sm border-2 border-[#FFE0B2] p-6">
          <label class="font-bold text-[#5D4037] block mb-2">公共服務紀錄 - 校內</label>
          <textarea v-model="currentStudent.records.publicServiceSchool" rows="3" 
                    class="w-full p-3 border-2 border-[#FFE0B2] rounded-xl resize-none outline-none focus:border-[#FFB74D]"></textarea>
       </div>

       <div class="bg-white rounded-3xl shadow-sm border-2 border-[#FFE0B2] p-6">
          <label class="font-bold text-[#5D4037] block mb-2">公共服務紀錄 - 社區</label>
          <textarea v-model="currentStudent.records.publicServiceCommunity" rows="3" 
                    class="w-full p-3 border-2 border-[#FFE0B2] rounded-xl resize-none outline-none focus:border-[#FFB74D]"></textarea>
       </div>

       <div class="bg-white rounded-3xl shadow-sm border-2 border-[#FFE0B2] p-6">
          <label class="font-bold text-[#5D4037] block mb-2">特殊表現 - 校內</label>
          <textarea v-model="currentStudent.records.specialPerformanceSchool" rows="3" 
                    class="w-full p-3 border-2 border-[#FFE0B2] rounded-xl resize-none outline-none focus:border-[#FFB74D]"></textarea>
       </div>

       <div class="bg-white rounded-3xl shadow-sm border-2 border-[#FFE0B2] p-6">
          <label class="font-bold text-[#5D4037] block mb-2">特殊表現 - 校外</label>
          <textarea v-model="currentStudent.records.specialPerformanceExternal" rows="3" 
                    class="w-full p-3 border-2 border-[#FFE0B2] rounded-xl resize-none outline-none focus:border-[#FFB74D]"></textarea>
       </div>
    </div>
    <div v-else class="text-center py-20 text-[#8D6E63]">
       請先選擇學生...
    </div>
  </div>
</template>

<script setup>
import { useStudentDB } from '../composables/useStudentDB';
const { currentStudent } = useStudentDB();
</script>
