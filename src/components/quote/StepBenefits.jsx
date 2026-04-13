import { useState } from 'react';
import {
  Shield, Car, ShieldCheck, Wind, Wrench, Phone, Heart, Globe,
  Umbrella, Star, Battery, Zap, Wifi, Baby, ShoppingBag,
  AlertCircle, Users, Gauge, ChevronDown, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import { HELP_TEXTS } from '../../lib/quoteData';

const ALL_BENEFITS = [
  // Protection
  { key: 'benefitPA', levelKey: 'paCoverLevel', icon: Shield, name: 'Personal Accident', desc: 'Cover for you and passengers in the event of injuries', levels: ['$20,000', '$50,000', '$100,000', '$200,000', '$500,000'], category: 'protection', popular: true },
  { key: 'benefitMedical', levelKey: 'medicalLevel', icon: Heart, name: 'Medical Expenses', desc: 'Cover for medical costs arising from an accident', levels: ['$1,000', '$2,000', '$3,000', '$5,000'], category: 'protection', popular: true },
  { key: 'benefitExcessWaiver', levelKey: 'excessWaiverLevel', icon: AlertCircle, name: 'Excess Waiver', desc: 'Waive your policy excess when you make a claim', levels: ['Up to 1 claim', 'Up to 2 claims'], category: 'protection', popular: true },
  { key: 'benefitNCD', levelKey: 'ncdLevel', icon: ShieldCheck, name: 'NCD Protector', desc: 'Protect your No Claims Discount after a claim', levels: ['NCD Protector', 'NCD Protector Plus'], category: 'protection', helpKey: 'ncdProtection' },
  { key: 'benefitPersonalEffects', levelKey: 'personalEffectsLevel', icon: ShoppingBag, name: 'Personal Effects/Valuable Cover', desc: 'Cover for personal belongings kept in the car', levels: ['Up to $5,000', 'Up to $10,000', 'Up to $25,000'], category: 'protection' },
  // Convenience
  { key: 'benefitRoadside', levelKey: 'roadsideLevel', icon: Phone, name: '24 Hours Roadside Assistance', desc: 'Round-the-clock help for breakdowns and emergencies', levels: ['SG Only up to $200', 'SG Only up to $500', 'SG & MY up to $200', 'SG & MY up to $500', 'SG & MY up to $1,000'], category: 'convenience', popular: true },
  { key: 'benefitLOU', levelKey: 'louLevel', icon: Car, name: 'Transport Allowance/Loss of Use', desc: 'Daily allowance for transport while your car is being repaired', levels: ['$50/day, max 10 days', '$50/day, max 20 days', '$50/day, max 30 days', '$100/day, max 10 days', '$100/day, max 20 days', '$100/day, max 30 days'], category: 'convenience', helpKey: 'lou' },
  { key: 'benefitWorkshop', levelKey: 'workshopLevel', icon: Wrench, name: 'Workshop Option', desc: 'Choose your preferred workshop for repairs', levels: ['Any Workshop', 'Any Dealer Workshop'], category: 'convenience' },
  { key: 'benefitOverseas', levelKey: 'overseasLevel', icon: Globe, name: 'Overseas Emergency Allowance/Repatriation', desc: 'Emergency support and repatriation if stranded overseas', levels: ['Transport: $200/person, $1,000 for car; Med. Evac.: $10,000/person', 'Transport: $200/person, $2,000 for car; Med. Evac.: $20,000/person', 'Transport: $200/person, $3,500 for car; Med. Evac.: $25,000/person'], category: 'convenience' },
  { key: 'benefitSGOnly', icon: Umbrella, name: 'Singapore Only', desc: 'Coverage limited to Singapore roads only', category: 'convenience' },
  // Vehicle
  { key: 'benefitWindscreen', levelKey: 'windscreenLevel', icon: Wind, name: 'Windscreen Cover Add-On', desc: 'Repair or replace your windscreen without paying excess', levels: ['Up to 1 claim', 'Up to 2 claims', 'Unlimited'], category: 'vehicle', popular: true, helpKey: 'windscreen' },
  { key: 'benefitModifications', levelKey: 'modificationsLevel', icon: Star, name: 'Car Modifications & Accessories', desc: 'Cover for approved modifications and accessories', levels: ['Up to $1,000', 'Up to $2,000', 'Up to $5,000', 'Up to $10,000'], category: 'vehicle' },
  { key: 'benefitNewForOld', icon: ShoppingBag, name: 'New for Old Replacement', desc: 'Replace your car with a brand-new equivalent if written off', category: 'vehicle' },
  { key: 'benefitUnlimitedNamedDrivers', levelKey: 'unlimitedNamedDriversLevel', icon: Users, name: 'Unlimited Named Drivers', desc: 'Cover any number of named drivers on your policy', levels: ['No Young, Inexperienced or Elderly driver(s)', 'Any driver'], category: 'vehicle' },
  { key: 'benefitLowMileage', icon: Gauge, name: 'Low Mileage', desc: 'Discounted premium for low annual mileage drivers', category: 'vehicle' },
  { key: 'benefitChildSeat', icon: Baby, name: 'Child Car Seat Cover', desc: 'Replacement cover for child car seats after an accident', category: 'vehicle' },
  // EV
  { key: 'benefitBattery', levelKey: 'batteryLevel', icon: Battery, name: 'Battery Cover', desc: 'Cover for EV/hybrid battery replacement', levels: ['Up to $10,000', 'Up to $25,000', 'Unlimited'], category: 'ev' },
  { key: 'benefitChargingDamage', levelKey: 'chargingDamageLevel', icon: Zap, name: 'Damage to Charging Station', desc: 'Cover for damage caused to public or private charging stations', levels: ['Up to $5,000', 'Up to $10,000', 'Up to $25,000'], category: 'ev' },
  { key: 'benefitPrivateCharging', levelKey: 'privateChargingLevel', icon: Zap, name: 'Private Charging Station Cover', desc: 'Cover for your home or private charging equipment', levels: ['Up to $5,000', 'Up to $10,000', 'Up to $25,000'], category: 'ev' },
  { key: 'benefitCyber', levelKey: 'cyberLevel', icon: Wifi, name: 'Cyber Attack Cover', desc: 'Protection against cyber threats targeting your connected car', levels: ['Up to $10,000', 'Up to $25,000', 'Unlimited'], category: 'ev' },
];

const CATEGORIES = [
  { id: 'protection', label: 'Protection', emoji: '🛡️', desc: 'Cover for you and your passengers' },
  { id: 'convenience', label: 'Convenience', emoji: '🔧', desc: 'Help when things go wrong' },
  { id: 'vehicle', label: 'Vehicle', emoji: '🚗', desc: 'Extra cover for your car' },
  { id: 'ev', label: 'EV / Hybrid', emoji: '⚡', desc: 'Tailored for electric & hybrid vehicles' },
];

function BenefitCard({ b, formData, onChange }) {
  const isOn = !!formData[b.key];
  const selectedLevel = b.levelKey ? formData[b.levelKey] : null;
  const Icon = b.icon;

  const handleToggle = () => {
    onChange(b.key, !isOn);
    if (!isOn && b.levels?.length) onChange(b.levelKey, b.levels[0]);
    if (isOn && b.levelKey) onChange(b.levelKey, '');
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-all ${isOn ? 'border-bdred bg-red-50/40' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isOn ? 'bg-bdred' : 'bg-grey100'}`}>
          <Icon className={`w-4 h-4 ${isOn ? 'text-white' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-montserrat font-bold text-sm text-carbon">{b.name}</span>
              {b.popular && (
                <span className="text-[10px] font-montserrat font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Popular</span>
              )}
              {b.helpKey && <HelpIcon onClick={(e) => { e.stopPropagation(); }} />}
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${isOn ? 'bg-bdred' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-montserrat mt-0.5 leading-relaxed">{b.desc}</p>
          {isOn && selectedLevel && (
            <p className="text-xs font-montserrat font-semibold text-bdred mt-1">✓ {selectedLevel}</p>
          )}
        </div>
      </div>

      {b.levels && isOn && (
        <div className="mt-3 pt-3 border-t border-red-100">
          <p className="text-[11px] font-montserrat font-semibold text-muted-foreground uppercase tracking-wide mb-2">Select level</p>
          <div className="flex flex-wrap gap-2">
            {b.levels.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => onChange(b.levelKey, level)}
                className={`px-3 py-1.5 rounded-pill text-xs font-montserrat font-bold border-2 transition-all leading-tight text-left ${
                  selectedLevel === level
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-gray-200 hover:border-bdred/40'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ cat, benefits, formData, onChange }) {
  const [open, setOpen] = useState(cat.id === 'protection');
  const selected = benefits.filter(b => formData[b.key]).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-grey100/50 transition-colors"
      >
        <span className="text-xl">{cat.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-montserrat font-bold text-sm text-carbon">{cat.label}</p>
            {selected > 0 && (
              <span className="text-[10px] font-montserrat font-bold bg-bdred text-white px-1.5 py-0.5 rounded-full">
                {selected} added
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-montserrat">{cat.desc} · {benefits.length} options</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              {benefits.map(b => (
                <BenefitCard key={b.key} b={b} formData={formData} onChange={onChange} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StepBenefits({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(null);

  const recommended = ALL_BENEFITS.filter(b => b.popular);
  const totalSelected = ALL_BENEFITS.filter(b => formData[b.key]).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-montserrat font-bold text-xl text-carbon">Customise your cover</h1>
        <p className="text-sm text-muted-foreground font-montserrat mt-1">All optional — add only what matters to you.</p>
      </div>

      {/* Selected count pill */}
      {totalSelected > 0 && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <p className="text-xs font-montserrat font-semibold text-green-700">{totalSelected} optional cover{totalSelected > 1 ? 's' : ''} added to your policy</p>
        </div>
      )}

      {/* Recommended section */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <p className="font-montserrat font-bold text-sm text-amber-800">Most Popular</p>
          <p className="text-xs text-amber-600 font-montserrat">— chosen by most customers</p>
        </div>
        {recommended.map(b => (
          <BenefitCard key={b.key} b={b} formData={formData} onChange={onChange} />
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {CATEGORIES.map(cat => {
          const catBenefits = ALL_BENEFITS.filter(b => b.category === cat.id && !b.popular);
          if (catBenefits.length === 0) return null;
          return (
            <CategorySection
              key={cat.id}
              cat={cat}
              benefits={catBenefits}
              formData={formData}
              onChange={onChange}
            />
          );
        })}
      </div>

      <StepFooter onBack={onBack} onNext={onNext} />

      <HelpDrawer open={!!helpOpen} onClose={() => setHelpOpen(null)} title={ALL_BENEFITS.find(b => b.helpKey === helpOpen)?.name || ''}>
        {helpOpen && HELP_TEXTS[helpOpen]}
      </HelpDrawer>
    </div>
  );
}