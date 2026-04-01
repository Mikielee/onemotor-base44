import { useState } from 'react';
import { Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { BASE_PRICES } from '../../lib/quoteData';
import StepFooter from './StepFooter';

const VALID_PROMOS = { 'NEWCAR': 30, 'SAVE50': 50, 'BUDGET10': 10 };

const COVERAGE_DATA = {
  COMP: [
    { label: 'Injury or death to someone else', value: 'Unlimited cover' },
    { label: "Damage to other people's property", value: 'up to S$5,000,000' },
    { label: 'Legal costs against criminal charges', value: 'up to S$3,000' },
    { label: 'Towing after an accident', value: 'S$500 overseas / S$200 local tow' },
    { label: 'Damage by fire', included: true },
    { label: 'Damage or loss to your car due to theft', included: true },
    { label: 'Damage to your car if someone else crashes into you', included: true },
    { label: 'Damage to your car when it\'s your fault', included: true },
    { label: 'Damage by fallen trees, flood, storms or natural disaster', included: true },
    { label: 'Damage by vandals', included: true },
    { label: 'Damage to windscreen or windows', included: true },
  ],
  TPFT: [
    { label: 'Injury or death to someone else', value: 'Unlimited cover' },
    { label: "Damage to other people's property", value: 'up to S$5,000,000' },
    { label: 'Legal costs against criminal charges', value: 'up to S$3,000' },
    { label: 'Towing after an accident', value: 'S$500 overseas / S$200 local (fire or theft only)' },
    { label: 'Damage by fire', included: true },
    { label: 'Damage or loss to your car due to theft', included: true },
    { label: 'Damage to your car if someone else crashes into you', included: false },
    { label: 'Damage to your car when it\'s your fault', included: false },
    { label: 'Damage by fallen trees, flood, storms or natural disaster', included: false },
    { label: 'Damage by vandals', included: false },
    { label: 'Damage to windscreen or windows', included: false },
  ],
  TPO: [
    { label: 'Injury or death to someone else', value: 'Unlimited cover' },
    { label: "Damage to other people's property", value: 'up to S$5,000,000' },
    { label: 'Legal costs against criminal charges', value: 'up to S$3,000' },
    { label: 'Towing after an accident', included: false },
    { label: 'Damage by fire', included: false },
    { label: 'Damage or loss to your car due to theft', included: false },
    { label: 'Damage to your car if someone else crashes into you', included: false },
    { label: 'Damage to your car when it\'s your fault', included: false },
    { label: 'Damage by fallen trees, flood, storms or natural disaster', included: false },
    { label: 'Damage by vandals', included: false },
    { label: 'Damage to windscreen or windows', included: false },
  ],
};


export default function StepPrePrice({ formData, price, onNext, onBack }) {
  const [period, setPeriod] = useState('monthly');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [showFullCoverage, setShowFullCoverage] = useState(false);

  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const coverType = formData.coverType || 'COMP';

  const basePrice = BASE_PRICES[coverType] || price;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdDiscount = Math.round(basePrice * ncd / 100);
  const priceAfterNcd = basePrice - ncdDiscount;

  const annualPrice = Math.round((price - promoDiscount) * 0.97);
  const monthlyPrice = price - promoDiscount;
  const displayPrice = period === 'annual' ? annualPrice : monthlyPrice;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_PROMOS[code]) {
      setPromoDiscount(VALID_PROMOS[code]);
      setPromoApplied(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
      setPromoApplied('');
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Here is your estimated quote
      </h1>

      {/* Monthly / Annual pill toggle */}
      <div className="flex bg-grey100 rounded-pill p-1">
        <button
          type="button"
          onClick={() => setPeriod('monthly')}
          className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-sm transition-all ${period === 'monthly' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
          
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setPeriod('annual')}
          className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-sm transition-all ${period === 'annual' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
          
          Annual
          {period === 'annual' && <span className="text-emerald-600 text-[10px] ml-1">Save 3%</span>}
        </button>
      </div>
      

      

      {/* Price display */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
        <p className="text-xs font-montserrat text-muted-foreground mb-1">
          Estimated {period === 'monthly' ? 'monthly' : 'annual'} premium
        </p>
        <p className="font-montserrat font-bold text-4xl text-bdred">
          SGD ${displayPrice.toLocaleString()}
        </p>
        <p className="font-montserrat text-sm text-carbon mt-1">per {period === 'monthly' ? 'month' : 'year'}</p>
        {period === 'monthly' &&
        <p className="font-montserrat text-xs text-muted-foreground mt-2">
            Annual: SGD ${annualPrice.toLocaleString()} (save 3%)
          </p>
        }
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="font-montserrat font-bold text-sm text-carbon mb-3">Price breakdown</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-montserrat">
            <span className="text-muted-foreground">{coverLabels[coverType]} base premium</span>
            <span className="text-carbon font-medium">${basePrice.toLocaleString()}</span>
          </div>
          {ncd > 0 &&
          <div className="flex justify-between text-xs font-montserrat">
              <span className="text-muted-foreground">NCD discount ({ncd}%)</span>
              <span className="text-emerald-600 font-medium">-${ncdDiscount.toLocaleString()}</span>
            </div>
          }
          {promoDiscount > 0 &&
          <div className="flex justify-between text-xs font-montserrat">
              <span className="text-muted-foreground flex items-center gap-1"><Tag className="w-3 h-3" /> Promo: {promoApplied}</span>
              <span className="text-emerald-600 font-medium">-${promoDiscount}</span>
            </div>
          }
          {period === 'annual' &&
          <div className="flex justify-between text-xs font-montserrat">
              <span className="text-muted-foreground">Annual pay discount (3%)</span>
              <span className="text-emerald-600 font-medium">-${(monthlyPrice - annualPrice).toLocaleString()}</span>
            </div>
          }
          <div className="border-t border-gray-100 pt-2 flex justify-between font-montserrat font-bold">
            <span className="text-sm text-carbon">Total</span>
            <span className="text-base text-bdred">SGD ${displayPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Promo code */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="font-montserrat font-bold text-sm text-carbon mb-3">Promo code</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {setPromoCode(e.target.value.toUpperCase());setPromoError('');}}
            placeholder="Enter promo code"
            className={`flex-1 px-3 py-2.5 border-2 rounded-lg text-sm font-montserrat text-carbon focus:outline-none ${promoError ? 'border-bdred' : promoApplied ? 'border-emerald-400' : 'border-gray-200 focus:border-bdred'}`} />
          
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
            className="px-4 py-2.5 rounded-lg font-montserrat font-bold text-sm bg-bdred text-white disabled:bg-gray-200 disabled:text-gray-400 transition-all">
            
            Apply
          </button>
        </div>
        {promoError && <p className="text-xs text-bdred mt-1.5 font-montserrat">{promoError}</p>}
        {promoApplied && <p className="text-xs text-emerald-600 mt-1.5 font-montserrat">✓ Code applied — saving ${promoDiscount}</p>}
      </div>

      {/* Core benefits accordion */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullCoverage(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 font-montserrat font-bold text-sm text-carbon">
          <span>What's covered — {coverLabels[coverType]}</span>
          {showFullCoverage ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showFullCoverage && (
          <div className="border-t border-gray-100">
            {(COVERAGE_DATA[coverType] || COVERAGE_DATA.COMP).map((row, i) => (
              <div key={i} className={`flex items-start justify-between gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-grey100'}`}>
                <span className="text-xs font-montserrat text-carbon leading-snug flex-1">{row.label}</span>
                <span className="flex-shrink-0 text-right">
                  {row.value !== undefined ? (
                    <span className="text-xs font-montserrat font-medium text-carbon">{row.value}</span>
                  ) : row.included ? (
                    <span className="text-emerald-600 text-base leading-none">✓</span>
                  ) : (
                    <span className="text-bdred text-base leading-none">✕</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground font-montserrat leading-relaxed">
        This is an estimated price based on the information provided. Final price confirmed after all details are completed.
      </p>

      <StepFooter onBack={onBack} onNext={onNext} label="Continue to personalise your quote" />
    </div>);

}