import { CheckCircle, Download, Home } from 'lucide-react';
import { format } from 'date-fns';
import PillButton from './PillButton';

export default function StepConfirmation({ formData, price, paymentType }) {
  const policyRef = `BDI-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const startDate = formData.coverStartDate ? format(new Date(formData.coverStartDate), 'dd MMM yyyy') : '—';
  const monthlyPrice = Math.round((price * 1.10) / 12);
  const displayPrice = paymentType === 'monthly' ? monthlyPrice : price;

  return (
    <div className="space-y-5 text-center">
      <div className="pt-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="font-montserrat font-bold text-2xl text-bdred">
          You're covered!
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 text-left space-y-3">
        <div className="flex justify-between text-sm font-montserrat">
          <span className="text-muted-foreground">Policy reference</span>
          <span className="font-bold text-carbon">{policyRef}</span>
        </div>
        <div className="flex justify-between text-sm font-montserrat">
          <span className="text-muted-foreground">Cover starts</span>
          <span className="font-bold text-carbon">{startDate}</span>
        </div>
        <div className="flex justify-between text-sm font-montserrat">
          <span className="text-muted-foreground">Cover type</span>
          <span className="font-bold text-carbon">{coverLabels[formData.coverType]}</span>
        </div>
        <div className="flex justify-between text-sm font-montserrat">
          <span className="text-muted-foreground">Premium paid</span>
          <span className="font-bold text-bdred">
            SGD ${displayPrice.toLocaleString()} / {paymentType === 'monthly' ? 'month' : 'year'}
          </span>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg px-4 py-3">
        <p className="text-sm font-montserrat text-emerald-800">
          A confirmation email has been sent to <span className="font-bold">{formData.email || 'your email'}</span>
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <PillButton variant="outline" onClick={() => {}}>
          <span className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Policy Documents
          </span>
        </PillButton>
        <PillButton onClick={() => window.location.reload()}>
          <span className="flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Return to Homepage
          </span>
        </PillButton>
      </div>
    </div>
  );
}