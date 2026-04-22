import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'a', label: 'Version A: Simple' },
  { id: 'b', label: 'Version B: Trust-first', recommended: true },
  { id: 'c', label: 'Version C: Calculator' },
];

function SharedHeader() {
  return (
    <div className="mb-5">
      <p className="text-xs text-muted-foreground font-montserrat mb-1">Step 11 of 17</p>
      <h1 className="font-montserrat font-bold text-xl text-carbon mb-2">Drive Less, Pay Less</h1>
      <span className="inline-block bg-green-100 text-green-700 text-xs font-montserrat font-bold px-3 py-1 rounded-full border border-green-200">
        You qualified — save up to 30%
      </span>
    </div>
  );
}

function PrimaryButton({ children }) {
  return (
    <button className="w-full py-3.5 rounded-pill font-montserrat font-bold text-sm text-white transition-all hover:opacity-90" style={{ backgroundColor: '#DA291C' }}>
      {children}
    </button>
  );
}

function OutlineButton({ children }) {
  return (
    <button className="w-full py-3.5 rounded-pill font-montserrat font-bold text-sm text-carbon bg-white border-2 border-gray-300 hover:border-gray-400 transition-all">
      {children}
    </button>
  );
}

function ProsCons({ label, pros, cons }) {
  return (
    <div className="mt-6 rounded-xl p-4 space-y-3" style={{ backgroundColor: '#F5F5F5' }}>
      <p className="text-[11px] font-montserrat font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
      <div>
        <p className="text-xs font-montserrat font-bold text-green-700 mb-1">✓ Pros</p>
        <ul className="space-y-1">
          {pros.map((p, i) => <li key={i} className="text-xs font-montserrat text-carbon">• {p}</li>)}
        </ul>
      </div>
      <div>
        <p className="text-xs font-montserrat font-bold text-red-600 mb-1">✗ Cons</p>
        <ul className="space-y-1">
          {cons.map((c, i) => <li key={i} className="text-xs font-montserrat text-carbon">• {c}</li>)}
        </ul>
      </div>
    </div>
  );
}

function VersionA() {
  return (
    <div>
      <SharedHeader />
      <p className="font-montserrat font-bold text-sm text-carbon mb-3">How it works</p>
      <div className="space-y-3 mb-6">
        {[
          'Your cover is locked to 8,000 km/year (roughly 22 km a day)',
          'After purchase we SMS you — just reply with your odometer reading within 14 days',
          'If you go over your limit, your claim is still covered. An additional excess of SGD 500 applies on at-fault claims.',
        ].map((text, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-montserrat font-bold text-xs text-white mt-0.5" style={{ backgroundColor: '#DA291C' }}>
              {i + 1}
            </div>
            <p className="text-sm font-montserrat text-carbon leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <PrimaryButton>Yes, opt me in and save</PrimaryButton>
        <OutlineButton>No thanks, keep unlimited cover</OutlineButton>
      </div>
      <ProsCons
        label="Version A — for meeting discussion"
        pros={[
          'Simple and fast, very low customer effort',
          'Proven model (AHM uses this)',
        ]}
        cons={[
          'Safety net message is passive and easy to miss',
          'No proactive km tracking',
          'Relies on customer reading carefully',
        ]}
      />
    </div>
  );
}

function VersionB() {
  return (
    <div>
      <SharedHeader />

      {/* 8000km context */}
      <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#EFF8FF' }}>
        <p className="font-montserrat font-bold text-sm text-blue-800 mb-2">8,000 km/year = about 22 km a day</p>
        <div className="w-full bg-blue-100 rounded-full h-2.5 mb-1">
          <div className="h-2.5 rounded-full" style={{ width: '65%', backgroundColor: '#008EAA' }} />
        </div>
        <p className="text-[11px] font-montserrat text-blue-600 mt-1">Most Singapore drivers use less than this</p>
      </div>

      {/* Savings */}
      <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#F0FDF4' }}>
        <p className="font-montserrat font-bold text-sm text-green-800">You could save up to <span className="text-green-600">$XXX per year</span> compared to unlimited cover</p>
      </div>

      {/* Safety net */}
      <div className="rounded-xl p-4 mb-5 border border-orange-200" style={{ backgroundColor: '#FFF7ED' }}>
        <p className="font-montserrat font-bold text-sm text-orange-800 mb-1.5">What if I go over my limit?</p>
        <p className="text-sm font-montserrat text-orange-700 leading-relaxed">
          Your claim will never be rejected because of mileage. An additional excess of SGD 500 applies on at-fault claims if you exceed your limit. We will SMS you when you are getting close so you can top up anytime.
        </p>
      </div>

      <p className="font-montserrat font-bold text-sm text-carbon mb-3">How it works</p>
      <div className="space-y-3 mb-6">
        {[
          'Opt in below',
          'We SMS you after purchase — just reply with your odometer reading',
          'We alert you when you reach 80% of your limit so you can top up before it matters',
        ].map((text, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-montserrat font-bold text-xs text-white mt-0.5" style={{ backgroundColor: '#DA291C' }}>
              {i + 1}
            </div>
            <p className="text-sm font-montserrat text-carbon leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <PrimaryButton>Yes, opt me in and save</PrimaryButton>
        <OutlineButton>No thanks, keep unlimited cover</OutlineButton>
      </div>

      <ProsCons
        label="Version B — Recommended (for meeting discussion)"
        pros={[
          'Anticipates all customer concerns upfront',
          'Removes range anxiety',
          'Supports self-service on mobile without needing to call in',
          'Builds long-term trust',
        ]}
        cons={[
          'More content on screen than Version A',
          'Requires SMS alert infrastructure',
        ]}
      />
    </div>
  );
}

function VersionC() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <SharedHeader />

      <p className="font-montserrat font-bold text-base text-carbon mb-4">How much could you save?</p>

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-xl border-2 border-green-300 p-3 text-center">
          <p className="text-[11px] font-montserrat font-bold text-green-700 mb-1">Drive Less Pay Less</p>
          <p className="font-montserrat font-bold text-lg text-green-600">$XXX</p>
          <p className="text-[10px] font-montserrat text-muted-foreground">/year</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-3 text-center">
          <p className="text-[11px] font-montserrat font-bold text-muted-foreground mb-1">Unlimited km</p>
          <p className="font-montserrat font-bold text-lg text-muted-foreground">$XXX</p>
          <p className="text-[10px] font-montserrat text-muted-foreground">/year</p>
        </div>
      </div>
      <div className="text-center mb-5">
        <p className="font-montserrat font-bold text-sm text-green-600">You save: $XXX/year</p>
      </div>

      <p className="text-sm font-montserrat text-muted-foreground mb-4 leading-relaxed">
        8,000 km per year is about 22 km a day. Many Singapore drivers qualify.
      </p>

      {/* Collapsible how it works */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <p className="font-montserrat font-bold text-sm text-carbon">How it works</p>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                {[
                  'Opt in below',
                  'We SMS you after purchase — reply with your odometer reading',
                  'We alert you at 80% of your limit so you can top up anytime',
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-montserrat font-bold text-[10px] text-white mt-0.5" style={{ backgroundColor: '#DA291C' }}>
                      {i + 1}
                    </div>
                    <p className="text-sm font-montserrat text-carbon leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Safety note */}
      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#F5F5F5' }}>
        <p className="text-sm font-montserrat text-carbon leading-relaxed">
          Claims are never rejected for mileage. An additional SGD 500 excess applies if you exceed your limit on an at-fault claim.
        </p>
      </div>

      <div className="space-y-3">
        <PrimaryButton>Yes, opt me in and save</PrimaryButton>
        <OutlineButton>No thanks, keep unlimited cover</OutlineButton>
      </div>

      <ProsCons
        label="Version C — for meeting discussion"
        pros={[
          'Shows financial value upfront',
          'Helps customers self-validate and feel confident opting in',
        ]}
        cons={[
          'Price-focused approach may reduce trust-building focus',
          'Higher cognitive load',
          'Most complex to build',
        ]}
      />
    </div>
  );
}

export default function OM019VersionExplorer() {
  const [activeTab, setActiveTab] = useState('b');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      {/* Page title */}
      <div className="w-full max-w-[390px] mb-4">
        <p className="text-xs font-montserrat text-muted-foreground">Stakeholder Review</p>
        <h2 className="font-montserrat font-bold text-base text-carbon">OM-019 Drive Less Pay Less — Version Explorer</h2>
      </div>

      {/* Tab switcher */}
      <div className="w-full max-w-[390px] mb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-1 rounded-lg font-montserrat font-bold text-[11px] transition-all leading-tight text-center relative ${
                activeTab === tab.id
                  ? 'text-white shadow-sm'
                  : 'text-muted-foreground hover:text-carbon'
              }`}
              style={activeTab === tab.id ? { backgroundColor: '#DA291C' } : {}}
            >
              {tab.recommended && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {' '}
                </span>
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile frame */}
      <div className="w-full max-w-[390px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 overflow-y-auto" style={{ minHeight: '600px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'a' && <VersionA />}
              {activeTab === 'b' && <VersionB />}
              {activeTab === 'c' && <VersionC />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="text-[11px] font-montserrat text-muted-foreground mt-4 text-center">Prototype only — for internal stakeholder discussion</p>
    </div>
  );
}