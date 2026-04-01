import { useState } from 'react';
import { X } from 'lucide-react';

export default function SaveEmailQuoteModal({ isOpen, onClose, formData, price }) {
  const [name, setName] = useState(formData.preferredName || '');
  const [email, setEmail] = useState(formData.email || '');
  const [phone, setPhone] = useState(formData.mobile || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const coverLabels = { COMP: 'Comprehensive', TPFT: 'Third Party, Fire & Theft', TPO: 'Third Party Only' };
  const coverType = formData.coverType || 'COMP';
  const basePrice = price;
  const ncd = parseInt(formData.ncdEntitlement || '0');
  const ncdDiscount = Math.round(basePrice * ncd / 100);
  const annualPrice = price;
  const monthlyPrice = Math.round(annualPrice / 12);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate email sending
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-montserrat font-bold text-lg text-carbon">Save & Email Quote</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-carbon transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 flex flex-col items-center justify-center min-h-80">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-montserrat font-bold text-carbon text-center">Quote sent successfully!</p>
            <p className="text-xs text-muted-foreground text-center mt-2">Check your email for the quote details.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Contact Info Form */}
              <div className="space-y-4">
                <p className="font-montserrat font-bold text-sm text-carbon mb-4">Contact Information</p>

                <div>
                  <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3 py-2.5 bg-grey100 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-muted-foreground flex-shrink-0 flex items-center">
                      +65
                    </div>
                    <input
                      type="tel"
                      maxLength={8}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
                      placeholder="9123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Quote Summary */}
              <div className="space-y-4 bg-grey100 rounded-lg p-4">
                <p className="font-montserrat font-bold text-sm text-carbon mb-3">Quote Summary</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-montserrat text-muted-foreground mb-1">Plan</p>
                    <p className="font-montserrat font-bold text-sm text-carbon">{coverLabels[coverType]}</p>
                  </div>

                  <div>
                    <p className="text-xs font-montserrat text-muted-foreground mb-1">Vehicle</p>
                    <p className="font-montserrat text-sm text-carbon">
                      {[formData.carMake, formData.carModel, formData.yearOfReg].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <p className="text-xs font-montserrat font-semibold text-muted-foreground mb-2 uppercase">Annual Premium</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-montserrat">
                        <span className="text-muted-foreground">Base</span>
                        <span className="text-carbon font-medium">S${basePrice.toLocaleString()}</span>
                      </div>
                      {ncd > 0 && (
                        <div className="flex justify-between text-xs font-montserrat">
                          <span className="text-muted-foreground">NCD discount ({ncd}%)</span>
                          <span className="text-emerald-600 font-medium">−S${ncdDiscount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs font-montserrat font-bold pt-2 border-t border-gray-300">
                        <span className="text-carbon">Total</span>
                        <span className="text-bdred">S${(basePrice - ncdDiscount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <p className="text-xs font-montserrat font-semibold text-muted-foreground mb-2 uppercase">Monthly Premium</p>
                    <div className="flex justify-between text-xs font-montserrat font-bold">
                      <span className="text-carbon">Per month</span>
                      <span className="text-bdred">S${monthlyPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg font-montserrat font-bold text-sm border-2 border-gray-200 text-carbon hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!name.trim() || !email.trim() || !phone.trim() || loading}
                className="flex-1 px-4 py-2.5 rounded-lg font-montserrat font-bold text-sm bg-bdred text-white disabled:bg-gray-200 disabled:text-gray-400 transition-all"
              >
                {loading ? 'Sending...' : 'Send Quote'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}