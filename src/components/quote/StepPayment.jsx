import { useState } from 'react';
import { CreditCard, Lock, QrCode, Shield, Car } from 'lucide-react';
import FeefoTrustBadge from './FeefoTrustBadge';
import StepFooter from './StepFooter';
import PillButton from './PillButton';

export default function StepPayment({ formData, price, onNext, onBack, goToStep }) {
  const [paymentType, setPaymentType] = useState(formData.paymentType || 'annual');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const coverType = formData.coverType || 'COMP';
  const vehicleStr = [formData.carMake, formData.carModel, formData.yearOfReg].filter(Boolean).join(' · ');

  const monthlyPrice = Math.round((price * 1.10) / 12);
  const displayPrice = paymentType === 'monthly' ? monthlyPrice : price;

  const handlePay = () => {
    setLoading(true);
    if (method === 'card') {
      // Redirect to card payment gateway
      window.location.href = `/payment/card?amount=${displayPrice}&type=${paymentType}`;
    } else {
      // Redirect to PayNow gateway
      window.location.href = `/payment/paynow?amount=${displayPrice}`;
    }
  };

  const inputClass = 'w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-bdred rounded-full animate-spin mb-4" />
        <p className="font-montserrat font-bold text-carbon">Processing your payment...</p>
        <p className="font-montserrat text-xs text-muted-foreground mt-1">Please wait</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Complete your purchase
      </h1>

      {/* Price card with period toggle - matching Step 3 design */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex bg-grey100 rounded-pill p-0.5 mb-4 w-fit mx-auto">
          <button
            type="button"
            onClick={() => setPaymentType('monthly')}
            className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all ${paymentType === 'monthly' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPaymentType('annual')}
            className={`px-4 py-1.5 rounded-pill font-montserrat font-semibold text-xs transition-all flex items-center gap-1 ${paymentType === 'annual' ? 'bg-white text-carbon shadow-sm' : 'text-muted-foreground'}`}
          >
            Annual
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase mb-2">
            Your Indicative Premium:
          </p>
          <p className="font-montserrat font-bold text-4xl text-bdred">
            S${displayPrice.toLocaleString()}
          </p>
          <p className="font-montserrat text-xs text-muted-foreground mt-1">
            per {paymentType === 'monthly' ? 'month' : 'year'}
          </p>
          <p className="font-montserrat text-xs text-muted-foreground mt-0.5">
            including prevailing GST
          </p>
        </div>

        {/* Monthly restriction warning inside price card */}
        {paymentType === 'monthly' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-montserrat font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <span className="font-bold">Monthly plan is only available for DBS, POST, and UOB cardholders</span>
            </p>
          </div>
        )}
      </div>

      {/* Policy summary card */}
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 space-y-3">
        <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase">Your Policy:</p>
        <div className="flex items-center gap-2 min-w-0">
          <Shield className="w-4 h-4 text-bdred flex-shrink-0" />
          <span className="text-sm font-montserrat font-bold text-carbon leading-snug">{coverLabels[coverType] || '—'}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Car className="w-4 h-4 text-bdred flex-shrink-0" />
          <span className="text-sm font-montserrat text-carbon leading-snug">{vehicleStr || '—'}</span>
        </div>
      </div>

      {/* Premium breakdown summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <p className="text-[10px] font-montserrat font-semibold tracking-widest text-muted-foreground uppercase">Your Premium Breakdown:</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-montserrat text-muted-foreground">Base Premium</span>
            <span className="text-xs font-montserrat font-semibold text-carbon">S${Math.round(price * 1.1).toLocaleString()}</span>
          </div>
          {(formData.driveLessOptIn || formData.annualDistance === 'lt8000') && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-montserrat text-muted-foreground">Drive Less Pay Less</span>
              <span className="text-xs font-montserrat font-semibold text-emerald-600">−S$150</span>
            </div>
          )}
          {formData.driveLessOptIn && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-montserrat text-muted-foreground">Drive Less Pay Less</span>
              <span className="text-xs font-montserrat font-semibold text-emerald-600">−S$150</span>
            </div>
          )}
          {(formData.utmPromo || formData.promoApplied) && (
            <div className="flex justify-between items-center bg-cyan/5 border border-cyan/20 rounded-lg p-2">
              <span className="text-xs font-montserrat text-carbon font-semibold">CapitaVoucher</span>
              <span className="text-xs font-montserrat font-semibold text-cyan">S$20 🎁</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment method */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`flex-1 py-3 rounded-lg border-2 font-montserrat font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              method === 'card' ? 'border-bdred bg-bdred/5 text-bdred' : 'border-gray-200 text-carbon'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Credit/Debit Card
          </button>
          <button
            type="button"
            onClick={() => setMethod('paynow')}
            className={`flex-1 py-3 rounded-lg border-2 font-montserrat font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              method === 'paynow' ? 'border-bdred bg-bdred/5 text-bdred' : 'border-gray-200 text-carbon'
            }`}
          >
            <QrCode className="w-4 h-4" /> PayNow
          </button>
        </div>

        {method === 'card' ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-xs font-montserrat text-muted-foreground">You'll be directed to our secure payment gateway to enter your card details</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center">
            <div className="w-40 h-40 bg-grey100 rounded-lg flex items-center justify-center mb-3">
              <QrCode className="w-20 h-20 text-carbon/30" />
            </div>
            <p className="text-xs font-montserrat text-muted-foreground">Scan QR code with your banking app</p>
          </div>
        )}

        {/* Secure badges */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-montserrat text-muted-foreground">256-bit SSL Encrypted · PCI DSS Compliant</span>
        </div>
      </div>

      <FeefoTrustBadge />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 font-montserrat font-bold text-sm text-carbon hover:border-carbon/40 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={method === 'card' && (!card.number || !card.expiry || !card.cvv || !card.name)}
          className="flex-1 px-4 py-3 rounded-lg bg-bdred text-white font-montserrat font-bold text-sm hover:bg-bdred/90 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {loading ? 'Processing...' : method === 'card' ? 'Pay by Card' : 'Pay by PayNow'}
        </button>
      </div>
    </div>
  );
}