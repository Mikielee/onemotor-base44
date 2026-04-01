import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_PRICES, EXCESS_DELTA } from '../../lib/quoteData';

const COVER_LABELS = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };

function Row({ label, value, color = 'neutral' }) {
  const valueClass =
    color === 'raise' ? 'text-carbon font-medium' :
    color === 'lower' ? 'text-emerald-600 font-semibold' :
    color === 'promo' ? 'text-cyan font-semibold' :
    'text-carbon font-medium';
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs font-montserrat text-muted-foreground">{label}</span>
      <span className={`text-xs font-montserrat ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function PricePinned({ formData, price, onNext, onBack, period, setPeriod }) {
  const [expanded, setExpanded] = useState(false);

  const coverType = formData.coverType || 'COMP';
  const basePrice = BASE_PRICES[coverType] || price;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdDiscount = Math.round(basePrice * ncd / 100);
  const excessDelta = EXCESS_DELTA[formData.excess || 1000] || 0;

  const vehicleStr = [formData.make, formData.model, formData.registrationYear].filter(Boolean).join(' · ');

  // Build adds section
  const adds = [];
  if (excessDelta > 0) adds.push({ label: `Excess (S$${formData.excess || 1000})`, amount: excessDelta });
  if (formData.benefitNCD) adds.push({ label: 'NCD Protection', amount: 95 });
  if (formData.benefitPA) {
    const paMap = { 50000: 78, 100000: 110, 200000: 158 };
    const paAmount = paMap[formData.paCoverLevel || 50000] || 78;
    adds.push({ label: `Personal Accident (S$${formData.paCoverLevel || 50000})`, amount: paAmount });
  }
  if (formData.additionalDriverPlan === 'any') adds.push({ label: 'Any Driver Plan', amount: 200 });
  if (formData.namedDrivers?.length) adds.push({ label: `Additional Drivers (×${formData.namedDrivers.length})`, amount: formData.namedDrivers.length * 80 });

  // Build discounts section
  const discounts = [];
  if (ncdDiscount > 0) discounts.push({ label: `NCD Discount (${ncd}%)`, amount: ncdDiscount });
  if (formData.driveLessOptIn) discounts.push({ label: 'Drive Less Pay Less', amount: 150 });

  // Promo section
  const hasPromo = formData.promoApplied || formData.utmPromo;

  const annualPrice = price;
  const monthlyPrice = Math.round(annualPrice / 12);
  const displayPrice = period === 'monthly' ? monthlyPrice : annualPrice;
  const periodLabel = period === 'monthly' ? 'month' : 'year';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-39"
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Expanded bottom sheet */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] overflow-y-auto bg-white rounded-t-3xl"
          >
            <div className="max-w-lg mx-auto w-full px-4 py-6">
              {/* Collapse button */}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="absolute top-3 right-4 text-muted-foreground hover:text-carbon"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              {/* Cover & vehicle */}
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-bdred flex-shrink-0" />
                <span className="text-sm font-montserrat font-bold text-carbon">{COVER_LABELS[coverType]}</span>
              </div>
              {vehicleStr && (
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-4 h-4 text-bdred flex-shrink-0" />
                  <span className="text-xs font-montserrat text-carbon">{vehicleStr}</span>
                </div>
              )}

              <div className="border-t border-gray-100 my-3" />

              {/* Base premium */}
              <div className="py-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-montserrat text-muted-foreground">Base Indicative Premium ({COVER_LABELS[coverType]})</span>
                  <div className="text-right">
                    <span className="text-xs font-montserrat font-semibold text-carbon">S${basePrice.toLocaleString()} / {periodLabel}</span>
                    <p className="text-[10px] font-montserrat text-muted-foreground">incl. prevailing GST</p>
                  </div>
                </div>
              </div>

              {/* Adds section */}
              {adds.length > 0 && (
                <>
                  <div className="border-t border-gray-100 my-3" />
                  <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase mb-2">Adds to your premium</p>
                  {adds.map((a, i) => (
                    <Row key={i} label={a.label} value={`+S$${a.amount.toLocaleString()}`} color="raise" />
                  ))}
                </>
              )}

              {/* Discounts section */}
              {discounts.length > 0 && (
                <>
                  <div className="border-t border-gray-100 my-3" />
                  <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase mb-2">Discounts applied</p>
                  {discounts.map((d, i) => (
                    <Row key={i} label={d.label} value={`−S$${d.amount.toLocaleString()}`} color="lower" />
                  ))}
                </>
              )}

              {/* Promo section */}
              {hasPromo && (
                <>
                  <div className="border-t border-gray-100 my-3" />
                  <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase mb-2">Promotions & gifts</p>
                  <Row label="CapitaVoucher S$20" value="🎁 gift, sent 30 days post-purchase" color="promo" />
                  <p className="text-[10px] font-montserrat text-muted-foreground italic mt-1">Not deducted from your premium</p>
                </>
              )}

              <div className="border-t border-gray-100 my-3" />

              {/* Period toggle */}
              <div className="flex justify-center py-3">
                <div className="flex bg-gray-100 rounded-full p-0.5 gap-0.5">
                  {['monthly', 'annual'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-1.5 rounded-full font-montserrat font-semibold text-xs transition-all capitalize ${
                        period === p ? 'bg-white text-carbon shadow-sm' : 'bg-transparent text-muted-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6 pb-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 font-montserrat font-bold text-sm text-carbon hover:border-carbon/40 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="flex-1 px-4 py-3 rounded-lg bg-bdred text-white font-montserrat font-bold text-sm hover:bg-bdred/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed bar */}
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between px-4 py-3 border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase">
            Your Indicative Premium:
          </span>
          <span className="font-montserrat font-bold text-bdred text-base">
            S${displayPrice.toLocaleString()}
          </span>
          <span className="text-xs font-montserrat text-muted-foreground">/ {periodLabel}</span>
        </div>
        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </button>

      {/* Footer buttons (collapsed state) */}
      {!expanded && (
        <div className="border-t border-gray-100 flex gap-3 px-4 py-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 font-montserrat font-bold text-sm text-carbon hover:border-carbon/40 transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 px-4 py-3 rounded-lg bg-bdred text-white font-montserrat font-bold text-sm hover:bg-bdred/90 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}