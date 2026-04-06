import { useState } from 'react';
import { Shield, Car, ShieldCheck, Wind, Wrench, Phone, Heart, Globe, Plane, Umbrella, Star, Battery, Zap, Wifi, Baby, ShoppingBag, AlertCircle, Users, Gauge } from 'lucide-react';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import { HELP_TEXTS } from '../../lib/quoteData';

const BENEFITS = [
  {
    key: 'benefitExcessWaiver',
    levelKey: 'excessWaiverLevel',
    icon: AlertCircle,
    name: 'Excess Waiver',
    desc: 'Waive your policy excess in the event of a claim',
    levels: ['Up to 1 claim', 'Up to 2 claims'],
  },
  {
    key: 'benefitUnlimitedNamedDrivers',
    levelKey: 'unlimitedNamedDriversLevel',
    icon: Users,
    name: 'Unlimited Named Drivers',
    desc: 'Cover any number of named drivers on your policy',
    levels: ['No Young, Inexperienced or Elderly driver(s)', 'Any driver'],
  },
  {
    key: 'benefitLowMileage',
    icon: Gauge,
    name: 'Low Mileage',
    desc: 'Discounted premium for low annual mileage drivers',
  },
  {
    key: 'benefitWorkshop',
    levelKey: 'workshopLevel',
    icon: Wrench,
    name: 'Workshop Option',
    desc: 'Choose your preferred workshop for repairs',
    levels: ['Any Workshop', 'Any Dealer Workshop'],
  },
  {
    key: 'benefitRoadside',
    levelKey: 'roadsideLevel',
    icon: Phone,
    name: '24 Hours Roadside Assistance',
    desc: 'Round-the-clock help for breakdowns and emergencies',
    levels: ['SG Only up to $200', 'SG Only up to $500', 'SG & MY up to $200', 'SG & MY up to $500', 'SG & MY up to $1,000'],
  },
  {
    key: 'benefitMedical',
    levelKey: 'medicalLevel',
    icon: Heart,
    name: 'Medical Expenses',
    desc: 'Cover for medical costs arising from an accident',
    levels: ['$1,000', '$2,000', '$3,000', '$5,000'],
  },
  {
    key: 'benefitOverseas',
    levelKey: 'overseasLevel',
    icon: Globe,
    name: 'Overseas Emergency Allowance/Repatriation',
    desc: 'Emergency support and repatriation if stranded overseas',
    levels: [
      'Transport: $200/person, $1,000 for car; Med. Evac.: $10,000/person',
      'Transport: $200/person, $2,000 for car; Med. Evac.: $20,000/person',
      'Transport: $200/person, $3,500 for car; Med. Evac.: $25,000/person',
    ],
  },
  {
    key: 'benefitPA',
    levelKey: 'paCoverLevel',
    icon: Shield,
    name: 'Personal Accident',
    desc: 'Cover for you and passengers for injuries',
    levels: ['$20,000', '$50,000', '$100,000', '$200,000', '$500,000'],
    helpKey: 'pa',
  },
  {
    key: 'benefitLOU',
    levelKey: 'louLevel',
    icon: Car,
    name: 'Transport Allowance/Loss of Use',
    desc: 'Hire car while yours is being repaired',
    helpKey: 'lou',
    levels: [
      '$50/day, max 10 days',
      '$50/day, max 20 days',
      '$50/day, max 30 days',
      '$100/day, max 10 days',
      '$100/day, max 20 days',
      '$100/day, max 30 days',
    ],
  },
  {
    key: 'benefitWindscreen',
    levelKey: 'windscreenLevel',
    icon: Wind,
    name: 'Windscreen Cover Add-On',
    desc: 'Repair or replace windscreen with no excess',
    helpKey: 'windscreen',
    levels: ['Up to 1 claim', 'Up to 2 claims', 'Unlimited'],
  },
  {
    key: 'benefitModifications',
    levelKey: 'modificationsLevel',
    icon: Star,
    name: 'Car Modifications & Accessories',
    desc: 'Cover for approved modifications and accessories',
    levels: ['Up to $1,000', 'Up to $2,000', 'Up to $5,000', 'Up to $10,000'],
  },
  {
    key: 'benefitNCD',
    levelKey: 'ncdLevel',
    icon: ShieldCheck,
    name: 'NCD Protector',
    desc: 'Protect your NCD if you make a claim',
    helpKey: 'ncdProtection',
    levels: ['NCD Protector', 'NCD Protector Plus'],
  },
  {
    key: 'benefitSGOnly',
    icon: Umbrella,
    name: 'Singapore Only',
    desc: 'Coverage limited to Singapore roads only',
  },
  {
    key: 'benefitNewForOld',
    icon: ShoppingBag,
    name: 'New for Old Replacement',
    desc: 'Replace your car with a brand-new equivalent if written off',
  },
  {
    key: 'benefitPersonalEffects',
    levelKey: 'personalEffectsLevel',
    icon: Plane,
    name: 'Personal Effects/Valuable Cover',
    desc: 'Cover for personal belongings in the car',
    levels: ['Up to $5,000', 'Up to $10,000', 'Up to $25,000'],
  },
  {
    key: 'benefitBattery',
    levelKey: 'batteryLevel',
    icon: Battery,
    name: 'Battery Cover',
    desc: 'Cover for EV/hybrid battery replacement',
    levels: ['Up to $10,000', 'Up to $25,000', 'Unlimited'],
  },
  {
    key: 'benefitChargingDamage',
    levelKey: 'chargingDamageLevel',
    icon: Zap,
    name: 'Damage to Charging Station',
    desc: 'Cover for damage caused to charging stations',
    levels: ['Up to $5,000', 'Up to $10,000', 'Up to $25,000'],
  },
  {
    key: 'benefitPrivateCharging',
    levelKey: 'privateChargingLevel',
    icon: Zap,
    name: 'Private Charging Station Cover',
    desc: 'Cover for your home/private charging equipment',
    levels: ['Up to $5,000', 'Up to $10,000', 'Up to $25,000'],
  },
  {
    key: 'benefitCyber',
    levelKey: 'cyberLevel',
    icon: Wifi,
    name: 'Cyber Attack Cover',
    desc: 'Protection against cyber threats to your connected car',
    levels: ['Up to $10,000', 'Up to $25,000', 'Unlimited'],
  },
  {
    key: 'benefitChildSeat',
    icon: Baby,
    name: 'Child Car Seat Cover',
    desc: 'Replacement cover for child car seats after an accident',
  },
];

export default function StepBenefits({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(null);

  const handleToggle = (b, isOn) => {
    onChange(b.key, !isOn);
    // Set default level when turning on
    if (!isOn && b.levels?.length) {
      onChange(b.levelKey, b.levels[0]);
    }
    // Clear level when turning off
    if (isOn && b.levelKey) {
      onChange(b.levelKey, '');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Customise your cover
      </h1>

      <div className="space-y-3">
        {BENEFITS.map(b => {
          const Icon = b.icon;
          const isOn = !!formData[b.key];
          const selectedLevel = b.levelKey ? formData[b.levelKey] : null;

          return (
            <div key={b.key} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isOn ? 'bg-bdred/10' : 'bg-grey100'}`}>
                  <Icon className={`w-5 h-5 ${isOn ? 'text-bdred' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-montserrat font-bold text-sm text-carbon">{b.name}</span>
                      {b.helpKey && <HelpIcon onClick={() => setHelpOpen(b.helpKey)} />}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(b, isOn)}
                      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${isOn ? 'bg-bdred' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-montserrat mt-1">{b.desc}</p>
                  {isOn && selectedLevel && (
                    <p className="text-xs font-montserrat font-semibold text-bdred mt-1">{selectedLevel}</p>
                  )}
                </div>
              </div>

              {/* Level selector — shown when toggled on and has levels */}
              {b.levels && isOn && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-montserrat text-muted-foreground mb-2">Select cover level</p>
                  <div className="flex flex-wrap gap-2">
                    {b.levels.map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onChange(b.levelKey, level)}
                        className={`px-3 py-2 rounded-pill text-xs font-montserrat font-bold border-2 transition-all ${
                          selectedLevel === level
                            ? 'bg-bdred text-white border-bdred'
                            : 'bg-white text-carbon border-gray-200 hover:border-gray-300'
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
        })}
      </div>

      <StepFooter onBack={onBack} onNext={onNext} />

      <HelpDrawer open={!!helpOpen} onClose={() => setHelpOpen(null)} title={BENEFITS.find(b => b.helpKey === helpOpen)?.name || ''}>
        {helpOpen && HELP_TEXTS[helpOpen]}
      </HelpDrawer>
    </div>
  );
}