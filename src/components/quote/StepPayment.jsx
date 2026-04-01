import { useState } from 'react';
import { CreditCard, Lock, QrCode } from 'lucide-react';
import StepFooter from './StepFooter';
import PillButton from './PillButton';

export default function StepPayment({ formData, price, onNext, onBack }) {
  const [paymentType, setPaymentType] = useState(formData.paymentType || 'annual');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const monthlyPrice = Math.round((price * 1.10) / 12);
  const displayPrice = paymentType === 'monthly' ? monthlyPrice : price;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      onNext(paymentType);
    }, 2000);
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

      {/* Payment frequency toggle */}
      <div className="flex gap-0 bg-grey100 rounded-pill p-1">
      {paymentType === 'monthly' && (
        <p className="text-xs font-montserrat text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="font-bold">Monthly instalment is only available for UOB and DBS credit card holders.</span>
        </p>
      )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="font-montserrat font-bold text-3xl text-bdred">
          SGD ${displayPrice.toLocaleString()}
        </p>
        <p className="font-montserrat text-sm text-carbon mt-1">
          {paymentType === 'monthly' ? 'per month' : 'per year'}
        </p>
        {paymentType === 'monthly' && (
          <p className="text-[11px] text-muted-foreground font-montserrat mt-1">
            +10% loading for monthly payments
          </p>
        )}
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
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            {paymentType === 'monthly' && (
              <div className="flex gap-2 mb-2">
                {['UOB', 'DBS'].map(bank => (
                  <div key={bank} className="flex-1 py-2 rounded-lg border-2 border-gray-200 bg-grey100 text-center font-montserrat font-bold text-sm text-carbon">{bank}</div>
                ))}
              </div>
            )}
            <div>
              <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Card number</label>
              <input type="text" maxLength={19} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={inputClass} placeholder="1234 5678 9012 3456" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Expiry</label>
                <input type="text" maxLength={5} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className={inputClass} placeholder="MM/YY" />
              </div>
              <div className="w-24">
                <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">CVV</label>
                <input type="password" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className={inputClass} placeholder="•••" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Name on card</label>
              <input type="text" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className={inputClass} placeholder="JOHN TAN" />
            </div>
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

      <StepFooter onBack={onBack} onNext={handlePay} label={`Pay Now — SGD $${displayPrice.toLocaleString()}`} />
    </div>
  );
}