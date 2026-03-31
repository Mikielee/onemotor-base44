import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_PRICES, EXCESS_DELTA } from '../../lib/quoteData';

export default function PriceBar({ price, formData }) {
  const [expanded, setExpanded] = useState(false);
  const [monthly, setMonthly] = useState(false);

  const displayPrice = monthly ? Math.round(price / 12) : price;
  const period = monthly ? 'month' : 'year';

  // Build breakdown
  const coverLabels = { COMP: 'Comprehensive', TPFT: 'TPFT', TPO: 'TPO' };
  const coverType = formData.coverType || 'COMP';

  let base = BASE_PRICES[coverType] || 1234;
  if (formData.carUsage === 'business') base += 80;
  if (formData.offPeak === 'yes') base -= 60;
  if (formData.claimsInPast3Years === 'yes') base += 40;
  if (formData.certificateOfMerit === 'yes') base -= 30;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const baseAfterNcd = Math.round(base * (1 - ncd / 100));

  const items = [
    { label: `${coverLabels[coverType]} base premium`, amount: baseAfterNcd },
  ];
  if (ncd > 0) items.push({ label: `NCD discount (${ncd}%)`, amount: -(base - baseAfterNcd) });

  if (formData.additionalDriverPlan === 'any') {
    items.push({ label: 'Any Driver plan', amount: 200 });
  } else if (formData.namedDrivers?.length > 0) {
    formData.namedDrivers.forEach((d, i) => {
      items.push({ label: `${d.preferredName || `Driver ${i + 1}`} (named driver)`, amount: 80 });
    });
  }

  if (formData.driveLessOptIn) items.push({ label: 'Drive Less Pay Less', amount: -150 });

  const excessAdj = EXCESS_DELTA[formData.excess || 1000] || 0;
  if (excessAdj !== 0) items.push({ label: `Excess ($${formData.excess || 1000})`, amount: excessAdj });

  if (formData.benefitPA) {
    const pa = formData.paCoverLevel === 200000 ? 158 : formData.paCoverLevel === 100000 ? 110 : 78;
    items.push({ label: 'Personal Accident & Medical', amount: pa });
  }
  if (formData.benefitNCD) items.push({ label: 'NCD Protection', amount: 95 });
  if (formData.benefitLOU) items.push({ label: 'Loss of Use', amount: 120 });
  if (formData.benefitWindscreen) items.push({ label: 'Excess-free Windscreen', amount: 60 });

  return (
    <div className="bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground font-montserrat">Your estimated premium</p>
            <p className="font-montserrat font-bold text-xl text-bdred">
              SGD ${displayPrice.toLocaleString()} <span className="text-sm font-normal text-carbon">/ {period}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Pill toggle */}
            <div className="flex bg-grey100 rounded-pill p-0.5">
              <button
                type="button"
                onClick={() => setMonthly(false)}
                className={`px-3 py-1 rounded-pill font-montserrat font-bold text-[11px] transition-all ${
                  !monthly ? 'bg-carbon text-white shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => setMonthly(true)}
                className={`px-3 py-1 rounded-pill font-montserrat font-bold text-[11px] transition-all ${
                  monthly ? 'bg-carbon text-white shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-grey100 flex-shrink-0"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs font-montserrat">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-medium ${item.amount < 0 ? 'text-emerald-600' : 'text-carbon'}`}>
                    {item.amount >= 0 ? `$${item.amount.toLocaleString()}` : `-$${Math.abs(item.amount).toLocaleString()}`}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-montserrat font-bold">
                <span className="text-carbon">Total / year</span>
                <span className="text-bdred">SGD ${price.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}