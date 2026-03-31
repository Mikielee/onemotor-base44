import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import YesNoButtons from './YesNoButtons';
import ChoiceButton from './ChoiceButton';
import PillButton from './PillButton';
import { motion, AnimatePresence } from 'framer-motion';

function DriverForm({ driver, onSave, onCancel }) {
  const [form, setForm] = useState(driver || { name: '', dobDay: '', dobMonth: '', dobYear: '', gender: '', licenceYears: '', claims: 'no' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="bg-grey100 rounded-lg p-4 space-y-3">
      <input type="text" placeholder="Name" value={form.name} onChange={(e) => set('name', e.target.value)}
        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat" />
      <div className="flex gap-2">
        <input type="text" placeholder="DD" maxLength={2} value={form.dobDay} onChange={(e) => set('dobDay', e.target.value.replace(/\D/g, ''))}
          className="w-14 text-center px-2 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat" />
        <input type="text" placeholder="MM" maxLength={2} value={form.dobMonth} onChange={(e) => set('dobMonth', e.target.value.replace(/\D/g, ''))}
          className="w-14 text-center px-2 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat" />
        <input type="text" placeholder="YYYY" maxLength={4} value={form.dobYear} onChange={(e) => set('dobYear', e.target.value.replace(/\D/g, ''))}
          className="flex-1 text-center px-2 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat" />
      </div>
      <div className="flex gap-2">
        {['Male', 'Female'].map(g => (
          <button key={g} type="button" onClick={() => set('gender', g.toLowerCase())}
            className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-xs border-2 transition-all ${form.gender === g.toLowerCase() ? 'bg-bdred text-white border-bdred' : 'bg-white text-carbon border-gray-200'}`}>
            {g}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <PillButton variant="outline" onClick={onCancel} className="text-sm py-2.5">Cancel</PillButton>
        <PillButton onClick={() => onSave(form)} disabled={!form.name || !form.dobDay} className="text-sm py-2.5">Save</PillButton>
      </div>
    </div>
  );
}

export default function StepAdditionalDrivers({ formData, onChange, onNext }) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const drivers = formData.namedDrivers || [];

  const handleSave = (driver) => {
    const updated = [...drivers];
    if (editIdx >= 0) { updated[editIdx] = driver; } else { updated.push(driver); }
    onChange('namedDrivers', updated);
    setShowForm(false);
    setEditIdx(-1);
  };

  const handleRemove = (idx) => {
    onChange('namedDrivers', drivers.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Does anyone else drive this car?
      </h1>

      <YesNoButtons
        value={formData.hasAdditionalDrivers}
        onChange={(v) => { onChange('hasAdditionalDrivers', v); if (v === 'no') { onChange('additionalDriverPlan', ''); onChange('namedDrivers', []); } }}
      />

      <AnimatePresence>
        {formData.hasAdditionalDrivers === 'yes' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
            <ChoiceButton
              selected={formData.additionalDriverPlan === 'any'}
              onClick={() => { onChange('additionalDriverPlan', 'any'); onChange('namedDrivers', []); }}
              subtitle="Covers any licensed driver — +$200/year"
            >
              Any Driver plan
            </ChoiceButton>

            <ChoiceButton
              selected={formData.additionalDriverPlan === 'named'}
              onClick={() => onChange('additionalDriverPlan', 'named')}
              subtitle="Add specific drivers to your policy"
            >
              Add named drivers
            </ChoiceButton>

            {formData.additionalDriverPlan === 'named' && (
              <div className="space-y-3 mt-2">
                {drivers.map((d, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-montserrat font-bold text-sm text-carbon">{d.name}</p>
                      <p className="font-montserrat text-xs text-muted-foreground">{d.gender}, DOB: {d.dobDay}/{d.dobMonth}/{d.dobYear}</p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => { setEditIdx(i); setShowForm(true); }} className="p-1.5 rounded-full hover:bg-grey100"><Pencil className="w-3.5 h-3.5 text-cyan" /></button>
                      <button type="button" onClick={() => handleRemove(i)} className="p-1.5 rounded-full hover:bg-grey100"><Trash2 className="w-3.5 h-3.5 text-bdred" /></button>
                    </div>
                  </div>
                ))}

                {showForm ? (
                  <DriverForm driver={editIdx >= 0 ? drivers[editIdx] : null} onSave={handleSave} onCancel={() => { setShowForm(false); setEditIdx(-1); }} />
                ) : drivers.length < 3 && (
                  <button type="button" onClick={() => setShowForm(true)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-montserrat font-medium text-cyan flex items-center justify-center gap-2 hover:border-cyan/50">
                    <Plus className="w-4 h-4" /> Add driver
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4">
        <PillButton onClick={onNext} disabled={!formData.hasAdditionalDrivers}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}