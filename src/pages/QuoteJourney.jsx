import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePrice } from '../lib/quoteData';
import QuoteLayout from '../components/quote/QuoteLayout';
import BlockerScreen from '../components/quote/BlockerScreen';
import StepCoverType from '../components/quote/StepCoverType';
import StepStartDate from '../components/quote/StepStartDate';
import StepMakeModel from '../components/quote/StepMakeModel';
import StepYearReg from '../components/quote/StepYearReg';
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
import StepSummary from '../components/quote/StepSummary';
import StepPayment from '../components/quote/StepPayment';
import StepConfirmation from '../components/quote/StepConfirmation';

const TOTAL_STEPS = 18;

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
    // Step 12 (Drive Less) is conditional — skip if distance >= 8000km
    if (rawStep === 12 && formData.annualDistance !== 'lt8000') {
      return null; // skip
    }
    return rawStep;
  };

  const goNext = () => {
    // Check blocker after step 8
    if (step === 8 && formData.atFault === 'yes') {
      setBlocked(true);
      return;
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

  const showPriceBar = step > 10 && step < 18;

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const renderStep = () => {
    const props = { formData, onChange, onNext: goNext, price };
    switch (step) {
      case 1: return <StepCoverType {...props} />;
      case 2: return <StepStartDate {...props} />;
      case 3: return <StepMakeModel {...props} />;
      case 4: return <StepYearReg {...props} />;
      case 5: return <StepCarUsage {...props} />;
      case 6: return <StepDistance {...props} />;
      case 7: return <StepMainDriver {...props} />;
      case 8: return <StepDrivingHistory {...props} onBlock={() => setBlocked(true)} />;
      case 9: return <StepContact {...props} />;
      case 10: return <StepPrePrice {...props} />;
      case 11: return <StepAdditionalDrivers {...props} />;
      case 12: return <StepDriveLess {...props} />;
      case 13: return <StepExcess {...props} />;
      case 14: return <StepBenefits {...props} />;
      case 15: return <StepAdditionalDetails {...props} />;
      case 16: return <StepSummary {...props} goToStep={goToStep} />;
      case 17: return <StepPayment {...props} onNext={handlePaymentNext} />;
      case 18: return <StepConfirmation {...props} paymentType={paymentType} />;
      default: return null;
    }
  };

  return (
    <QuoteLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      showPriceBar={showPriceBar}
      price={price}
      formData={formData}
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
  );
}