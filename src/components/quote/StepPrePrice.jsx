import { Check } from 'lucide-react';
import { COVER_INCLUSIONS } from '../../lib/quoteData';
import PillButton from './PillButton';

export default function StepPrePrice({ formData, price, onNext }) {
  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const coverType = formData.coverType || 'COMP';
  const inclusions = COVER_INCLUSIONS[coverType] || [];
  const monthlyEquiv = Math.round(price / 12);

  return (
    <div className="space-y-5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Here is your estimated quote
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
        <p className="text-xs font-montserrat text-muted-foreground mb-1">Your estimated annual premium</p>
        <p className="font-montserrat font-bold text-4xl text-bdred">
          SGD ${price.toLocaleString()}
        </p>
        <p className="font-montserrat text-sm text-carbon mt-1">per year</p>
        <p className="font-montserrat text-xs text-muted-foreground mt-2">
          Approx. SGD ${monthlyEquiv} / month
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="font-montserrat font-bold text-sm text-carbon mb-3">
          {coverLabels[coverType]} cover includes:
        </p>
        <div className="space-y-2.5">
          {inclusions.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-sm font-montserrat text-carbon">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground font-montserrat leading-relaxed">
        This is an estimated price based on the information provided. Final price confirmed after all details are completed.
      </p>

      <PillButton onClick={onNext}>
        Continue to personalise your quote
      </PillButton>
    </div>
  );
}