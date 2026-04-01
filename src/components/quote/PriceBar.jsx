import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_PRICES, EXCESS_DELTA } from '../../lib/quoteData';
import { useQuoteContext } from './QuoteContext';

const COVER_LABELS = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };

export default function PriceBar({ price, formData }) {
  const [expanded, setExpanded] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const { footerContent } = useQuoteContext();

  const coverType = formData.coverType || 'COMP';
  const displayPrice = monthly ? Math.round(price / 12) : price;
  const period = monthly ? 'month' : 'year';

  let base = BASE_PRICES[coverType] || 1234;
  if (formData.carUsage === 'business') base += 80;
  if (formData.offPeak === 'yes') base -= 60;
  if (formData.claimsInPast3Years === 'yes') base += 40;
  if (formData.certificateOfMerit === 'yes') base -= 30;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdAmount = Math.round(base * ncd / 100);

  const items = [{ label: 'Base premium', amount: base }];
  if (ncd > 0) items.push({ label: `NCD discount (${ncd}%)`, amount: -ncdAmount });
  const excessAdj = EXCESS_DELTA[formData.excess || 1000] || 0;
  items.push({ label: `Excess: S$${(formData.excess || 1000).toLocaleString()}`, amount: excessAdj });
  if (formData.additionalDriverPlan === 'any') items.push({ label: 'Any Driver plan', amount: 200 });
  else if (formData.namedDrivers?.length > 0) {
    formData.namedDrivers.forEach((d, i) => {
      items.push({ label: `${d.preferredName || `Driver ${i + 1}`} (named driver)`, amount: 80 });
    });
  }
  if (formData.driveLessOptIn) items.push({ label: 'Drive Less Pay Less', amount: -150 });
  if (formData.benefitPA) {
    const pa = formData.paCoverLevel === 200000 ? 158 : formData.paCoverLevel === 100000 ? 110 : 78;
    items.push({ label: 'Personal Accident & Medical', amount: pa });
  }
  if (formData.benefitNCD) items.push({ label: 'NCD Protection', amount: 95 });
  if (formData.benefitLOU) items.push({ label: 'Loss of Use', amount: 120 });
  if (formData.benefitWindscreen) items.push({ label: 'Excess-free Windscreen', amount: 60 });

  const hasPromo = formData.promoApplied || formData.utmPromo;
  const vehicleStr = [formData.make, formData.model, formData.registrationYear].filter(Boolean).join(' · ') || '—';

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-20 bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.12)]">

      {/* Expandable breakdown — collapsed by default */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-[45vh] overflow-y-auto px-4 pt-3 pb-3 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-bdred flex-shrink-0" />
                <span className="text-sm font-montserrat font-bold text-carbon">{COVER_LABELS[coverType] || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-bdred flex-shrink-0" />
                <span className="text-sm font-montserrat text-carbon">{vehicleStr}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 space-y-1.5">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs font-montserrat">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-medium ${item.amount < 0 ? 'text-emerald-600' : 'text-carbon'}`}>
                      {item.amount === 0 ? '—' : item.amount < 0 ? `-S$${Math.abs(item.amount).toLocaleString()}` : `S$${item.amount.toLocaleString()}`}
                    </span>
                  </div>
                ))}
                {hasPromo && (
                  <div className="flex justify-between text-xs font-montserrat">
                    <span className="text-muted-foreground">CapitaVoucher S$20</span>
                    <span className="text-emerald-600 font-medium">sent within 30 days</span>
                  </div>
                )}
              </div>
              <div className="flex bg-grey100 rounded-pill p-0.5 w-fit mx-auto">
                <button type="button" onClick={() => setMonthly(false)}
                  className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all ${!monthly ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
                  Annual
                </button>
                <button type="button" onClick={() => setMonthly(true)}
                  className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all ${monthly ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
                  Monthly
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price row — always visible, tap to expand */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 gap-3 border-t-2 border-gray-200"
      >
        <div className="text-left">
          <p className="text-[10px] font-montserrat text-muted-foreground uppercase tracking-widest">Your estimated premium</p>
          <p className="font-montserrat font-bold text-lg text-bdred leading-tight">
            S${displayPrice.toLocaleString()} <span className="text-sm font-normal text-carbon">/ {period}</span>
          </p>
        </div>
        <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-grey100">
          {expanded ? <ChevronDown className="w-4 h-4 text-carbon" /> : <ChevronUp className="w-4 h-4 text-carbon" />}
        </div>
      </button>

      {/* Footer buttons — slotted in from StepFooter via context */}
      {footerContent}
    </div>
  );
}