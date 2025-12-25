import { saveApiKey, getApiKey } from '../storage';

// Interfaces
interface MessageResponse {
  success: boolean;
  message?: string;
  answer?: string;
  error?: string;
}

// Elements
const apiKeySection = document.getElementById('apiKeySection')!;
const mainSection = document.getElementById('mainSection')!;
const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
const saveKeyBtn = document.getElementById('saveKeyBtn')!;
const settingsBtn = document.getElementById('settingsBtn')!;

const statusIndicator = document.getElementById('statusIndicator')!;
const statusText = document.getElementById('statusText')!;
const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
const analyzeHeroBtn = document.getElementById('analyzeHeroBtn') as HTMLButtonElement;
const emptyState = document.getElementById('emptyState')!;

const chatInterface = document.getElementById('chatInterface')!;
const messagesArea = document.getElementById('messagesArea')!;
const questionInput = document.getElementById('questionInput') as HTMLTextAreaElement;
const askBtn = document.getElementById('askBtn') as HTMLButtonElement;

const loader = document.getElementById('loader')!;
const loadingText = document.getElementById('loadingText')!;

// State
let isAnalyzed = false;

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  await checkApiKey();
});

// Settings / API Key Management
settingsBtn.addEventListener('click', async () => {
    if(apiKeySection.classList.contains('hidden')) {
        showSection('settings');
    } else {
        await checkApiKey();
    }
});

saveKeyBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    await saveApiKey(key);
    apiKeyInput.value = '';
    await checkApiKey();
  }
});

async function checkApiKey() {
  const key = await getApiKey();
  if (key) {
    showSection('main');
  } else {
    showSection('settings');
  }
}

function showSection(section: 'settings' | 'main') {
  if (section === 'settings') {
    apiKeySection.classList.remove('hidden');
    mainSection.classList.add('hidden');
  } else {
    apiKeySection.classList.add('hidden');
    mainSection.classList.remove('hidden');
  }
}

// Analysis Flow
const triggerAnalysis = async () => {
  setLoading(true, 'Analyzing Page...');
  try {
    const response = await chrome.runtime.sendMessage({ action: 'ANALYZE_PAGE' }) as MessageResponse;
    if (response.success) {
      isAnalyzed = true;
      updateStatus(true, 'Page Analyzed');
      analyzeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Re-analyze`;
      
      // Hide empty state, show chat
      emptyState.classList.add('hidden');
      chatInterface.classList.remove('hidden');
      
      // Initial greeting if empty
      if (messagesArea.children.length === 0) {
        addMessage('I have analyzed this page. What would you like to know?', 'bot');
      }
    } else {
      updateStatus(false, response.error || 'Analysis failed');
    }
  } catch (error: any) {
    updateStatus(false, 'Connection failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

analyzeBtn.addEventListener('click', triggerAnalysis);
analyzeHeroBtn.addEventListener('click', triggerAnalysis);

function updateStatus(success: boolean, text: string) {
  statusText.textContent = text;
  statusIndicator.className = 'dot ' + (success ? 'ready' : 'error');
}

// Chat Flow
askBtn.addEventListener('click', handleAsk);
questionInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleAsk();
  }
});

questionInput.addEventListener('input', () => {
    askBtn.disabled = !questionInput.value.trim();
    // Auto grow
    questionInput.style.height = 'auto';
    questionInput.style.height = Math.min(questionInput.scrollHeight, 100) + 'px';
});

async function handleAsk() {
  const question = questionInput.value.trim();
  if (!question) return;

  if (!isAnalyzed) {
    addMessage('Please analyze the page first.', 'error');
    return;
  }

  addMessage(question, 'user');
  questionInput.value = '';
  questionInput.style.height = 'auto'; // Reset height
  askBtn.disabled = true;

  setLoading(true, 'Thinking...');

  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'ASK_QUESTION', 
      question 
    }) as MessageResponse;

    if (response.success && response.answer) {
      addMessage(response.answer, 'bot');
    } else {
      addMessage(response.error || 'Failed to get answer.', 'error');
    }
  } catch (error: any) {
    addMessage('Error: ' + error.message, 'error');
  } finally {
    setLoading(false);
    askBtn.disabled = false;
    questionInput.focus();
  }
}

function addMessage(text: string, type: 'user' | 'bot' | 'error') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  msgDiv.textContent = text; 
  messagesArea.appendChild(msgDiv);
  messagesArea.scrollTo({ top: messagesArea.scrollHeight, behavior: 'smooth' });
}

function setLoading(isLoading: boolean, text?: string) {
  if (isLoading) {
    loader.classList.remove('hidden');
    if (text) loadingText.textContent = text;
  } else {
    loader.classList.add('hidden');
  }
}
