import React from 'react';
import { highlightCode } from '../lib/syntaxHighlight';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  // Simple yet powerful markdown parser that formats headers, lists, code blocks, bold, italics, blockquotes, tables
  const renderMarkdown = (md: string) => {
    if (!md) return '';

    // Extract code blocks first to protect them
    const codeBlocks: string[] = [];
    let processed = md.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || 'python';
      const highlighted = highlightCode(code.trim(), language);
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(
        `<div class="my-4 rounded-xl overflow-hidden border border-stone-200/80 bg-[#1e1b2e] shadow-sm">
          <div class="flex items-center justify-between px-4 py-2 bg-[#171424] border-b border-stone-800 text-xs font-mono text-purple-300">
            <span>${language}</span>
            <span class="text-stone-400">código</span>
          </div>
          <pre class="p-4 text-sm font-mono overflow-x-auto text-stone-100 leading-relaxed"><code>${highlighted}</code></pre>
        </div>`
      );
      return placeholder;
    });

    // Extract inline code
    processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200/50 font-mono text-[0.88em]">$1</code>');

    // Headers
    processed = processed.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#281434] mt-6 mb-3 tracking-tight">$1</h3>');
    processed = processed.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#281434] mt-8 mb-4 pb-2 border-b border-stone-200 tracking-tight">$1</h2>');
    processed = processed.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-[#281434] mt-6 mb-4 tracking-tight">$1</h1>');

    // Blockquotes
    processed = processed.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-purple-500 bg-purple-50/60 rounded-r-xl px-4 py-3 my-4 text-[#281434] text-sm italic">$1</blockquote>');

    // Horizontal Rule
    processed = processed.replace(/^---$/gim, '<hr class="my-6 border-stone-200" />');

    // Bold and Italic
    processed = processed.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#281434]">$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Lists (unordered)
    processed = processed.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-5 list-disc text-stone-700 my-1 leading-relaxed">$1</li>');

    // Paragraphs: split by double newlines
    const paragraphs = processed.split(/\n\n+/);
    processed = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<blockquote') || p.startsWith('<hr') || p.startsWith('__CODE_BLOCK_') || p.startsWith('<li')) {
        return p;
      }
      return `<p class="my-3 text-stone-700 leading-relaxed text-[16px]">${p}</p>`;
    }).join('\n');

    // Restore code blocks
    codeBlocks.forEach((block, idx) => {
      processed = processed.replace(`__CODE_BLOCK_${idx}__`, block);
    });

    return processed;
  };

  return (
    <div
      className={`prose prose-stone max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};
