declare module JSX {
  interface IntrinsicElements {
    "relative-time": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        datetime: string
        title?: string
      },
      HTMLElement
    >
    "task-lists": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: string
        sortable?: string
        children: React.ReactNode
      },
      HTMLElement
    >
    "include-fragment": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
    "details-menu": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        "data-src": string
      },
      HTMLElement
    >
  }
}
