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

// const statusCard = document.getElementById('statusCard')!;
const statusIndicator = document.getElementById('statusIndicator')!;
const statusText = document.getElementById('statusText')!;
const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;

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
    // Toggle between views or just force show settings
    if(apiKeySection.classList.contains('hidden')) {
        showSection('settings');
    } else {
        await checkApiKey(); // go back if key exists
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
analyzeBtn.addEventListener('click', async () => {
  setLoading(true, 'Analyzing Page...');
  try {
    const response = await chrome.runtime.sendMessage({ action: 'ANALYZE_PAGE' }) as MessageResponse;
    if (response.success) {
      isAnalyzed = true;
      updateStatus(true, 'Page Analyzed');
      analyzeBtn.textContent = 'Re-analyze';
      chatInterface.classList.remove('hidden');
    } else {
      updateStatus(false, response.error || 'Analysis failed');
    }
  } catch (error: any) {
    updateStatus(false, 'Connection failed: ' + error.message);
  } finally {
    setLoading(false);
  }
});

function updateStatus(success: boolean, text: string) {
  statusText.textContent = text;
  statusIndicator.className = 'status-indicator ' + (success ? 'ready' : 'error');
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
  // Simple markdown-ish bold handling or strictly text for safety
  // For improved security, use textContent, but if we want markdown, we'd need a parser.
  // We'll stick to textContent for V1 security.
  msgDiv.textContent = text; 
  messagesArea.appendChild(msgDiv);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function setLoading(isLoading: boolean, text?: string) {
  if (isLoading) {
    loader.classList.remove('hidden');
    if (text) loadingText.textContent = text;
  } else {
    loader.classList.add('hidden');
  }
}
