chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyze') {
    analyzePR(message.url);
  }
});

async function analyzePR(url: string) {
  try {
    const diffUrl = `${url}.diff`;
    const response = await fetch(diffUrl);
    const diff = await response.text();

    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const reviewResult = await getClaudeReview(diff, apiKey);
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: 'reviewResult', result: reviewResult });
    });
  } catch (error) {
    console.error('Error analyzing PR:', error);
  }
}

async function getClaudeReview(diff: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-3.5-sonnet',
      messages: [
        {
          role: 'user',
          content: `Please review the following PR diff and provide a concise summary of the changes:\n\n${diff}`,
        },
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}