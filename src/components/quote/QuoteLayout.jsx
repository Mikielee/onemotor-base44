import QuoteHeader from './QuoteHeader';

export default function QuoteLayout({ children, step, totalSteps, showPriceWidget }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <QuoteHeader step={step} totalSteps={totalSteps} />

      {/* Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className={`max-w-lg mx-auto px-4 py-6 ${showPriceWidget ? 'pb-80' : 'pb-24'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}