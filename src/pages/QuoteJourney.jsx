import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePrice } from '../lib/quoteData';
import QuoteLayout from '../components/quote/QuoteLayout';
import BlockerScreen from '../components/quote/BlockerScreen';
import StepCoverType from '../components/quote/StepCoverType';
import StepStartDate from '../components/quote/StepStartDate';
import StepMakeModel from '../components/quote/StepMakeModel';
import StepCarUsage from '../components/quote/StepCarUsage';
import StepDistance from '../components/quote/StepDistance';
import StepMainDriver from '../components/quote/StepMainDriver';
import StepDrivingHistory from '../components/quote/StepDrivingHistory';
import StepContact from '../components/quote/StepContact';
import StepPrePrice from '../components/quote/StepPrePrice';
import StepAdditionalDrivers from '../components/quote/StepAdditionalDrivers';
import StepDriveLess from '../components/quote/StepDriveLess';
import StepExcess from '../components/quote/StepExcess';
import StepBenefits from '../components/quote/StepBenefits';
import StepAdditionalDetails from '../components/quote/StepAdditionalDetails';
import StepVehicleDetails from '../components/quote/StepVehicleDetails';
import StepDutyOfDisclosure from '../components/quote/StepDutyOfDisclosure';
import StepSummary from '../components/quote/StepSummary';
import StepPayment from '../components/quote/StepPayment';
import StepConfirmation from '../components/quote/StepConfirmation';
import StoryTag from '../components/quote/StoryTag';

// Steps:
// 1  CoverType
// 2  StartDate
// 3  MakeModel
// 4  CarUsage
// 5  Distance
// 6  MainDriver
// 7  DrivingHistory
// 8  Contact
// 9  PrePrice
// 10 AdditionalDrivers  ← price bar starts here
// 11 DriveLess (conditional)
// 12 Excess
// 13 Benefits
// 14 AdditionalDetails
// 15 VehicleDetails
// 16 DutyOfDisclosure
// 17 Summary
// 18 Payment
// 19 Confirmation

const TOTAL_STEPS = 19;

export default function QuoteJourney() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({ excess: 1000 });
  const [blocked, setBlocked] = useState(false);
  const [paymentType, setPaymentType] = useState('annual');

  const price = calculatePrice(formData);

  const onChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const getEffectiveStep = (rawStep) => {
    if (rawStep === 11 && formData.annualDistance !== 'lt8000') return null;
    return rawStep;
  };

  const goNext = () => {
    if (step === 7 && formData.atFaultTimes && formData.atFaultTimes !== '0' && parseInt(formData.atFaultTimes) > 0) {
      if (formData.atFaultTimes === 'More than 5' || parseInt(formData.atFaultTimes) > 2) {
        setBlocked(true);
        return;
      }
    }
    let next = step + 1;
    while (next <= TOTAL_STEPS) {
      if (getEffectiveStep(next) !== null) break;
      next++;
    }
    setDirection(1);
    setStep(next);
  };

  const goBack = () => {
    let prev = step - 1;
    while (prev >= 1) {
      if (getEffectiveStep(prev) !== null) break;
      prev--;
    }
    setDirection(-1);
    setStep(Math.max(1, prev));
  };

  const goToStep = (targetStep) => {
    setDirection(targetStep < step ? -1 : 1);
    setStep(targetStep);
  };

  const handlePaymentNext = (type) => {
    setPaymentType(type);
    goNext();
  };

  if (blocked) return <BlockerScreen />;

  const devButton = (
    <button
      type="button"
      onClick={() => {
        setFormData(prev => ({
          ...prev,
          coverType: 'COMP',
          make: 'Toyota',
          model: 'Vios',
          registrationYear: '2020',
          preferredName: 'Sarah',
        }));
        setDirection(1);
        setStep(9);
      }}
      style={{ background: '#555', color: '#fff', fontSize: '10px', padding: '3px 7px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontFamily: 'monospace', opacity: 0.6 }}
    >
      DEV →9
    </button>
  );

  const AdminPanel = () => (
    <div className="fixed top-16 right-2 z-[999] bg-carbon/90 text-white rounded-lg px-2 py-1.5 flex items-center gap-1.5 shadow-xl">
      <button
        onClick={() => { setDirection(-1); setStep(s => Math.max(1, s - 1)); }}
        className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-colors"
      >←</button>
      <div className="w-6 h-6 bg-bdred rounded flex items-center justify-center text-xs font-montserrat font-bold">{step}</div>
      <button
        onClick={() => { setDirection(1); setStep(s => Math.min(TOTAL_STEPS, s + 1)); }}
        className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-colors"
      >→</button>
    </div>
  );

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const sharedProps = { formData, onChange, onNext: goNext, onBack: step > 1 ? goBack : undefined, price, goToStep };

  const renderStep = () => {
    switch (step) {
      case 1:  return <StepCoverType {...sharedProps} />;
      case 2:  return <StepStartDate {...sharedProps} />;
      case 3:  return <StepMakeModel {...sharedProps} />;
      case 4:  return <StepCarUsage {...sharedProps} />;
      case 5:  return <StepDistance {...sharedProps} />;
      case 6:  return <StepMainDriver {...sharedProps} />;
      case 7:  return <StepDrivingHistory {...sharedProps} onBlock={() => setBlocked(true)} />;
      case 8:  return <StepContact {...sharedProps} />;
      case 9:  return <StepPrePrice {...sharedProps} />;
      case 10: return <StepAdditionalDrivers {...sharedProps} />;
      case 11: return <StepDriveLess {...sharedProps} />;
      case 12: return <StepExcess {...sharedProps} />;
      case 13: return <StepBenefits {...sharedProps} />;
      case 14: return <StepAdditionalDetails {...sharedProps} />;
      case 15: return <StepVehicleDetails {...sharedProps} />;
      case 16: return <StepDutyOfDisclosure onNext={goNext} onBack={goBack} goToStep={goToStep} />;
      case 17: return <StepSummary {...sharedProps} />;
      case 18: return <StepPayment {...sharedProps} onNext={handlePaymentNext} />;
      case 19: return <StepConfirmation {...sharedProps} paymentType={paymentType} />;
      default: return null;
    }
  };

  return (
    <>
      <AdminPanel />
      <StoryTag step={step} />
      <QuoteLayout
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={goBack}
        showPriceBar={step >= 10 && step < 19}
        price={price}
        formData={formData}
        headerExtra={devButton}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </QuoteLayout>
    </>
  );
}