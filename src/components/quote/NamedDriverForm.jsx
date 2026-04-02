import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoButtons from './YesNoButtons';

const LICENCE_OPTIONS = ['Less than 1 yr', '1–2 yrs', '3–5 yrs', '6–10 yrs', 'More than 10 yrs'];
const MAX_DRIVERS = 8;

function DriverEditForm({ driver, onSave, onCancel }) {
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
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden bg-white border border-gray-200 rounded-lg p-4 space-y-4"
    >
      {/* 2-column grid on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-xs border-2 transition-all ${form.gender === g.toLowerCase() ? 'bg-bdred text-white border-bdred' : 'bg-white text-carbon border-carbon/30'}`}>
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
        <div className="relative">
          <p className="text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Accidents/claims in the past 3 years?</p>
          <select value={form.claims} onChange={(e) => { set('claims', e.target.value); set('atFaultTimes', ''); }} className={`w-full appearance-none px-3 py-2.5 ${inputBase} cursor-pointer`}>
            <option value="" disabled>Select</option>
            {['0','1','2','3','4','5','More than 5+'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-pill font-montserrat font-medium text-sm text-carbon bg-white border-2 border-gray-200 hover:border-gray-300 transition-all">
          Cancel
        </button>
        <button type="button" onClick={() => canSave && onSave(form)} disabled={!canSave}
          className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-sm transition-all ${canSave ? 'bg-bdred text-white hover:bg-bdred/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Save
        </button>
      </div>
    </motion.div>
  );
}

export default function NamedDriverForm({ drivers, onChange }) {
  const [editIdx, setEditIdx] = useState(-1);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (driver) => {
    const updated = [...drivers];
    if (editIdx >= 0) updated[editIdx] = driver;
    else updated.push(driver);
    onChange(updated);
    setShowForm(false);
    setEditIdx(-1);
  };

  const handleRemove = (idx) => onChange(drivers.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="flex items-center justify-between">
        <p className="font-montserrat font-bold text-sm text-carbon">
          Named Drivers ({drivers.length}/{MAX_DRIVERS})
        </p>
      </div>

      {/* Driver cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {drivers.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-montserrat font-bold text-sm text-carbon">Driver {i + 1}</p>
                  <p className="text-xs text-muted-foreground font-montserrat mt-1">{d.nameDisplayedOnCard}</p>
                  <p className="text-xs text-muted-foreground font-montserrat">DOB: {d.dobDay}/{d.dobMonth}/{d.dobYear} · {d.gender}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="p-1.5 rounded-full hover:bg-red-50 text-bdred flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Edit form or add button */}
        <AnimatePresence>
          {showForm ? (
            <DriverEditForm
              key="edit-form"
              driver={editIdx >= 0 ? drivers[editIdx] : null}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditIdx(-1); }}
            />
          ) : drivers.length < MAX_DRIVERS ? (
            <motion.button
              key="add-btn"
              type="button"
              onClick={() => setShowForm(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-montserrat font-medium text-cyan flex items-center justify-center gap-2 hover:border-cyan/50 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Another Driver
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}