<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative">
       
       <div class="p-8 text-center bg-[#FFF8F0]">
          <div class="text-6xl mb-4">😺</div>
          <h2 class="text-2xl font-black text-[#5D4037] mb-2">歡迎使用喵嗚評語助手！</h2>
          <p class="text-[#8D6E63]">只要三個步驟，立即開始您的療癒評語之旅。</p>
       </div>

       <div class="p-8 flex-1">
          <div class="mb-6">
             <label class="font-bold text-[#5D4037] block mb-2">請輸入您的 Google Gemini API Key</label>
             <input type="password" v-model="inputKey" placeholder="AIzaSy..." 
                    class="w-full p-3 rounded-xl border-2 border-[#FFE0B2] focus:border-[#FFB74D] outline-none">
             <p class="text-xs text-[#A1887F] mt-2">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" class="underline text-[#FFB74D]">取得免費 Key</a>
             </p>
          </div>

          <div class="flex items-center gap-2 mb-6">
             <input type="checkbox" id="publicMode" v-model="isPublic" class="w-5 h-5 accent-[#FFB74D]">
             <label for="publicMode" class="text-sm text-[#5D4037] font-bold">這是一台公用電腦 (不儲存 Key)</label>
          </div>

          <button @click="handleComplete" 
                  class="w-full py-4 bg-[#FFB74D] text-white font-bold rounded-2xl shadow-lg hover:bg-[#FFA726] transition disabled:opacity-50"
                  :disabled="!inputKey">
             開始使用 🚀
          </button>
       </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSettings } from '../composables/useSettings';

const emit = defineEmits(['close']);
const { apiKey, isPublicMode } = useSettings();

const inputKey = ref('');
const isPublic = ref(false);

const handleComplete = () => {
    if (inputKey.value) {
        isPublicMode.value = isPublic.value;
        apiKey.value = inputKey.value; // Watcher will handle saving
        emit('close');
    }
};
</script>
