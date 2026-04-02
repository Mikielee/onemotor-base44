import { CheckCircle } from 'lucide-react';

/**
 * Wrap any text input or select with this to get:
 * - Green border + checkmark when the value is filled
 * - Normal state when empty
 *
 * Usage:
 *   <ValidatedInput value={formData.name}>
 *     <input ... />
 *   </ValidatedInput>
 */
export default function ValidatedInput({ value, children }) {
  const filled = value !== undefined && value !== null && value !== '';

  return (
    <div className="relative">
      <div className={`transition-all duration-200 rounded-lg ${filled ? 'ring-2 ring-green-400 ring-offset-0 [&_input]:border-transparent [&_select]:border-transparent [&_input]:focus:border-transparent [&_select]:focus:border-transparent' : ''}`}>
        {children}
      </div>
      {filled && (
        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
      )}
    </div>
  );
}