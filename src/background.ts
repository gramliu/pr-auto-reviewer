
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "url.changed") {
    console.log("Processing URL:", message.url)
  }
})
