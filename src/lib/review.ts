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

const sampleResponse = `"Here's my review of the pull request:

<review>
<overview>
This pull request updates the version of the @xenova/transformers package from 2.5.4 to 2.17.2 across multiple package.json files. It also modifies the HuggingFaceTransformersEmbeddings class in the hf_transformers.ts file to accommodate new features and options available in the updated package version.
</overview>

<feedback>
1. Version Update:
   The update of @xenova/transformers from 2.5.4 to 2.17.2 is a significant version jump. This is generally positive as it brings in new features and improvements, but it's important to ensure compatibility with the rest of the project.

2. Code Changes in hf_transformers.ts:
   a. Type Imports:
      The change from importing a generic Pipeline type to more specific types (PretrainedOptions, FeatureExtractionPipelineOptions, FeatureExtractionPipeline) improves type safety and clarity.

   b. New Options:
      The addition of pretrainedOptions and pipelineOptions to the HuggingFaceTransformersEmbeddingsParams interface allows for more flexible configuration. This is a good improvement in terms of customization.

   c. Default Options:
      Setting default values for pipelineOptions (pooling: "mean", normalize: true) while allowing overrides is a good practice. It maintains backward compatibility while enabling new customizations.

   d. Pipeline Creation:
      The pipeline creation now includes the pretrainedOptions, which allows for more control over the model loading process.

3. Code Style and Structure:
   The changes maintain the existing code style and structure, which is good for consistency.

4. Error Handling:
   There don't appear to be any changes to error handling. Given the significant version update, it might be worth considering if any new error scenarios need to be addressed.

5. Documentation:
   The new options (pretrainedOptions and pipelineOptions) are added to the interface but lack detailed documentation. Consider adding JSDoc comments to explain what these options do and provide examples of their usage.
</feedback>

<considerations>
1. Testing:
   Ensure that comprehensive tests are in place to verify that the embeddings functionality works correctly with the new version of @xenova/transformers, especially with the new configuration options.

2. Performance:
   The significant version jump may have performance implications. It would be beneficial to benchmark the new version against the old one to identify any performance changes.

3. Compatibility:
   Verify that this update doesn't introduce any breaking changes for existing users of the HuggingFaceTransformersEmbeddings class.

4. Dependencies:
   The yarn.lock file shows that a new dependency (@huggingface/jinja) has been added as part of the @xenova/transformers update. Ensure that this new dependency doesn't conflict with other parts of the project.

5. Documentation Update:
   Consider updating any relevant documentation or README files to reflect the new capabilities and configuration options introduced by this change.

6. Changelog:
   It would be helpful to include a brief changelog or note in the pull request description highlighting the key changes and any new features that users can take advantage of with this update.
</considerations>
</review>"`

function generateInput(summary: string, diff: string): string {
  return inputTemplate.replace("{{PR_SUMMARY}}", summary).replace("{{PR_DIFF}}", diff)
}

export interface ReviewResponse {
  overview: string
  feedback: string
  considerations: string
}

function parseResponse(response: string): ReviewResponse {
  const overview = response.match(/<overview>([\s\S]+)<\/overview>/)?.[1]?.trim()
  const feedback = response.match(/<feedback>([\s\S]+)<\/feedback>/)?.[1]?.trim()
  const considerations = response.match(/<considerations>([\s\S]+)<\/considerations>/)?.[1]?.trim()
  return { overview, feedback, considerations }
}

// Get a review from Claude
export async function reviewPullRequest(summary: string, diff: string, apiKey: string, cacheResponses: boolean = true): Promise<ReviewResponse> {
  if (cacheResponses) {
    return parseResponse(sampleResponse)
  }
  
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
