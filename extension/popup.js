document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('solve-btn').addEventListener('click', () => {
    const selectedModel = document.getElementById('model-select').value;
    console.log("Selected model from popup:", selectedModel);

    // Save to chrome.storage
    chrome.storage.local.set({ selectedCaptchaModel: selectedModel }, () => {
      console.log("Model saved to chrome.storage");

      // Trigger content script
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            window.dispatchEvent(new Event("trigger-captcha-solve"));
          }
        });
      });
    });
  });
});

