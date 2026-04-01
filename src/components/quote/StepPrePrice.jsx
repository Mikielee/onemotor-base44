import { useState, useEffect } from 'react';
import { Tag, ChevronDown, ChevronUp, X, Plus, Shield, Car, Mail } from 'lucide-react';
import { BASE_PRICES } from '../../lib/quoteData';
import StepFooter from './StepFooter';
import SaveEmailQuoteModal from './SaveEmailQuoteModal';

const COVERAGE_DATA = {
  COMP: [
    { label: 'Injury or death to someone else', value: 'Unlimited cover' },
    { label: "Damage to other people's property", value: 'up to S$5,000,000' },
    { label: 'Legal costs against criminal charges', value: 'up to S$3,000' },
    { label: 'Towing after an accident', value: 'S$500 for overseas tow and S$200 for local tow' },
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
    { label: 'Towing after an accident', value: 'S$500 for overseas tow and S$200 for local tow (only for fire to or theft of your car)' },
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

const OPTIONAL_COVERS = [
  'Personal Accident',
  'Medical Expenses',
  'No Claim Discount (NCD) Protection',
  '24 Hours Roadside Assistance',
  'Transport Allowance',
  'Any Workshop',
];

function CoverageRow({ row, i }) {
  return (
    <div className={`flex items-start gap-2 px-3 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-grey100'}`}>
      <span className="text-xs font-montserrat text-carbon leading-snug" style={{ flex: '0 1 62%', minWidth: 0 }}>
        {row.label}
      </span>
      <span className="text-right font-montserrat text-xs font-medium leading-snug" style={{ flex: '0 0 38%', minWidth: 0 }}>
        {row.value !== undefined ? (
          <span className="text-carbon break-words">{row.value}</span>
        ) : row.included ? (
          <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
        ) : (
          <span className="text-bdred font-bold text-base leading-none">✕</span>
        )}
      </span>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <p className="font-montserrat font-bold text-sm text-carbon">{title}</p>
      {subtitle && <p className="font-montserrat text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function StepPrePrice({ formData, onChange, price, onNext, onBack }) {
  const [period, setPeriod] = useState('monthly');
  const [showOptional, setShowOptional] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [promoError, setPromoError] = useState('');
  const [utmPromo, setUtmPromo] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const coverType = formData.coverType || 'COMP';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('promo');
    if (p && p.toUpperCase() === 'TEST') {
      setUtmPromo(p.toUpperCase());
      onChange('utmPromo', p.toUpperCase());
    }
  }, []);

  const basePrice = BASE_PRICES[coverType] || price;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdDiscount = Math.round(basePrice * ncd / 100);

  const annualPrice = price;
  const monthlyPrice = Math.round(annualPrice / 12);

  const displayPrice = period === 'annual' ? annualPrice : monthlyPrice;

  const promoActive = promoApplied || utmPromo;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'TEST') {
      setPromoApplied(code);
      onChange('promoApplied', code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
      setPromoApplied('');
      onChange('promoApplied', '');
    }
  };

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
          <button type="button" onClick={() => setUtmPromo('')} className="flex-shrink-0 text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Price card */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {/* Quote ID - subtle support info */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <p className="text-[10px] font-montserrat text-muted-foreground tracking-widest uppercase">Reference ID: P11361049R00</p>
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold text-cyan hover:bg-cyan/5 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            Save & Email
          </button>
        </div>

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
            className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all flex items-center gap-1 ${period === 'annual' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}>
            Annual
            {period === 'annual' && <span className="text-emerald-600 text-[10px]">Save 3%</span>}
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase mb-2">
            Your Indicative Premium:
          </p>
          <p className="font-montserrat font-bold text-4xl text-bdred">
            S${displayPrice.toLocaleString()}
          </p>
          <p className="font-montserrat text-xs text-muted-foreground mt-1">per {period === 'monthly' ? 'month' : 'year'}</p>
          <p className="font-montserrat text-xs text-muted-foreground mt-0.5">including prevailing GST</p>
        </div>

        {/* Nested breakdown */}
        <div className="mt-4 border-l-2 border-gray-100 pl-3 space-y-1.5">
          <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
            <span>{coverLabels[coverType]} base</span>
            <span className="font-medium text-carbon">S${basePrice.toLocaleString()}</span>
          </div>
          {ncd > 0 && (
            <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
              <span>NCD discount ({ncd}%)</span>
              <span className="text-emerald-600 font-medium">−S${ncdDiscount.toLocaleString()}</span>
            </div>
          )}

          {promoActive && (
            <div className="flex justify-between text-xs font-montserrat text-muted-foreground">
              <span>CapitaVoucher S$20</span>
              <span className="text-emerald-600 font-medium">sent after policy start</span>
            </div>
          )}
        </div>
      </div>

      {/* Promo code */}
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
                  className={`flex-1 px-3 py-2.5 border-2 rounded-lg text-sm font-montserrat text-carbon focus:outline-none ${promoError ? 'border-bdred' : promoApplied ? 'border-emerald-400' : 'border-gray-200 focus:border-bdred'}`}
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
              <button type="button" onClick={() => { setPromoApplied(''); setPromoCode(''); setPromoError(''); onChange('promoApplied', ''); }} className="text-xs font-montserrat text-muted-foreground underline flex-shrink-0">Remove</button>
            </div>
          )
        )}
      </div>

      {/* Confirmation mini-card */}
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 space-y-2">
        <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase mb-1">Your Policy:</p>
        <div className="flex items-center gap-2 min-w-0">
          <Shield className="w-4 h-4 text-bdred flex-shrink-0" />
          <span className="text-sm font-montserrat font-bold text-carbon leading-snug">{coverLabels[coverType] || '—'}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Car className="w-4 h-4 text-bdred flex-shrink-0" />
          <span className="text-sm font-montserrat text-carbon leading-snug">
            {[formData.make, formData.model, formData.registrationYear].filter(Boolean).join(' · ') || '—'}
          </span>
        </div>
      </div>

      {/* SECTION A — Core Cover(s): always visible */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Core Cover(s)" subtitle={`Included in your ${coverLabels[coverType]} plan`} />
        <div>
          {coverageRows.map((row, i) => <CoverageRow key={i} row={row} i={i} />)}
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <a href="#" className="text-xs font-montserrat font-bold text-cyan hover:underline">View Car Insurance Product Disclosure Document</a>
        </div>
      </div>

      {/* SECTION B — Optional Cover(s): collapsed by default */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowOptional(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-grey100 border-b border-gray-200">
          <div className="text-left">
            <p className="font-montserrat font-bold text-sm text-carbon">Optional Cover(s) You Can Choose</p>
            <p className="font-montserrat text-xs text-muted-foreground mt-0.5">Add extra protection to your policy</p>
          </div>
          {showOptional ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        </button>

        {showOptional && (
          <>
            <div>
              {OPTIONAL_COVERS.map((name, i) => (
                <div key={i} className={`flex items-center justify-between gap-2 px-3 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-grey100'}`}>
                  <span className="text-xs font-montserrat text-carbon leading-snug flex-1">{name}</span>
                  <span className="text-xs font-montserrat font-bold text-cyan">Available as Add-on</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <a href="#" className="text-xs font-montserrat font-bold text-cyan hover:underline">View Car Insurance Product Disclosure Document</a>
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground font-montserrat leading-relaxed">
        This is an estimated price based on the information provided. Final price confirmed after all details are completed.
      </p>

      <StepFooter onBack={onBack} onNext={onNext} label="Continue to personalise your quote" />

      {/* Email Quote Modal */}
      <SaveEmailQuoteModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} formData={formData} price={price} />
    </div>
  );
}