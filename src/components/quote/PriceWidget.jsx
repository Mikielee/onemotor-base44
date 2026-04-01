import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_PRICES, EXCESS_DELTA } from '../../lib/quoteData';

const COVER_LABELS = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };

function Row({ label, value, type = 'neutral', small = false }) {
  const valueColor =
    type === 'raise' ? 'text-bdred font-semibold' :
    type === 'lower' ? 'text-emerald-600 font-semibold' :
    'text-carbon font-medium';
  return (
    <div className={`flex justify-between items-center ${small ? 'py-1' : 'py-1.5'}`}>
      <span className="text-xs font-montserrat text-muted-foreground">{label}</span>
      <span className={`text-xs font-montserrat ${valueColor}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 my-1" />;
}

export default function PriceWidget({ formData, price }) {
  const [expanded, setExpanded] = useState(false);
  const [period, setPeriod] = useState('monthly');

  const coverType = formData.coverType;
  const hasPrice = price && price > 0;

  const basePrice = BASE_PRICES[coverType] || price;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdDiscount = Math.round(basePrice * ncd / 100);
  const excessDelta = EXCESS_DELTA[formData.excess || 1000] || 0;

  const raises = [];
  if (excessDelta < 0) raises.push({ label: `Excess (S$${formData.excess || 1000})`, amount: excessDelta });
  if (excessDelta > 0) raises.push({ label: `Excess (S$${formData.excess || 1000})`, amount: excessDelta });
  if (formData.benefitNCD) raises.push({ label: 'NCD Protection', amount: 95 });
  if (formData.benefitPA) {
    const paMap = { 50000: 78, 100000: 110, 200000: 158 };
    raises.push({ label: 'Personal Accident', amount: paMap[formData.paCoverLevel || 50000] || 78 });
  }
  if (formData.benefitLOU) raises.push({ label: 'Loss of Use', amount: 120 });
  if (formData.benefitWindscreen) raises.push({ label: 'Windscreen Cover', amount: 60 });
  if (formData.additionalDriverPlan === 'any') raises.push({ label: 'Any Driver Plan', amount: 200 });
  if (formData.namedDrivers?.length) raises.push({ label: `Named Drivers (×${formData.namedDrivers.length})`, amount: formData.namedDrivers.length * 80 });
  if (formData.carUsage === 'business') raises.push({ label: 'Business Use', amount: 80 });

  const lowers = [];
  if (ncdDiscount > 0) lowers.push({ label: `NCD Discount (${ncd}%)`, amount: ncdDiscount });
  if (formData.offPeak === 'yes') lowers.push({ label: 'Off-Peak Discount', amount: 60 });
  if (formData.certificateOfMerit === 'yes') lowers.push({ label: 'Certificate of Merit', amount: 30 });
  if (formData.driveLessOptIn) lowers.push({ label: 'Drive Less Pay Less', amount: 150 });

  const hasPromo = formData.promoApplied || formData.utmPromo;
  const promoLabel = hasPromo ? (formData.promoApplied || formData.utmPromo) : null;

  const annualPrice = price;
  const monthlyPrice = Math.round(annualPrice / 12);
  const displayPrice = period === 'monthly' ? monthlyPrice : annualPrice;
  const periodLabel = period === 'monthly' ? 'month' : 'year';

  const vehicleStr = [formData.make, formData.model, formData.registrationYear].filter(Boolean).join(' · ');

  // Placeholder state
  if (!hasPrice) {
    return (
      <div className="fixed bottom-[68px] left-0 right-0 z-[49] px-4 pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <div className="bg-white border border-gray-200 rounded-t-xl shadow-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase">
                Your Indicative Premium:
              </span>
              <span className="font-montserrat font-bold text-gray-300 text-base">—</span>
            </div>
            <p className="text-xs font-montserrat text-muted-foreground mt-2">Complete earlier steps to see your price</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-[49] px-4 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-white border border-gray-200 rounded-t-xl shadow-lg overflow-hidden">

          {/* Collapsed bar — always visible */}
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase">
                Your Indicative Premium:
              </span>
              <span className="font-montserrat font-bold text-bdred text-base">
                S${displayPrice.toLocaleString()}
              </span>
              <span className="text-xs font-montserrat text-muted-foreground">/ {periodLabel}</span>
            </div>
            {expanded
              ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              : <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            }
          </button>

          {/* Expanded panel */}
      </div>
    </div>
  );
}