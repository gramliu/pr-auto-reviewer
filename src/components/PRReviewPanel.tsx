import { Loader2Icon } from "lucide-react"
import React, { useState } from "react"

export default function PRReviewPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleClick = () => {
    setIsAnalyzing(true)
    chrome.runtime.sendMessage(
      { action: "analyzePR", url: window.location.href },
      (response) => {
        setIsAnalyzing(false)
        // Handle the response if needed
      },
    )
  }

  return (
    <div className="mt-3">
      <button
        onClick={handleClick}
        disabled={isAnalyzing}
        className="btn btn-sm"
        style={{ width: "100%" }}
      >
        {isAnalyzing ? (
          <span>
            <Loader2Icon className="mr-2 animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span>Analyze Pull Request</span>
        )}
      </button>
    </div>
  )
}
