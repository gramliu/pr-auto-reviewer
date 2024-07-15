import { CHROME_STORAGE_KEY } from "@/lib/constants"
import { ReviewResponse } from "@/lib/review"
import { Loader2Icon } from "lucide-react"
import React, { useEffect, useState } from "react"

export default function PRReviewPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")

  const handleClick = () => {
    setIsAnalyzing(true)
    chrome.runtime.sendMessage({
      action: "analyzePR",
      url: window.location.href,
      apiKey,
    })
  }

  useEffect(() => {
    chrome.storage.sync.get(CHROME_STORAGE_KEY, (result) => {
      setApiKey(result[CHROME_STORAGE_KEY])
    })

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "analyzeResult") {
        console.log("Received response", message.result)
        setIsAnalyzing(false)
        setError(null)
      } else if (message.action === "analyzeError") {
        console.error("Received error", message.error)
        setIsAnalyzing(false)
        setError(message.error)
      }
    })
  }, [])

  return (
    <>
      <div className="discussion-sidebar-heading text-bold">PR Analyzer</div>
      <button
        onClick={handleClick}
        disabled={isAnalyzing}
        className="btn btn-sm"
        style={{ width: "100%" }}
      >
        {isAnalyzing ? (
          <span className="d-flex flex-items-center flex-justify-center">
            <Loader2Icon className="anim-rotate mr-2" />
            Analyzing...
          </span>
        ) : (
          <span>Analyze Pull Request</span>
        )}
      </button>
      {error && (
        <div className="mt-2">
          <h3 className="status-heading h3 color-fg-danger">Error analyzing PR</h3>
          <p className="status-meta">{error}</p>
        </div>
      )}
    </>
  )
}
