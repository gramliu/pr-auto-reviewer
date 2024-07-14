import React from 'react';
import ReactDOM from 'react-dom/client';
import PRReviewPanel from '@/components/PRReviewPanel';

function injectReactComponent() {
  // Find the target element to inject our button
  const targetElement = document.querySelector('.js-issue-sidebar-form');
  console.log(document.body)
  
  if (targetElement) {
    console.log("Target element found")
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'pr-reviewer-button-container';
    targetElement.appendChild(buttonContainer);

    const root = ReactDOM.createRoot(buttonContainer);
    root.render(<PRReviewPanel />);
  } else {
    console.warn('PR Reviewer: Target element not found for button injection');
  }
}

function waitForElement(selector: string, callback: () => void, timeout = 3_000) {
  const startTime = Date.now();

  const checkElement = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback();
    } else if (Date.now() - startTime < timeout) {
      requestAnimationFrame(checkElement);
    } else {
      console.warn(`PR Reviewer: Element ${selector} not found after ${timeout}ms`);
    }
  };

  checkElement();
}

console.log("Content script loaded")
injectReactComponent()

// // Wait for the DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//   // Wait for the specific element we need
//   waitForElement('.js-issue-sidebar-form', injectReactComponent);
// });

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'reviewResult') {
    // Dispatch a custom event with the review result
    const event = new CustomEvent('pr-review-result', { detail: message.result });
    document.dispatchEvent(event);
  }
});