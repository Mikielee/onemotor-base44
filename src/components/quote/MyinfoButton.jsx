import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const MOCK_DATA = {
  nricFin: 'S8712345A',
  principalName: 'TAN WEI MING',
  preferredName: 'Tan Wei Ming',
  gender: 'male',
  dobDay: '15',
  dobMonth: '03',
  dobYear: '1987',
  email: 'tanweiming@email.com',
  mobile: '91234567',
  postalCode: '520123',
  postcode: '520123',
  address: '123 Tampines Street 11, #08-22',
  maritalStatus: 'married',
  // Vehicle
  vehicleNumber: 'SJK1234A',
  carMake: 'Toyota',
  carModel: 'Camry',
  vehicleFirstRegDate: '2020-03-15',
  roadTaxExpiry: '2025-03-14',
  vehicleColour: 'White',
  vehicleScheme: 'PARF',
  chassisNumber: 'JTDBF3EK7A3012345',
  engineNumber: '2AR1234567',
  coeExpiry: '2030-03-14',
  ownershipDate: '2020-03-15',
  // Driving Licence
  com: 'yes',
  demeritPoints: '0',
  disqualStartDate: '',
  disqualEndDate: '',
  licenceValidity: '2030-12-31',
  licenceClass: 'Class 3',
  licenceYears: 'More than 10 yrs',
};

export default function MyinfoButton({ onDataRetrieved }) {
  const [stage, setStage] = useState('idle'); // idle | choose | loading | success | fail

  const handleChoose = (scenario) => {
    setStage('loading');
    setTimeout(() => {
      if (scenario === 'success') {
        onDataRetrieved(MOCK_DATA);
        setStage('success');
      } else {
        setStage('fail');
      }
    }, 1200);
  };

  return (
    <div className="space-y-2">
      {/* Myinfo Button */}
      {stage !== 'success' && (
        <button
          type="button"
          onClick={() => setStage('choose')}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3.5 px-4 hover:border-[#DA291C] hover:shadow-sm transition-all mt-[5px]"
        >
          <span className="text-sm font-montserrat font-semibold text-carbon whitespace-nowrap ml-[10px]">
            Retrieve your information with
          </span>
          <img
            src="https://media.base44.com/images/public/69cbaefc69ec721334277fa7/f71ebbb33_image.png"
            alt="Myinfo"
            className="h-9 w-auto object-contain"
          />
        </button>
      )}

      {/* Prototype scenario chooser - inline */}
      <AnimatePresence>
        {stage === 'choose' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <p className="font-montserrat font-bold text-xs text-muted-foreground uppercase tracking-wide">Prototype: Choose a scenario</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleChoose('success')}
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-montserrat font-bold text-sm flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Success
                </button>
                <button type="button" onClick={() => handleChoose('fail')}
                  className="flex-1 py-2.5 bg-bdred text-white rounded-lg font-montserrat font-bold text-sm flex items-center justify-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Failure
                </button>
              </div>
              <button type="button" onClick={() => setStage('idle')} className="text-xs text-muted-foreground font-montserrat">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <RefreshCw className="w-5 h-5 text-[#DA291C] animate-spin flex-shrink-0" />
            <p className="font-montserrat font-semibold text-carbon text-sm">Retrieving your information…</p>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 items-start">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-montserrat font-bold text-sm text-carbon">Information Retrieved!</p>
              <p className="font-montserrat text-xs text-muted-foreground mt-0.5">Your details have been prefilled from Myinfo. Please review and continue.</p>
            </div>
            <button type="button" onClick={() => setStage('idle')} className="text-xs text-muted-foreground font-montserrat flex-shrink-0">Reset</button>
          </motion.div>
        )}

        {stage === 'fail' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
            <XCircle className="w-5 h-5 text-bdred flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-montserrat font-bold text-sm text-carbon">Retrieval Failed</p>
              <p className="font-montserrat text-xs text-muted-foreground mt-0.5">Unable to retrieve from Myinfo. Please try again or fill in manually.</p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}