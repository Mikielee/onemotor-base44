import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, User, Users, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';

const LICENCE_OPTIONS = ['Less than 1 yr', '1–2 yrs', '3–5 yrs', '6–10 yrs', 'More than 10 yrs'];
const MAX_DRIVERS = 8;

function DriverForm({ driver, onSave, onCancel }) {
  const [form, setForm] = useState(driver || {
    nameDisplayedOnCard: '', nricFin: '', dobDay: '', dobMonth: '', dobYear: '',
    gender: '', licenceYears: '', claims: '', atFaultTimes: '', com: '',
  });
  const [dobRaw, setDobRaw] = useState(
    form.dobDay && form.dobMonth && form.dobYear
      ? `${form.dobDay}/${form.dobMonth}/${form.dobYear}` : ''
  );

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleDobChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let val = digits;
    if (digits.length > 4) val = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) val = digits.slice(0, 2) + '/' + digits.slice(2);
    setDobRaw(val);
    const parts = val.split('/');
    set('dobDay', parts[0] || '');
    set('dobMonth', parts[1] || '');
    set('dobYear', parts[2] || '');
  };

  const getAtFaultOptions = (claimsValue) => {
    if (!claimsValue || claimsValue === '0') return [];
    if (claimsValue === 'More than 5+') return ['0','1','2','3','4','5','More than 5+'];
    const max = parseInt(claimsValue);
    const opts = [];
    for (let i = 0; i <= max; i++) opts.push(String(i));
    return opts;
  };

  const canSave = form.nameDisplayedOnCard && form.nricFin && form.dobDay && form.dobMonth &&
    form.dobYear && form.gender && form.licenceYears && form.claims && form.com &&
    (form.claims === '0' || form.atFaultTimes);

  const inputBase = 'border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none';

  return (
    <div className="bg-grey100 rounded-lg p-4 space-y-3 ml-4 border-l-2 border-bdred/30">
      <div>
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Name Displayed on ID Card</p>
        <input type="text" value={form.nameDisplayedOnCard} onChange={(e) => set('nameDisplayedOnCard', e.target.value)} className={`w-full px-3 py-2.5 ${inputBase}`} />
      </div>
      <div>
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">NRIC/FIN</p>
        <input type="text" value={form.nricFin} onChange={(e) => set('nricFin', e.target.value)} className={`w-full px-3 py-2.5 ${inputBase}`} />
      </div>
      <div>
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Date of Birth</p>
        <input type="text" inputMode="numeric" placeholder="DD/MM/YYYY" maxLength={10} value={dobRaw} onChange={handleDobChange} className={`w-full px-3 py-2.5 ${inputBase}`} />
      </div>
      <div>
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Gender</p>
        <div className="flex gap-3">
          {['Male', 'Female'].map(g => (
            <button key={g} type="button" onClick={() => set('gender', g.toLowerCase())}
              className={`flex-1 py-3 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${form.gender === g.toLowerCase() ? 'bg-bdred text-white border-bdred' : 'bg-white text-carbon border-carbon/30'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Years Holding Licence</p>
        <select value={form.licenceYears} onChange={(e) => set('licenceYears', e.target.value)} className={`w-full appearance-none px-3 py-2.5 ${inputBase} cursor-pointer`}>
          <option value="" disabled>Select</option>
          {LICENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      <div>
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Certificate of Merit (COM)?</p>
        <YesNoButtons value={form.com} onChange={(v) => set('com', v)} />
      </div>
      <div>
        <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Accidents/claims in the past 3 years?</p>
        <div className="relative">
          <select value={form.claims} onChange={(e) => { set('claims', e.target.value); set('atFaultTimes', ''); }} className={`w-full appearance-none px-3 py-2.5 ${inputBase} cursor-pointer`}>
            <option value="" disabled>Select</option>
            {['0','1','2','3','4','5','More than 5+'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
      {form.claims && form.claims !== '0' && (
        <div className="relative">
          <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">How many were at-fault?</p>
          <select value={form.atFaultTimes} onChange={(e) => set('atFaultTimes', e.target.value)} className={`w-full appearance-none px-3 py-2.5 ${inputBase} cursor-pointer`}>
            <option value="" disabled>Select</option>
            {getAtFaultOptions(form.claims).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-pill font-montserrat font-medium text-sm text-carbon bg-white border-2 border-gray-200">Cancel</button>
        <button type="button" onClick={() => canSave && onSave(form)} disabled={!canSave}
          className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-sm transition-all ${canSave ? 'bg-bdred text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Save driver
        </button>
      </div>
    </div>
  );
}

const PLAN_OPTIONS = [
  { id: 'named', icon: UserCheck, label: 'Named Driver', desc: 'Add up to 8 specific named drivers to your policy' },
  { id: 'authorised', icon: Users, label: 'Authorised Driver Plan', desc: 'Cover for any licensed driver authorised by you' },
];

export default function StepAdditionalDrivers({ formData, onChange, onNext, onBack }) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const drivers = formData.namedDrivers || [];

  const handleSave = (driver) => {
    const updated = [...drivers];
    if (editIdx >= 0) updated[editIdx] = driver;
    else updated.push(driver);
    onChange('namedDrivers', updated);
    setShowForm(false);
    setEditIdx(-1);
  };

  const handleRemove = (idx) => onChange('namedDrivers', drivers.filter((_, i) => i !== idx));

  const handlePlanSelect = (planId) => {
    onChange('additionalDriverPlan', planId);
    onChange('unlimitedDriverCover', '');
    onChange('hasRiskyDrivers', '');
    onChange('namedDrivers', []);
    setShowForm(false);
  };

  const plan = formData.additionalDriverPlan;
  const unlimitedCover = formData.unlimitedDriverCover;

  const canProceed = (() => {
    if (!formData.hasAdditionalDrivers) return false;
    if (formData.hasAdditionalDrivers === 'no') return true;
    if (!plan) return false;
    if (!unlimitedCover) return false;
    if (unlimitedCover === 'yes') return !!formData.hasRiskyDrivers;
    // unlimitedCover === 'no' → named driver form, need at least 0 drivers is fine
    return true;
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
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">

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

            {/* Follow-up: Unlimited Driver Optional Cover */}
            <AnimatePresence>
              {plan && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="ml-4 pl-3 border-l-2 border-bdred/30 space-y-2">
                    <div className="bg-grey100 rounded-lg p-4">
                      <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                        Would you like to add Unlimited Driver Optional Cover?
                      </p>
                      <YesNoButtons
                        value={unlimitedCover}
                        onChange={(v) => { onChange('unlimitedDriverCover', v); onChange('hasRiskyDrivers', ''); onChange('namedDrivers', []); setShowForm(false); }}
                      />
                    </div>

                    {/* If YES: risky drivers follow-up */}
                    <AnimatePresence>
                      {unlimitedCover === 'yes' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="ml-4 pl-3 border-l-2 border-bdred/20">
                            <div className="bg-grey100 rounded-lg p-4">
                              <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                                Are there any young, inexperienced, or elderly drivers who will use this car?
                              </p>
                              <YesNoButtons
                                value={formData.hasRiskyDrivers}
                                onChange={(v) => onChange('hasRiskyDrivers', v)}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* If NO: named driver form */}
                    <AnimatePresence>
                      {unlimitedCover === 'no' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                          {drivers.map((d, i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-bdred/10 flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 text-bdred" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-montserrat font-bold text-sm text-carbon truncate">{d.nameDisplayedOnCard || `Driver ${i + 1}`}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground font-montserrat mt-0.5">DOB: {d.dobDay}/{d.dobMonth}/{d.dobYear} · {d.gender}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  <button type="button" onClick={() => { setEditIdx(i); setShowForm(true); }} className="p-1.5 rounded-full hover:bg-grey100">
                                    <Pencil className="w-3.5 h-3.5 text-cyan" />
                                  </button>
                                  <button type="button" onClick={() => handleRemove(i)} className="p-1.5 rounded-full hover:bg-grey100">
                                    <Trash2 className="w-3.5 h-3.5 text-bdred" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {showForm ? (
                            <DriverForm
                              driver={editIdx >= 0 ? drivers[editIdx] : null}
                              onSave={handleSave}
                              onCancel={() => { setShowForm(false); setEditIdx(-1); }}
                            />
                          ) : drivers.length < MAX_DRIVERS ? (
                            <button type="button" onClick={() => setShowForm(true)}
                              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-montserrat font-medium text-cyan flex items-center justify-center gap-2 hover:border-cyan/50">
                              <Plus className="w-4 h-4" /> Add driver
                            </button>
                          ) : (
                            <p className="text-xs text-center text-muted-foreground font-montserrat">Maximum of {MAX_DRIVERS} named drivers reached.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
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