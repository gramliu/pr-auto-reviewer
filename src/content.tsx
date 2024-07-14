import PRReviewPanel from "@/components/PRReviewPanel"
import React from "react"
import { createPortal } from "react-dom"
import { createRoot } from "react-dom/client"

function injectReactComponent() {
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

injectReactComponent()
