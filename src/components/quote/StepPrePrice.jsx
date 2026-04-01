import { useState, useEffect } from 'react';
import { Tag, ChevronDown, ChevronUp, X } from 'lucide-react';
import { BASE_PRICES } from '../../lib/quoteData';
import StepFooter from './StepFooter';

const COVERAGE_DATA = {
  COMP: [
    { label: 'Injury or death to someone else', value: 'Unlimited cover' },
    { label: "Damage to other people's property", value: 'up to S$5,000,000' },
    { label: 'Legal costs against criminal charges', value: 'up to S$3,000' },
    { label: 'Towing after an accident', value: 'S$500 overseas / S$200 local tow' },
    { label: 'Damage by fire', included: true },
    { label: 'Damage or loss to your car due to theft', included: true },
    { label: 'Damage to your car if someone else crashes into you', included: true },
    { label: "Damage to your car when it's your fault", included: true },
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
    { label: "Damage to your car when it's your fault", included: false },
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
    { label: "Damage to your car when it's your fault", included: false },
    { label: 'Damage by fallen trees, flood, storms or natural disaster', included: false },
    { label: 'Damage by vandals', included: false },
    { label: 'Damage to windscreen or windows', included: false },
  ],
};

function CoverageRow({ row, i }) {
  return (
    <div className={`flex items-start gap-3 px-3 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-grey100'}`}>
      <span className="text-xs font-montserrat text-carbon leading-snug" style={{ flex: '0 1 65%' }}>{row.label}</span>
      <span className="text-right font-montserrat text-xs font-medium leading-snug" style={{ flex: '0 0 35%' }}>
        {row.value !== undefined ? (
          <span className="text-carbon">{row.value}</span>
        ) : row.included ? (
          <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
        ) : (
          <span className="text-bdred font-bold text-base leading-none">✕</span>
        )}
      </span>
    </div>
  );
}

export default function StepPrePrice({ formData, price, onNext, onBack }) {
  const [period, setPeriod] = useState('monthly');
  const [showCoverage, setShowCoverage] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [promoError, setPromoError] = useState('');
  const [utmPromo, setUtmPromo] = useState('');

  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const coverType = formData.coverType || 'COMP';

  // Check for UTM promo on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('promo');
    if (p && p.toUpperCase() === 'TEST') {
      setUtmPromo(p.toUpperCase());
    }
  }, []);

  const basePrice = BASE_PRICES[coverType] || price;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdDiscount = Math.round(basePrice * ncd / 100);
  const monthlyPrice = price;
  const annualPrice = Math.round(price * 0.97);
  const displayPrice = period === 'annual' ? annualPrice : monthlyPrice;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'TEST') {
      setPromoApplied(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
      setPromoApplied('');
    }
  };

  const removePromo = () => {
    setPromoApplied('');
    setPromoCode('');
    setPromoError('');
  };

  const removeUtmPromo = () => setUtmPromo('');

  const coverageRows = COVERAGE_DATA[coverType] || COVERAGE_DATA.COMP;

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Here is your estimated quote
      </h1>

      {/* UTM promo banner */}
      {utmPromo && (
        <div className="flex items-start justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <div>
            <p className="text-xs font-montserrat font-bold text-emerald-700">Promo applied: {utmPromo}</p>
            <p className="text-xs font-montserrat text-emerald-600 mt-0.5">CapitaVoucher S$20 will be sent within 30 days after your policy starts.</p>
          </div>
          <button type="button" onClick={removeUtmPromo} className="flex-shrink-0 text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Price card with toggle inside */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {/* Compact toggle inside card */}
        <div className="flex bg-grey100 rounded-pill p-0.5 mb-4 w-fit mx-auto">
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all ${period === 'monthly' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPeriod('annual')}
            className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all ${period === 'annual' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
            Annual {period === 'annual' && <span className="text-emerald-600 text-[10px] ml-1">Save 3%</span>}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs font-montserrat text-muted-foreground mb-1">
            Estimated {period === 'monthly' ? 'monthly' : 'annual'} premium
          </p>
          <p className="font-montserrat font-bold text-4xl text-bdred">
            SGD ${displayPrice.toLocaleString()}
          </p>
          <p className="font-montserrat text-sm text-carbon mt-1">per {period === 'monthly' ? 'month' : 'year'}</p>
        </div>

        {/* Nested breakdown */}
        {(ncd > 0 || period === 'annual') && (
          <div className="mt-4 border-l-2 border-gray-100 pl-3 space-y-1.5">
            <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
              <span>{coverLabels[coverType]} base</span>
              <span className="font-medium text-carbon">${basePrice.toLocaleString()}</span>
            </div>
            {ncd > 0 && (
              <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
                <span>NCD discount ({ncd}%)</span>
                <span className="text-emerald-600 font-medium">−${ncdDiscount.toLocaleString()}</span>
              </div>
            )}
            {period === 'annual' && (
              <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
                <span>Annual pay discount (3%)</span>
                <span className="text-emerald-600 font-medium">−${(monthlyPrice - annualPrice).toLocaleString()}</span>
              </div>
            )}
            {(promoApplied || utmPromo) && (
              <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
                <span>CapitaVoucher S$20</span>
                <span className="text-emerald-600 font-medium">sent after policy start</span>
              </div>
            )}
          </div>
        )}

        {/* Switch to annual hint */}
        {period === 'monthly' && (
          <p className="text-[11px] text-muted-foreground font-montserrat text-center mt-3">
            Switch to annual and save SGD ${(monthlyPrice - annualPrice).toLocaleString()}/yr
          </p>
        )}
      </div>

      {/* Promo code — collapsed secondary link */}
      <div>
        {!promoApplied && !utmPromo ? (
          !showPromoInput ? (
            <button
              type="button"
              onClick={() => setShowPromoInput(true)}
              className="text-xs font-montserrat font-bold text-cyan hover:underline flex items-center gap-1 px-1">
              <Tag className="w-3 h-3" /> Have a promo code?
            </button>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                  placeholder="Enter promo code"
                  className={`flex-1 px-3 py-2.5 border-2 rounded-lg text-sm font-montserrat text-carbon focus:outline-none ${promoError ? 'border-bdred' : 'border-gray-200 focus:border-bdred'}`}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim()}
                  className="px-4 py-2.5 rounded-lg font-montserrat font-bold text-sm bg-bdred text-white disabled:bg-gray-200 disabled:text-gray-400 transition-all">
                  Apply
                </button>
              </div>
              {promoError && <p className="text-xs text-bdred mt-1.5 font-montserrat">{promoError}</p>}
            </div>
          )
        ) : (
          promoApplied && (
            <div className="flex items-start justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <div>
                <p className="text-xs font-montserrat font-bold text-emerald-700">Promo applied: {promoApplied}</p>
                <p className="text-xs font-montserrat text-emerald-600 mt-0.5">CapitaVoucher S$20 will be sent within 30 days after your policy starts.</p>
              </div>
              <button type="button" onClick={removePromo} className="text-xs font-montserrat text-muted-foreground underline flex-shrink-0">Remove</button>
            </div>
          )
        )}
      </div>

      {/* Core Cover(s) — collapsible */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <p className="font-montserrat font-bold text-sm text-carbon mb-3">Core Cover(s)</p>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {coverageRows.map((row, i) => <CoverageRow key={i} row={row} i={i} />)}
          </div>
          {!showCoverage ? (
            <button
              type="button"
              onClick={() => setShowCoverage(true)}
              className="mt-3 text-xs font-montserrat font-bold text-cyan hover:underline flex items-center gap-1">
              View Full Coverage <ChevronDown className="w-3 h-3" />
            </button>
          ) : (
            <>
              <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
                <div className="flex items-center px-3 py-2 bg-grey100 border-b border-gray-100">
                  <span className="text-[11px] font-montserrat font-bold text-muted-foreground flex-1">Benefit</span>
                  <span className="text-[11px] font-montserrat font-bold text-muted-foreground text-right" style={{ flex: '0 0 35%' }}>Coverage</span>
                </div>
                {coverageRows.map((row, i) => <CoverageRow key={i} row={row} i={i} />)}
              </div>
              <button
                type="button"
                onClick={() => setShowCoverage(false)}
                className="mt-3 text-xs font-montserrat font-bold text-cyan hover:underline flex items-center gap-1">
                Hide Full Coverage <ChevronUp className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground font-montserrat leading-relaxed">
        This is an estimated price based on the information provided. Final price confirmed after all details are completed.
      </p>

      <StepFooter onBack={onBack} onNext={onNext} label="Continue to personalise your quote" />
    </div>
  );
}