import { useState } from 'react';
import { ChevronDown, Users, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import NamedDriverForm from './NamedDriverForm';

const MAX_DRIVERS = 8;

const PLAN_OPTIONS = [
  { id: 'named', icon: UserCheck, label: 'Named Driver', desc: 'Add up to 8 specific named drivers to your policy' },
  { id: 'authorised', icon: Users, label: 'Authorised Driver Plan', desc: 'Cover for any licensed driver authorised by you' },
];

export default function StepAdditionalDrivers({ formData, onChange, onNext, onBack }) {
  const handlePlanSelect = (planId) => {
    onChange('additionalDriverPlan', planId);
    onChange('unlimitedDriverCover', '');
    onChange('hasRiskyDrivers', '');
    onChange('namedDrivers', []);
  };

  const plan = formData.additionalDriverPlan;
  const unlimitedCover = formData.unlimitedDriverCover;

  const canProceed = (() => {
    if (!formData.hasAdditionalDrivers) return false;
    if (formData.hasAdditionalDrivers === 'no') return true;
    if (!plan) return false;
    if (plan === 'named') return true;
    if (plan === 'authorised') {
      if (!unlimitedCover) return false;
      if (unlimitedCover === 'yes') return !!formData.hasRiskyDrivers;
      return true;
    }
    return false;
  })();

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Does anyone else drive this car?
      </h1>

      <div className="flex gap-3">
        {[['yes', 'Yes'], ['no', 'No, just me']].map(([v, l]) => (
          <button key={v} type="button"
            onClick={() => {
              onChange('hasAdditionalDrivers', v);
              if (v === 'no') { onChange('additionalDriverPlan', ''); onChange('namedDrivers', []); onChange('unlimitedDriverCover', ''); onChange('hasRiskyDrivers', ''); }
            }}
            className={`flex-1 py-4 rounded-lg border-2 font-montserrat font-bold text-sm transition-all ${
              formData.hasAdditionalDrivers === v ? 'bg-bdred border-bdred text-white' : 'bg-white border-gray-200 text-carbon hover:border-carbon/40'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {formData.hasAdditionalDrivers === 'yes' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-4">

            {/* Plan selection */}
            <div className="space-y-2">
              {PLAN_OPTIONS.map(({ id, icon: Icon, label, desc }) => (
                <button key={id} type="button" onClick={() => handlePlanSelect(id)}
                  className={`w-full text-left p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                    plan === id ? 'bg-red-50 border-bdred' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${plan === id ? 'bg-bdred' : 'bg-grey100'}`}>
                    <Icon className={`w-5 h-5 ${plan === id ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className={`font-montserrat font-bold text-sm ${plan === id ? 'text-bdred' : 'text-carbon'}`}>{label}</p>
                    <p className="font-montserrat text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Named Driver: go straight to driver form */}
            <AnimatePresence>
              {plan === 'named' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <NamedDriverForm
                    drivers={formData.namedDrivers || []}
                    onChange={(updated) => onChange('namedDrivers', updated)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Authorised Driver Plan: show unlimited cover question */}
            <AnimatePresence>
              {plan === 'authorised' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                    <div>
                      <p className="font-montserrat font-bold text-sm text-carbon">
                        Would you like to add Unlimited Driver Optional Cover for +S$89?
                      </p>
                      <p className="font-montserrat text-xs text-muted-foreground mt-1">
                        With this option, all authorised drivers in your household are automatically covered — no need to manually list each person one by one.
                      </p>
                    </div>
                    <YesNoButtons
                      value={unlimitedCover}
                      onChange={(v) => { onChange('unlimitedDriverCover', v); onChange('hasRiskyDrivers', ''); onChange('namedDrivers', []); }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* If YES unlimited: risky drivers follow-up */}
            <AnimatePresence>
              {plan === 'authorised' && unlimitedCover === 'yes' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                    <p className="font-montserrat font-bold text-sm text-carbon">
                      Are there any young, inexperienced, or elderly drivers who will use this car?
                    </p>
                    <YesNoButtons
                      value={formData.hasRiskyDrivers}
                      onChange={(v) => onChange('hasRiskyDrivers', v)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* If NO unlimited: household member form */}
            <AnimatePresence>
              {plan === 'authorised' && unlimitedCover === 'no' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                    <p className="font-montserrat font-bold text-sm text-carbon">Please list all your household members information below.</p>
                    <NamedDriverForm
                      drivers={formData.namedDrivers || []}
                      onChange={(updated) => onChange('namedDrivers', updated)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}