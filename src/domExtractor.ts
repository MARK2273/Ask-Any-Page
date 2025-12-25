export const extractPageContent = (): string => {
  // Enhanced selectors for API docs and modern web apps
  const contentSelectors = [
    'main', 
    '[role="main"]', 
    'article', 
    '.col-md-9', // Bootstrap main column
    '.content-wrapper',
    '#content',
    'div[class*="content"]', 
    'div[class*="main"]'
  ];
  
  let rootElement: HTMLElement | null = null;

  // Strategy 1: Find a specific main container that isn't too small
  for (const selector of contentSelectors) {
    const el = document.querySelector(selector) as HTMLElement;
    if (el && el.innerText.length > 1000) { // Increased threshold to avoid small widgets
      rootElement = el;
      break;
    }
  }

  // Strategy 2: If no specific container found, use body but clean aggressively
  if (!rootElement) {
    rootElement = document.body;
  }

  // Clone to avoid modifying the actual page
  const clone = rootElement.cloneNode(true) as HTMLElement;

  // Remove unwanted elements
  const ignoreTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'NAV', 'FOOTER', 'Header', 'SVG', 'IMG'];
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);
  const toRemove: Node[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;
    if (ignoreTags.includes(node.tagName) || 
        node.getAttribute('aria-hidden') === 'true' ||
        node.style.display === 'none') {
      toRemove.push(node);
    }
  }
  toRemove.forEach(n => n.parentNode?.removeChild(n));

  // Extract text and clean up
  let text = clone.innerText || '';
  
  // Normalize whitespace: replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, ' ').trim();

  // Truncate if too long (approx 15k chars to stay safely within typical limits and reasonable processing time)
  // Gemini 1.5 Flash has a large context, but let's keep it snappy.
  if (text.length > 20000) {
    text = text.substring(0, 20000) + '...[TRUNCATED]';
  }

  return text;
};
