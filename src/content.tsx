import PRReviewPanel from "@/components/PRReviewPanel"
import React from "react"
import { createRoot } from "react-dom/client"
import { ReviewResponse } from "./lib/review"
import ReviewComment from "./components/ReviewComment"

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

function injectCommentBox(review: ReviewResponse) {
  const anchor = document.querySelector("#issue-comment-box")
  if (anchor) {
    const container = document.createElement("div")
    container.id = "pr-analyzer-response"
    container.className =
      "pull-merging js-pull-merging js-socket-channel js-updatable-content js-pull-refresh-on-pjax"

    const targetContainer = anchor.parentElement
    targetContainer.insertBefore(container, anchor)
    const root = createRoot(container)
    root.render(
      <ReviewComment
        review={review}
      />,
    )
  }
}

function injectResponseContent(response: ReviewResponse) {
  const targetElement =
    document.querySelector<HTMLTextAreaElement>("#new_comment_field")
  if (targetElement) {
    targetElement.value = formatReviewResponseToMarkdown(response)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeResult") {
    // injectResponseContent(message.result)
    injectCommentBox(message.result)
  } else if (message.action === "analyzeError") {
    console.error(message.error)
  }
})

// Main entry point
injectAnalyzeButton()
