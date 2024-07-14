// Listen for incoming requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzePR") {
    analyzePR(message.url, message.apiKey)
  }
})

// Analyze the PR
async function analyzePR(url: string, apiKey: string) {
  try {
    const diffUrl = `${url}.diff`
    const response = await fetch(diffUrl)
    const diff = await response.text()

    const reviewResult = await getClaudeReview(diff, apiKey)

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: "analyzeResult",
        result: reviewResult,
      })
    })
  } catch (error) {
    console.error("Error analyzing PR:", error)
  }
}

const systemPrompt = `You are an experienced software engineer providing thorough and constructive reviews on GitHub pull requests.
You will be provided with a diff of a pull request and asked to provide a summary of the changes.
The summary should be in the form of a list of bullet points, each bullet point describing a change that was made.`

// Get a review from Claude
async function getClaudeReview(diff: string, apiKey: string): Promise<string> {
  console.log("Sending diff")
  console.log("API Key", apiKey)
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `<code>${diff}</code>`,
        },
      ],
      max_tokens: 1000,
    }),
  })

  console.log("Received response")
  const data = await response.json()
  console.log("Received data", data)
  return data.content[0].text
}
