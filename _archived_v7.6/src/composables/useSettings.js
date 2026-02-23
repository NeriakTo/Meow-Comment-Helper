import { ref, watch, onMounted } from 'vue';

const apiKey = ref('');
const keyTier = ref('free');
const gasUrl = ref('');
const gasSecret = ref('');
const isPublicMode = ref(false);
const isConfigLoaded = ref(false);

const initSettings = () => {
    // Load config from window if injected
    if (window.APP_CONFIG) {
        if (window.APP_CONFIG.GEMINI_API_KEY) {
            apiKey.value = window.APP_CONFIG.GEMINI_API_KEY;
            isConfigLoaded.value = true;
        }
        if (window.APP_CONFIG.GAS_URL) {
            gasUrl.value = window.APP_CONFIG.GAS_URL;
        }
    } else {
        // Load from LocalStorage
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) apiKey.value = savedKey;

        const savedGas = localStorage.getItem('gemini_gas_url');
        if (savedGas) gasUrl.value = savedGas;

        const savedSecret = localStorage.getItem('gas_secret');
        if (savedSecret) gasSecret.value = savedSecret;

        const savedTier = localStorage.getItem('gemini_key_tier');
        if (savedTier) keyTier.value = savedTier;
    }

    // Watchers
    watch(apiKey, (newVal) => {
        if (!isConfigLoaded.value && !isPublicMode.value) {
            localStorage.setItem('gemini_api_key', newVal);
        }
    });

    watch(gasUrl, (newVal) => localStorage.setItem('gemini_gas_url', newVal));
    watch(gasSecret, (newVal) => localStorage.setItem('gas_secret', newVal));
    watch(keyTier, (newVal) => localStorage.setItem('gemini_key_tier', newVal));

    watch(isPublicMode, (newVal) => {
        if (newVal) {
            localStorage.removeItem('gemini_api_key');
        } else {
            if (apiKey.value && !isConfigLoaded.value) {
                localStorage.setItem('gemini_api_key', apiKey.value);
            }
        }
    });
};

export function useSettings() {
    return {
        apiKey,
        keyTier,
        gasUrl,
        gasSecret,
        isPublicMode,
        initSettings
    };
}
