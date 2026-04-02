import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePrice } from '../lib/quoteData';
import QuoteLayout from '../components/quote/QuoteLayout.jsx';
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

import StepExcess from '../components/quote/StepExcess';
import StepBenefits from '../components/quote/StepBenefits';
import StepAdditionalDetails from '../components/quote/StepAdditionalDetails';
import StepVehicleDetails from '../components/quote/StepVehicleDetails';
import StepDutyOfDisclosure from '../components/quote/StepDutyOfDisclosure';
import StepSummary from '../components/quote/StepSummary';
import StepPayment from '../components/quote/StepPayment';
import StepConfirmation from '../components/quote/StepConfirmation';
import StoryTag from '../components/quote/StoryTag';
import PricePinned from '../components/quote/PricePinned';

const TOTAL_STEPS = 18;

export default function QuoteJourney() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  const [step, setStepState] = useState(isNaN(initialStep) || initialStep < 1 || initialStep > TOTAL_STEPS ? 1 : initialStep);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({ excess: 1000 });
  const [blocked, setBlocked] = useState(false);
  const [paymentType, setPaymentType] = useState('annual');
  const [period, setPeriod] = useState('monthly');

  const setStep = useCallback((valOrFn) => {
    setStepState(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      setSearchParams({ step: String(next) }, { replace: true });
      return next;
    });
  }, [setSearchParams]);

  const price = calculatePrice(formData);

  const onChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const getEffectiveStep = (rawStep) => rawStep;

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
      case 11: return <StepExcess {...sharedProps} />;
      case 12: return <StepBenefits {...sharedProps} />;
      case 13: return <StepAdditionalDetails {...sharedProps} />;
      case 14: return <StepVehicleDetails {...sharedProps} />;
      case 15: return <StepDutyOfDisclosure onNext={goNext} onBack={goBack} goToStep={goToStep} />;
      case 16: return <StepSummary {...sharedProps} />;
      case 17: return <StepPayment {...sharedProps} onNext={handlePaymentNext} />;
      case 18: return <StepConfirmation {...sharedProps} paymentType={paymentType} />;
      default: return null;
    }
  };

  const showPriceWidget = step >= 9 && step <= 16;

  return (
    <>
      <AdminPanel />
      {showPriceWidget && <PricePinned formData={formData} price={price} period={period} setPeriod={setPeriod} onNext={goNext} onBack={goBack} />}
      <StoryTag step={step} />
      <QuoteLayout step={step} totalSteps={TOTAL_STEPS} showPriceWidget={showPriceWidget}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </QuoteLayout>
    </>
  );
}