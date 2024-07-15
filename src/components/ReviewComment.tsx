import { ReviewResponse } from "@/lib/review"
import {
  BotIcon,
  CircleAlertIcon,
  InfoIcon,
  SquareGanttChart,
} from "lucide-react"
import React from "react"

interface Props {
  review: ReviewResponse
}

function FormattedText({ text }: { text: string }): JSX.Element[] {
  // Split the markdown into paragraphs
  const paragraphs = text.split("\n\n")

  return paragraphs.map((paragraph, index) => {
    // Split the paragraph into parts, separating code blocks
    const parts = paragraph.split(/(`.*?`)/)

    const elements = parts.map((part, partIndex) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        // This is a code block
        return <code key={partIndex}>{part.slice(1, -1)}</code>
      } else {
        // This is regular text
        return part
      }
    })

    return <p key={index}>{elements}</p>
  })
}

export default function ReviewComment({ review }: Props) {
  const imageUrl = chrome.runtime.getURL("icons/icon_128.png")
  return (
    <div
      id="partial-pull-merging"
      className="pull-merging js-pull-merging js-socket-channel js-updatable-content js-pull-refresh-on-pjax"
      aria-live="polite"
      data-channel="eyJjIjoicmVwbzo2MzY0ODA3OTE6YnJhbmNoOm1lZGlhLW1hbmFnZXIiLCJ0IjoxNzIwOTk4MDAwfQ==--99bd382c6f5e7982b025635669f5b2b4e0f0e3dfcbfded17f23c181dae91b6e1 eyJjIjoicmVwbzo1OTgzNDIyODA6YnJhbmNoOm1haW4iLCJ0IjoxNzIwOTk4MDAwfQ==--240b7654a6f4a2d3b12001810d2d8ff543076ca169489284f2b86ce11d0144d9 eyJjIjoicmVwbzo1OTgzNDIyODA6Y29tbWl0OmFhZTYxMDc3NDY3ODAwNWQwMDMxZDE3NmFjOGUzMjUzZDE4ZDhlYzUiLCJ0IjoxNzIwOTk4MDAwfQ==--8aa059a1c3a7f06b87f0216d781beb22c5b4959d10db01524f813ac02a11b62d eyJjIjoiaXNzdWU6MjM2NTU1MDMxMTpzdGF0ZSIsInQiOjE3MjA5OTgwMDB9--86afe41b11cdf72df53ba63b362239aef3b60332f5d2c44ac457ddbea273fa04 eyJjIjoicHVsbF9yZXF1ZXN0OjE5MzE2MTEzODc6cmV2aWV3X3N0YXRlIiwidCI6MTcyMDk5ODAwMH0=--52b65e8759820e59df30bbe57987d6676d0c3dfd8bc90ae6639be4f61cf1b5be eyJjIjoicHVsbF9yZXF1ZXN0OjE5MzE2MTEzODc6d29ya2Zsb3dfcnVuIiwidCI6MTcyMDk5ODAwMH0=--763e52d08a06cbfac5d3e8ca65b6c30eb7096c485953b6e45b6b3dd4c7d085b2 eyJjIjoicHVsbF9yZXF1ZXN0OjE5MzE2MTEzODc6ZGVwbG95ZWQiLCJ0IjoxNzIwOTk4MDAwfQ==--4d9c4639d3590b93a2461c03be744cca9b7e33e33c6b840011de1de47bd11fd6 eyJjIjoicHVsbF9yZXF1ZXN0OjE5MzE2MTEzODc6bWVyZ2VfcXVldWVfZW50cnlfc3RhdGUiLCJ0IjoxNzIwOTk4MDAwfQ==--47637ea81a2c46ecbc20a5eb923b23484d2ca3d80ef175c52099acb45b81a5b0"
      data-url="/langchain-ai/langchainjs/pull/5835/partials/merging?merge_type=merge"
    >
      <h2 className="sr-only">Merge state</h2>
      <div
        className="merge-pr js-merge-pr js-details-container Details is-merging is-updating-via-merge"
        data-favicon-override="https://github.githubassets.com/favicons/favicon-success.svg"
      >
        <div className="js-merge-message-container">
          <div className="ml-0 pl-0 ml-md-6 pl-md-3 my-3 branch-action">
            <span className="branch-action-icon d-none d-md-flex flex-items-center flex-justify-center">
              <img src={imageUrl} alt="PR Analyzer" height={40} width={40} />
            </span>
            <div className="branch-action-body timeline-comment--caret">
              <div className="mergeability-details js-details-container Details">
                <div className="branch-action-item">
                  <div className="branch-action-item-icon completeness-indicator completeness-indicator-success">
                    <BotIcon />
                  </div>
                  <div className="h4 status-heading color-fg-success">
                    PR Analysis
                  </div>
                  <span className="status-meta">
                    Analysis of the pull request (only you can see this).
                  </span>
                </div>
                <div className="branch-action-item">
                  <div className="branch-action-item-icon completeness-indicator">
                    <SquareGanttChart />
                  </div>
                  <details>
                    <summary className="h4 status-heading color-fg-default">
                      Overview
                    </summary>
                    <span className="markdown-body comment-body">
                      <FormattedText text={review.overview} />
                    </span>
                  </details>
                </div>
                <div className="branch-action-item">
                  <div className="branch-action-item-icon completeness-indicator">
                    <InfoIcon />
                  </div>
                  <details>
                    <summary className="h4 status-heading color-fg-accent">
                      Feedback
                    </summary>
                    <span className="markdown-body comment-body">
                      <FormattedText text={review.feedback} />
                    </span>
                  </details>
                </div>
                <div className="branch-action-item">
                  <div className="branch-action-item-icon completeness-indicator">
                    <CircleAlertIcon />
                  </div>
                  <details>
                    <summary className="h4 status-heading color-fg-attention">
                      Considerations
                    </summary>
                    <span className="markdown-body comment-body">
                      <FormattedText text={review.considerations} />
                    </span>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-0 pl-0 ml-md-6 pl-md-3 my-3 branch-action branch-action-state-error pull-merging-error">
        <span className="branch-action-icon d-none d-md-flex flex-items-center flex-justify-center">
          <svg
            aria-hidden="true"
            height="24"
            viewBox="0 0 24 24"
            version="1.1"
            width="24"
            data-view-component="true"
            className="octicon octicon-git-merge"
          >
            <path d="M15 13.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm-12.5 6a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm0-14.5a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM5.75 6.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 6.5Zm0 14.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 21Zm12.5-6a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 18.25 15Z"></path>
            <path d="M6.5 7.25c0 2.9 2.35 5.25 5.25 5.25h4.5V14h-4.5A6.75 6.75 0 0 1 5 7.25Z"></path>
            <path d="M5.75 16.75A.75.75 0 0 1 5 16V8a.75.75 0 0 1 1.5 0v8a.75.75 0 0 1-.75.75Z"></path>
          </svg>
        </span>
        <div className="branch-action-body timeline-comment--caret p-3">
          <button
            data-form-target="js-update-branch-form"
            type="button"
            data-view-component="true"
            className="js-merge-box-try-again btn float-right"
          >
            <svg
              aria-hidden="true"
              height="16"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              data-view-component="true"
              className="octicon octicon-sync"
            >
              <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path>
            </svg>
            Try again
          </button>
          <h4 className="merge-branch-heading">Update branch attempt failed</h4>
          <p className="merge-branch-description multi-line-error">
            Oops, something went wrong.
          </p>
        </div>
      </div>
    </div>
  )
}
