import PRReviewPanel from "@/components/PRReviewPanel"
import React from "react"
import { createRoot } from "react-dom/client"
import { ReviewResponse } from "./lib/review"

function injectAnalyzeButton() {
  // Find the target element to inject our button
  const targetElement = document.querySelector("#partial-discussion-sidebar")

  if (targetElement) {
    console.log("Target element found")
    const container = document.createElement("div")
    container.id = "pr-analyzer-container"
    container.className =
      "discussion-sidebar-item sidebar-assignee js-discussion-sidebar-item position-relative"
    
    targetElement.insertBefore(container, targetElement.firstChild)
    const root = createRoot(container)
    root.render(<PRReviewPanel />)
  } else {
    console.warn("PR Reviewer: Target element not found for button injection")
  }
}

function formatReviewResponseToMarkdown(response: ReviewResponse) {
  return `<!-- 
## Overview
${response.overview}
-->

## Feedback
${response.feedback}

## Considerations
${response.considerations}`
}

function injectResponseContent(response: ReviewResponse) {
  const targetElement = document.querySelector<HTMLTextAreaElement>(
    "#new_comment_field",
  )
  if (targetElement) {
    targetElement.value = formatReviewResponseToMarkdown(response)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeResult") {
    console.log("Received response", message.result)
    injectResponseContent(message.result)
  }
})

// Main entry point
injectAnalyzeButton()