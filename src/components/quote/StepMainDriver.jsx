import StepFooter from './StepFooter';

export default function StepMainDriver({ formData, onChange, onNext, onBack }) {
  const canProceed = formData.dobDay && formData.dobMonth && formData.dobYear && formData.gender;

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        About the main driver
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Date of birth
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="DD"
              maxLength={2}
              value={formData.dobDay || ''}
              onChange={(e) => onChange('dobDay', e.target.value.replace(/\D/g, ''))}
              className="w-16 text-center px-2 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            />
            <input
              type="text"
              placeholder="MM"
              maxLength={2}
              value={formData.dobMonth || ''}
              onChange={(e) => onChange('dobMonth', e.target.value.replace(/\D/g, ''))}
              className="w-16 text-center px-2 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            />
            <input
              type="text"
              placeholder="YYYY"
              maxLength={4}
              value={formData.dobYear || ''}
              onChange={(e) => onChange('dobYear', e.target.value.replace(/\D/g, ''))}
              className="flex-1 text-center px-2 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Gender
          </label>
          <div className="flex gap-3">
            {['Male', 'Female'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => onChange('gender', g.toLowerCase())}
                className={`flex-1 py-3 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${
                  formData.gender === g.toLowerCase()
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-carbon/30 hover:border-carbon/60'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}