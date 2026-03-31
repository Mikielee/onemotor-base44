import { useState } from 'react';
import PillButton from './PillButton';

export default function StepContact({ formData, onChange, onNext }) {
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
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How can we reach you?
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Preferred name</label>
          <input
            type="text"
            value={formData.preferredName || ''}
            onChange={(e) => onChange('preferredName', e.target.value)}
            className={inputClass('name')}
            placeholder="e.g. John"
          />
          {errors.name && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Email address</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className={inputClass('email')}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Mobile number</label>
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
          {errors.mobile && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Postcode</label>
          <input
            type="text"
            maxLength={6}
            value={formData.postcode || ''}
            onChange={(e) => onChange('postcode', e.target.value.replace(/\D/g, ''))}
            className={inputClass('postcode')}
            placeholder="123456"
          />
          {errors.postcode && <p className="text-[11px] text-bdred mt-1 font-montserrat">{errors.postcode}</p>}
        </div>

        {/* Marketing preferences */}
        <div>
          <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">Marketing preferences</p>
          <div className="space-y-2">
            {['Email', 'SMS', 'Phone'].map(pref => (
              <label key={pref} className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm font-montserrat text-carbon">{pref}</span>
                <button
                  type="button"
                  onClick={() => onChange(`marketing${pref}`, !formData[`marketing${pref}`])}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    formData[`marketing${pref}`] ? 'bg-bdred' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData[`marketing${pref}`] ? 'translate-x-[18px]' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>
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
              I acknowledge Budget Direct's <span className="text-cyan">Privacy Policy</span> and consent to the collection and use of my personal data.
            </span>
          </label>
          {errors.privacy && <p className="text-[11px] text-bdred mt-1 font-montserrat ml-8">Please accept to continue</p>}
        </div>
      </div>

      <div className="pt-2">
        <PillButton onClick={handleNext}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}