import { reviewPullRequest } from "./lib/review"

// Listen for incoming requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzePR") {
    analyzePR(message.url, message.apiKey)
  }
})

interface GitHubPRInfo {
  projectIdentifier: string
  prNumber: number
}

interface GithubPRMetadata {
  pull_request: {
    body: string
  }
}

function extractGitHubPRInfo(url: string): GitHubPRInfo | null {
  const regex =
    /^https:\/\/github\.com\/([^\/]+\/[^\/]+)\/pull\/(\d+)(?:[#?].*)?$/
  const match = url.match(regex)

  if (match) {
    return {
      projectIdentifier: match[1],
      prNumber: parseInt(match[2], 10),
    }
  }

  return null
}

// Analyze the PR
async function analyzePR(url: string, apiKey: string) {
  try {
    // Get the PR summary
    const { projectIdentifier, prNumber } = extractGitHubPRInfo(url)
    if (!projectIdentifier || !prNumber) {
      throw new Error("Invalid PR URL")
    }

    const diffUrl = `${url}.diff`
    const diffResponse = await fetch(diffUrl)
    const diff = await diffResponse.text()
    const reviewResult = await reviewPullRequest("", diff)

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: "analyzeResult",
        result: reviewResult,
      })
      chrome.tabs.update(tabs[0].id!, {
        url: `${url}#new_comment_field`,
      })
    })
  } catch (error) {
    console.error("Error analyzing PR:", error)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: "analyzeError",
        error: error.message,
      })
    })
  }
}
