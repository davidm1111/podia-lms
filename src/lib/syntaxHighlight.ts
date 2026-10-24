import Prism from 'prismjs';
// Load Python and bash syntax highlighting
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

export function highlightCode(code: string, language: string = 'python'): string {
  try {
    const lang = language.toLowerCase();
    const grammar = Prism.languages[lang] || Prism.languages.python;
    return Prism.highlight(code, grammar, lang);
  } catch (e) {
    return escapeHtml(code);
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
