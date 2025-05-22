document.getElementById('solve-btn').addEventListener('click', () => {
  const selectedModel = document.getElementById('model-select').value;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (modelUrl) => {
        window.selectedCaptchaModel = modelUrl;
        window.dispatchEvent(new Event("trigger-captcha-solve"));
      },
      args: [selectedModel]
    });
  });
});
