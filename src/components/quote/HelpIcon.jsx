import { HelpCircle } from 'lucide-react';

export default function HelpIcon({ onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-cyan hover:text-cyan/80 transition-colors"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}