import type { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-[#0B1F3A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = content
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-[16px] leading-[1.75] text-slate-700">
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A] pt-4"
            >
              {block.slice(3).trim()}
            </h2>
          );
        }

        if (block.startsWith('### ')) {
          return (
            <h3
              key={index}
              className="text-lg font-semibold text-[#0B1F3A] pt-2"
            >
              {block.slice(4).trim()}
            </h3>
          );
        }

        const lines = block.split('\n');
        if (lines.every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={index} className="space-y-2.5 pl-5 list-disc marker:text-[#C9A24B]">
              {lines.map((line, liIdx) => (
                <li key={liIdx}>{renderInline(line.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
