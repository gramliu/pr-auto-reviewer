import React from 'react';
import ReactDOM from 'react-dom/client';
import PRReviewPanel from '@/components/PRReviewPanel';

function injectReactComponent() {
  // Find the target element to inject our button
  const targetElement = document.querySelector('.js-issue-sidebar-form');
  
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

injectReactComponent()