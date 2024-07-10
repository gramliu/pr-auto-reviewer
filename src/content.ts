function notifyUrlChanged() {
  const currentURL = window.location.href;
  const githubPRPattern = /^https:\/\/github\.com\/.*\/pull\/.*/;

  if (githubPRPattern.test(currentURL)) {
    console.log("GitHub PR URL detected:", currentURL);
    chrome.runtime.sendMessage({ action: "url.changed", url: currentURL });
  } else {
    console.log("Not a GitHub PR URL:", currentURL);
  }
}

// Run the check when the content script loads
notifyUrlChanged();

// Also run the check whenever the URL changes without a page reload
let lastURL = window.location.href;
new MutationObserver(() => {
  const currentURL = window.location.href;
  if (currentURL !== lastURL) {
    lastURL = currentURL;
    notifyUrlChanged();
  }
}).observe(document, { subtree: true, childList: true });