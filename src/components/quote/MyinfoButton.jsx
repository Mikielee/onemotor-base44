import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const MOCK_DATA = {
  nricFin: 'S8712345A',
  principalName: 'TAN WEI MING',
  gender: 'male',
  dobDay: '15',
  dobMonth: '03',
  dobYear: '1987',
  email: 'tanweiming@email.com',
  mobile: '91234567',
  postalCode: '520123',
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
    <>
      {/* Myinfo Button */}
      <button
        type="button"
        onClick={() => setStage('choose')}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3.5 px-4 hover:border-[#DA291C] hover:shadow-sm transition-all"
      >
        <span className="text-sm font-montserrat font-semibold text-carbon">
          Retrieve Your Information with
        </span>
        <span className="font-bold text-lg leading-none">
          <span className="text-[#DA291C]">my</span>
          <span className="text-[#1a1a1a] relative">
            <span className="inline-block">i</span>
            <span className="text-[#DA291C]">nfo</span>
          </span>
        </span>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {stage !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => stage === 'choose' && setStage('idle')}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4"
            >
              {stage === 'choose' && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      <span className="text-[#DA291C]">my</span><span className="text-[#1a1a1a]">info</span>
                    </div>
                    <p className="font-montserrat font-bold text-base text-carbon">Prototype: Choose a scenario</p>
                    <p className="font-montserrat text-xs text-muted-foreground mt-1">Select how you'd like to simulate the Myinfo retrieval</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChoose('success')}
                    className="w-full py-3.5 bg-green-500 text-white rounded-xl font-montserrat font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Simulate Success
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChoose('fail')}
                    className="w-full py-3.5 bg-bdred text-white rounded-xl font-montserrat font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Simulate Failure
                  </button>
                  <button type="button" onClick={() => setStage('idle')} className="w-full text-center text-xs text-muted-foreground font-montserrat py-1">
                    Cancel
                  </button>
                </>
              )}

              {stage === 'loading' && (
                <div className="text-center py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#DA291C] mx-auto animate-spin" />
                  <p className="font-montserrat font-semibold text-carbon text-sm">Retrieving your information…</p>
                </div>
              )}

              {stage === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-montserrat font-bold text-carbon text-base">Information Retrieved!</p>
                    <p className="font-montserrat text-xs text-muted-foreground mt-1">Your details have been prefilled from Myinfo. Please review and continue.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStage('idle')}
                    className="w-full py-3 bg-bdred text-white rounded-xl font-montserrat font-bold text-sm"
                  >
                    Continue
                  </button>
                </div>
              )}

              {stage === 'fail' && (
                <div className="text-center space-y-4">
                  <XCircle className="w-12 h-12 text-bdred mx-auto" />
                  <div>
                    <p className="font-montserrat font-bold text-carbon text-base">Retrieval Failed</p>
                    <p className="font-montserrat text-xs text-muted-foreground mt-1">We were unable to retrieve your information from Myinfo. Please try again or fill in manually.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStage('choose')}
                    className="w-full py-3 bg-bdred text-white rounded-xl font-montserrat font-bold text-sm"
                  >
                    Try Again
                  </button>
                  <button type="button" onClick={() => setStage('idle')} className="w-full text-center text-xs text-muted-foreground font-montserrat py-1">
                    Fill in manually
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}