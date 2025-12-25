export const saveApiKey = (key: string): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ geminiApiKey: key }, () => {
      resolve();
    });
  });
};

export const getApiKey = (): Promise<string | undefined> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['geminiApiKey'], (result) => {
      resolve(result.geminiApiKey as string | undefined);
    });
  });
};

export const removeApiKey = (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove('geminiApiKey', () => {
      resolve();
    });
  });
};
