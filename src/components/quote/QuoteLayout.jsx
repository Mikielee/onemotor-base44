export default function QuoteLayout({ children, step, totalSteps }) {
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase">
              Car Insurance Quote
            </span>
            <span className="text-[10px] font-montserrat text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-bdred rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="max-w-lg mx-auto px-4 py-6 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
}