import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Popup() {
  const [apiKey, setApiKey] = useState("")
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(false)
  const [reviewResult, setReviewResult] = useState("")

  useEffect(() => {
    chrome.storage.sync.get("apiKey", (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey)
      }
    })

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      if (url && /^https:\/\/github\.com\/.*\/pull\/.*/.test(url)) {
        setShowAnalyzeButton(true)
      }
    })
  }, [])

  const saveApiKey = () => {
    chrome.storage.sync.set({ apiKey })
  }

  const handleAnalyze = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: "analyze", url: tabs[0].url })
    })
  }

  useEffect(() => {
    const listener = (message: any) => {
      if (message.action === "reviewResult") {
        setReviewResult(message.result)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  return (
    <div className="p-4 w-64">
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        className="mb-2"
      />
      <Button onClick={saveApiKey} className="mb-2 w-full">
        Save API Key
      </Button>
      {showAnalyzeButton && (
        <Button onClick={handleAnalyze} className="w-full">
          Analyze
        </Button>
      )}
      {reviewResult && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h3 className="font-bold">Review Result:</h3>
          <p>{reviewResult}</p>
        </div>
      )}
    </div>
  )
}
