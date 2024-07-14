import { CheckIcon, Loader2Icon, PencilIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { CHROME_STORAGE_KEY } from "@/lib/constants"

const model = "claude-3.5-sonnet"

// Popup dialog
export default function Popup() {
  const [apiKey, setApiKey] = useState("")
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(false)
  const [reviewResult, setReviewResult] = useState("")
  const [editApiKey, setEditApiKey] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Load API key from browser storage
    chrome.storage.sync.get(CHROME_STORAGE_KEY, (result) => {
      if (result[CHROME_STORAGE_KEY]) {
        setApiKey(result[CHROME_STORAGE_KEY])
      }
    })

    // Check if the current tab is a GitHub pull request
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      if (url && /^https:\/\/github\.com\/.*\/pull\/.*/.test(url)) {
        setShowAnalyzeButton(true)
      }
    })
  }, [])

  // Listen for messages from the background script
  useEffect(() => {
    const listener = (message: any) => {
      if (message.action === "analyzeResult") {
        setIsAnalyzing(false)
        setReviewResult(message.result)
        console.log(message.result)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  return (
    <div className="p-4 w-64">
      <p className="text-2xl font-bold">PR Analyzer</p>

      <div className="flex flex-col gap-2 my-3">
        {/* Current Model */}
        <p>
          Model: <span className="font-bold">{model}</span>
        </p>
        <div>
          {editApiKey ? (
            <div className="flex w-full max-w-sm items-center space-x-2">
              {/* API Key Input */}
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api"
              />
              <Button
                onClick={() => {
                  setEditApiKey(false)
                  chrome.storage.sync.set({ [CHROME_STORAGE_KEY]: apiKey })
                }}
                size="icon"
                variant="outline"
              >
                <CheckIcon className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex w-full max-w-sm items-center space-x-2">
              {/* Current API Key */}
              <Input
                disabled
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api"
              />
              <Button
                onClick={() => setEditApiKey(true)}
                size="icon"
                variant="outline"
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {showAnalyzeButton && (
        <Button
          onClick={() => {
            setIsAnalyzing(true)
            // Send current tab URL to the background script
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.runtime.sendMessage({
                action: "analyzePR",
                url: tabs[0].url,
                apiKey,
              })
            })
          }}
          disabled={isAnalyzing}
          className="w-full"
        >
          {/* Icon */}
          <span className="mr-3">
            {isAnalyzing ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <span>✨</span>
            )}
          </span>
          {isAnalyzing ? "Analyzing..." : "Analyze"}
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
