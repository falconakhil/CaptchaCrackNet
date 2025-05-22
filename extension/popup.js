document.getElementById('solve-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: solveCaptcha
      });
    });
  });
  
  function solveCaptcha() {
    // This function will be injected into the page from popup
    window.dispatchEvent(new Event("trigger-captcha-solve"));
  }
  