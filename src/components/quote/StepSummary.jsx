import { useState } from 'react';
import { Pencil } from 'lucide-react';
import StepFooter from './StepFooter';
import PillButton from './PillButton';
import { format } from 'date-fns';

function Section({ title, editStep, onEdit, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-montserrat font-bold text-sm text-carbon">{title}</h3>
        {editStep && (
          <button type="button" onClick={() => onEdit(editStep)} className="flex items-center gap-1 text-xs text-cyan font-montserrat font-medium hover:underline">
            <Pencil className="w-3 h-3" /> Edit
          </button>
        )}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-xs font-montserrat">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-carbon font-medium text-right">{value}</span>
    </div>
  );
}

export default function StepSummary({ formData, price, onNext, onBack, goToStep }) {
  const [agreed, setAgreed] = useState(false);
  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const startDate = formData.coverStartDate ? format(new Date(formData.coverStartDate), 'dd MMM yyyy') : '—';

  const addOns = [];
  if (formData.benefitPA) addOns.push({ label: 'Personal Accident & Medical', value: formData.paCoverLevel === 200000 ? 158 : formData.paCoverLevel === 100000 ? 110 : 78 });
  if (formData.benefitNCD) addOns.push({ label: 'NCD Protection', value: 95 });
  if (formData.benefitLOU) addOns.push({ label: 'Loss of Use', value: 120 });
  if (formData.benefitWindscreen) addOns.push({ label: 'Windscreen', value: 60 });

  const addOnsTotal = addOns.reduce((a, b) => a + b.value, 0);
  const basePremium = price - addOnsTotal;

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Review your policy
      </h1>

      <Section title="Cover Details" editStep={1} onEdit={goToStep}>
        <Row label="Cover type" value={coverLabels[formData.coverType] || '—'} />
        <Row label="Start date" value={startDate} />
      </Section>

      <Section title="Vehicle" editStep={3} onEdit={goToStep}>
        <Row label="Make / Model" value={`${formData.carMake || ''} ${formData.carModel || ''}`} />
        <Row label="Year" value={formData.yearOfReg || '—'} />
        <Row label="Registration" value={formData.vehicleReg || '—'} />
      </Section>

      <Section title="Main Driver" editStep={7} onEdit={goToStep}>
        <Row label="Name" value={formData.fullName || formData.preferredName || '—'} />
        <Row label="DOB" value={`${formData.dobDay || '—'}/${formData.dobMonth || '—'}/${formData.dobYear || '—'}`} />
        <Row label="NCD" value={`${formData.ncdEntitlement || 0}%`} />
        <Row label="Licence" value={formData.licenceYears || '—'} />
      </Section>

      {formData.hasAdditionalDrivers === 'yes' && (
        <Section title="Named Drivers" editStep={10} onEdit={goToStep}>
          {formData.additionalDriverPlan === 'any' ? (
            <Row label="Plan" value="Any Driver (+$200/yr)" />
          ) : (
            (formData.namedDrivers || []).map((d, i) => (
              <Row key={i} label={d.preferredName || `Driver ${i + 1}`} value="+$80/yr" />
            ))
          )}
        </Section>
      )}

      {addOns.length > 0 && (
        <Section title="Optional Benefits" editStep={12} onEdit={goToStep}>
          {addOns.map((a, i) => <Row key={i} label={a.label} value={`$${a.value}/yr`} />)}
        </Section>
      )}

      <Section title="Excess" editStep={11} onEdit={goToStep}>
        <Row label="Excess amount" value={`$${(formData.excess || 1000).toLocaleString()}`} />
      </Section>

      {/* Price breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-montserrat font-bold text-sm text-carbon mb-3">Price Breakdown</h3>
        <div className="space-y-2">
          <Row label="Base premium" value={`$${basePremium.toLocaleString()}`} />
          {addOns.map((a, i) => <Row key={i} label={a.label} value={`+$${a.value}`} />)}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex justify-between font-montserrat">
              <span className="font-bold text-sm text-carbon">Annual Total</span>
              <span className="font-bold text-lg text-bdred">SGD ${price.toLocaleString()}</span>
            </div>
            <p className="text-right text-[11px] text-muted-foreground font-montserrat mt-0.5">
              Approx. SGD ${Math.round(price / 12)} / month
            </p>
          </div>
        </div>
      </div>

      {/* T&Cs */}
      <div className="bg-grey100 rounded-lg p-4">
        <div className="max-h-32 overflow-y-auto text-[10px] font-montserrat text-muted-foreground leading-relaxed mb-3">
          <p className="font-bold text-carbon text-xs mb-2">Terms and Conditions</p>
          <p>By proceeding, you acknowledge and agree that: (1) All information provided is true, complete and accurate. (2) You have read and understood the policy wording, product disclosure sheet and terms and conditions. (3) Budget Direct Insurance Pte Ltd reserves the right to void the policy or adjust the premium if any information is found to be inaccurate. (4) Cover is subject to the insurer's standard underwriting criteria. (5) The policy is governed by the laws of Singapore.</p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              agreed ? 'bg-bdred border-bdred' : 'border-gray-300'
            }`}
          >
            {agreed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className="text-xs font-montserrat text-carbon leading-relaxed">
            I confirm I have read and agree to the Terms and Conditions and that all information provided is accurate.
          </span>
        </label>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!agreed} label="Proceed to Payment" />
    </div>
  );
}