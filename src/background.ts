import { Action } from "./lib/actions"

async function analyzePr(url: string) {
  const diffUrl = url + ".diff"
  console.log(diffUrl)
  const response = await fetch(diffUrl);
  const body = await response.text();
  console.log(body);
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const action = message.action as Action
  if (action === "url.changed") {
    analyzePr(message.url)
  }
})
