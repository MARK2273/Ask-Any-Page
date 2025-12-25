import { extractPageContent } from './domExtractor';

console.log('AskAnyPage Content Script Loaded');

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'EXTRACT_CONTENT') {
    try {
      const content = extractPageContent();
      sendResponse({ success: true, content });
    } catch (error: any) {
      console.error('Extraction failed:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  // Return true if we were to handle async response, but here we are synchronous mostly.
  // However, best practice to keep channel open if needed. 
  // For simple synchronous, we just return.
});
