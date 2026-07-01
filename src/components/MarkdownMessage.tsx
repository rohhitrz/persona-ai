import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Tailwind-styled overrides so bot messages render clean formatting —
// bold, lists, links, inline code, and fenced code blocks in monospace —
// instead of showing raw markdown syntax.
const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  h1: ({ children }) => (
    <h1 className="mb-2 mt-1 text-base font-semibold text-stone-900 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-1 text-base font-semibold text-stone-900 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1.5 mt-1 text-sm font-semibold text-stone-900 first:mt-0">
      {children}
    </h3>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-stone-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-stone-900 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-stone-900 p-3 text-stone-100 last:mb-0">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const hasLanguage = /language-\w+/.test(className ?? "");
    const isBlock = hasLanguage || String(children).includes("\n");

    if (isBlock) {
      // Rendered inside the styled <pre> above; just handle spacing/font.
      return (
        <code className="font-mono text-[0.85em] leading-relaxed">
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-stone-200/80 px-1.5 py-0.5 font-mono text-[0.85em] text-stone-800">
        {children}
      </code>
    );
  },
};

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed text-stone-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
