import { AlertOctagon, Phone } from 'lucide-react';
import PillButton from './PillButton';

export default function BlockerScreen() {
  return (
    <div className="min-h-screen bg-grey100 flex justify-center">
      <div className="w-full max-w-[390px] bg-white min-h-screen flex flex-col items-center justify-center px-6 shadow-xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
          <AlertOctagon className="w-9 h-9 text-bdred" />
        </div>
        <h1 className="font-montserrat font-bold text-xl text-carbon text-center mb-3">
          We're unable to provide a quote
        </h1>
        <p className="font-montserrat text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          Based on the information provided, we're unable to offer you a quote online. Please contact us to discuss your options.
        </p>
        <PillButton onClick={() => window.location.href = 'tel:+6562210011'}>
          <span className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Call us: 6221 0011
          </span>
        </PillButton>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-montserrat text-cyan hover:underline"
        >
          Start a new quote
        </button>
      </div>
    </div>
  );
}