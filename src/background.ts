import { askGemini } from './gemini';
import { getApiKey } from './storage';

// Store context temporarily in memory (non-persistent across service worker restarts, but good for active session)
// For robust usage, we might want to stash in storage.local, but variable is fine for now.
let pageContext: string = '';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      if (request.action === 'ANALYZE_PAGE') {
        // 1. Get Active Tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) throw new Error('No active tab found');

        // 2. Request Content from Content Script
        // We use tabs.sendMessage. Note: content script must be loaded.
        // If not loaded (e.g. fresh install), we might need scripting.executeScript.
        // But for simplicity with Manifest V3 + declarative content_scripts, it should be there on refresh.
        // We'll wrap in a try/catch to inject if missing could be an enhancement, but let's assume standard flow.
        let response;
        try {
          response = await chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_CONTENT' });
        } catch (e: any) {
          if (e.message.includes('Receiving end does not exist') || e.message.includes('Could not establish connection')) {
             throw new Error('Please refresh the page to activate the extension.');
          }
          throw e;
        }
        
        if (!response || !response.success) {
          throw new Error(response.error || 'Failed to extract content');
        }

        pageContext = response.content;
        return { success: true, message: 'Page content analyzed successfully' };
      }

      if (request.action === 'ASK_QUESTION') {
        const { question } = request;
        if (!pageContext) {
          throw new Error('No page content analyzed. Please click "Analyze Page" first.');
        }
        
        const apiKey = await getApiKey();
        if (!apiKey) {
          throw new Error('API Key missing. Please set it in the extension.');
        }

        const answer = await askGemini(pageContext, question, apiKey);
        return { success: true, answer };
      }
    } catch (error: any) {
      console.error('Background Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Execute async handler and respond
  handleRequest().then(sendResponse);
  return true; // Keep channel open for async response
});
