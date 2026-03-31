import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PriceBar({ price, formData }) {
  const [expanded, setExpanded] = useState(false);
  const [monthly, setMonthly] = useState(false);

  const displayPrice = monthly ? Math.round(price / 12) : price;
  const period = monthly ? 'month' : 'year';

  const breakdownItems = [];
  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  breakdownItems.push({ label: `${coverLabels[formData.coverType] || 'Base'} premium`, value: price });

  if (formData.benefitPA) breakdownItems.push({ label: 'Personal Accident & Medical', value: formData.paCoverLevel === 200000 ? 158 : formData.paCoverLevel === 100000 ? 110 : 78 });
  if (formData.benefitNCD) breakdownItems.push({ label: 'NCD Protection', value: 95 });
  if (formData.benefitLOU) breakdownItems.push({ label: 'Loss of Use', value: 120 });
  if (formData.benefitWindscreen) breakdownItems.push({ label: 'Excess-free Windscreen', value: 60 });

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-montserrat">Your estimated premium</p>
            <p className="font-montserrat font-bold text-xl text-bdred">
              SGD ${displayPrice.toLocaleString()} <span className="text-sm font-normal text-carbon">/ {period}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonthly(!monthly)}
              className="text-[11px] font-montserrat font-bold text-cyan bg-cyan/10 px-2.5 py-1 rounded-full"
            >
              {monthly ? 'Annual' : 'Monthly'}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-grey100"
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
              {breakdownItems.map((item, i) => (
                <div key={i} className="flex justify-between text-xs font-montserrat">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-carbon font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-montserrat font-bold">
                <span className="text-carbon">Total</span>
                <span className="text-bdred">SGD ${price.toLocaleString()} / year</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}