const BACKEND_URL = "http://localhost:4001"

const inputTemplate = `Here are the details of the pull request:

<pull_request>
<summary>
{{PR_SUMMARY}}
</summary>

<diff>
{{PR_DIFF}}
</diff>
</pull_request>`

function generateInput(summary: string, diff: string): string {
  return inputTemplate
    .replace("{{PR_SUMMARY}}", summary)
    .replace("{{PR_DIFF}}", diff)
}

export interface ReviewResponse {
  overview: string
  feedback: string
  considerations: string
}

function parseResponse(response: string): ReviewResponse {
  const overview = response
    .match(/<overview>([\s\S]+)<\/overview>/)?.[1]
    ?.trim()
  const feedback = response
    .match(/<feedback>([\s\S]+)<\/feedback>/)?.[1]
    ?.trim()
  const considerations = response
    .match(/<considerations>([\s\S]+)<\/considerations>/)?.[1]
    ?.trim()
  return { overview, feedback, considerations }
}

// Get a review from Claude
export async function reviewPullRequest(
  summary: string,
  diff: string,
): Promise<ReviewResponse> {
  const input = generateInput(summary, diff)
  const response = await fetch(`${BACKEND_URL}/review`, {
    method: "POST",
    body: JSON.stringify({ input }),
  })

  const data = await response.json()
  console.log(data)
  if (data.error) {
    throw new Error(data.error.message)
  }
  const { review } = data
  const { text } = review.content[0]
  return parseResponse(text)
}
