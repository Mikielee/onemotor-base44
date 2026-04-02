import { useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import StepFooter from './StepFooter';
import ValidatedInput from './ValidatedInput';

const MARKETING_PREFS = [
  { key: 'Email', icon: Mail },
  { key: 'SMS', icon: MessageCircle },
  { key: 'Phone', icon: Phone },
];

export default function StepContact({ formData, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.preferredName?.trim()) errs.name = 'Required';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email';
    if (!formData.mobile?.match(/^\d{8}$/)) errs.mobile = 'Enter 8-digit number';
    if (!formData.postcode?.match(/^\d{6}$/)) errs.postcode = 'Enter 6-digit postcode';
    if (!formData.privacyAcknowledged) errs.privacy = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const inputClass = (field) =>
    `w-full px-3 py-3 border-2 rounded-lg text-sm font-montserrat text-carbon focus:outline-none transition-colors ${
      errors[field] ? 'border-bdred' : 'border-gray-200 focus:border-bdred'
    }`;

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How can we reach you?
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Preferred name</label>
          <ValidatedInput value={formData.preferredName}>
            <input
              type="text"
              value={formData.preferredName || ''}
              onChange={(e) => onChange('preferredName', e.target.value)}
              className={inputClass('name')}
              placeholder="John Doe"
            />
          </ValidatedInput>
          {errors.name && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Email address</label>
          <ValidatedInput value={formData.email}>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className={inputClass('email')}
              placeholder="john@example.com"
            />
          </ValidatedInput>
          {errors.email && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Mobile number</label>
          <ValidatedInput value={formData.mobile}>
            <div className="flex gap-2">
              <div className="px-3 py-3 bg-grey100 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-muted-foreground">
                +65
              </div>
              <input
                type="tel"
                maxLength={8}
                value={formData.mobile || ''}
                onChange={(e) => onChange('mobile', e.target.value.replace(/\D/g, ''))}
                className={`flex-1 ${inputClass('mobile')}`}
                placeholder="9123 4567"
              />
            </div>
          </ValidatedInput>
          {errors.mobile && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Postcode</label>
          <ValidatedInput value={formData.postcode}>
            <input
              type="text"
              maxLength={6}
              value={formData.postcode || ''}
              onChange={(e) => onChange('postcode', e.target.value.replace(/\D/g, ''))}
              className={inputClass('postcode')}
              placeholder="123456"
            />
          </ValidatedInput>
          {errors.postcode && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.postcode}</p>}
        </div>

        {/* Marketing preferences */}
        <div>
          <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">Marketing preferences</p>
          <div className="flex gap-2">
            {MARKETING_PREFS.map(({ key: pref, icon: Icon }) => (
              <button
                key={pref}
                type="button"
                onClick={() => onChange(`marketingPref_${pref}`, !formData[`marketingPref_${pref}`])}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 text-xs font-montserrat font-medium transition-all ${
                  formData[`marketingPref_${pref}`] ? 'border-bdred bg-bdred/5 text-bdred' : 'border-gray-200 text-carbon'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="border-t border-gray-100 pt-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <button
              type="button"
              onClick={() => onChange('privacyAcknowledged', !formData.privacyAcknowledged)}
              className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                formData.privacyAcknowledged ? 'bg-bdred border-bdred' : errors.privacy ? 'border-bdred' : 'border-gray-300'
              }`}
            >
              {formData.privacyAcknowledged && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-xs font-montserrat text-muted-foreground leading-relaxed">
              I agree to your collection, use and disclosure of my personal data for the purpose of processing my request for a quote in accordance with your <span className="text-cyan">Privacy Policy</span>.
            </span>
          </label>
          {errors.privacy && <p className="text-[11px] text-bdred mt-1 font-montserrat ml-8">Please accept to continue</p>}
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={handleNext} />
    </div>
  );
}