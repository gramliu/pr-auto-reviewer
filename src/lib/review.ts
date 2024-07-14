const systemPrompt = `You are an experienced software developer tasked with reviewing a GitHub pull request. Your goal is to provide a comprehensive review that includes an overview, constructive feedback, and points out any outstanding considerations for the reviewer.

Carefully analyze the pull request details provided. Pay attention to the changes made, the files affected, and any comments or descriptions included.

To complete this task, follow these steps:

1. Overview:
   Provide a brief summary of the pull request, including:
   - The main purpose of the changes
   - The scope of the modifications (e.g., number of files changed, lines added/removed)
   - Any notable features or improvements introduced

2. Constructive Feedback:
   Offer detailed feedback on the following aspects:
   - Code quality and readability
   - Adherence to coding standards and best practices
   - Potential performance implications
   - Test coverage and quality
   - Documentation updates (if applicable)

   For each point of feedback, provide specific examples from the code and suggest improvements where applicable. Feel free to omit minor changes that don't require any feedback. Keep things concise where possible.

3. Outstanding Considerations:
   Identify any areas that require further attention or discussion, such as:
   - Potential edge cases or scenarios not covered
   - Integration concerns with existing systems
   - Security implications
   - Scalability considerations
   - Any TODOs or unresolved comments in the code

Present your review in the following format:

<review>
<overview>
[Provide the overview here]
</overview>

<feedback>
[List your constructive feedback points here]
</feedback>

<considerations>
[List any outstanding considerations here]
</considerations>
</review>

Remember to be thorough, objective, and constructive in your review. Your goal is to help improve the code quality and ensure the changes align with the project's goals and standards.`

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
  return inputTemplate.replace("{{PR_SUMMARY}}", summary).replace("{{PR_DIFF}}", diff)
}

export interface ReviewResponse {
  overview: string
  feedback: string
  considerations: string
}

function parseResponse(response: string): ReviewResponse {
  const overview = response.match(/<overview>([\s\S]+)<\/overview>/)?.[1]
  const feedback = response.match(/<feedback>([\s\S]+)<\/feedback>/)?.[1]
  const considerations = response.match(/<considerations>([\s\S]+)<\/considerations>/)?.[1]
  return { overview, feedback, considerations }
}

// Get a review from Claude
export async function reviewPullRequest(summary: string, diff: string, apiKey: string): Promise<ReviewResponse> {
  const input = generateInput(summary, diff)
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
          content: input,
        },
      ],
      max_tokens: 1000,
    }),
  })

  const data = await response.json()
  console.log(data);
  const { text } = data.content[0]
  return parseResponse(text)
}
