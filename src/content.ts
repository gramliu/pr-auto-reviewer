chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'reviewResult') {
    // Display the review result in the popup
    chrome.runtime.sendMessage({ action: 'reviewResult', result: message.result });
  }
});