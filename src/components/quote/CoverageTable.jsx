import { Check, X } from 'lucide-react';
import { useState } from 'react';

const COVER_DATA = [
  { label: 'Injury or death to someone else',                              comp: true,  tpft: true,  tpo: true  },
  { label: 'Damage to other people\'s property',                           comp: true,  tpft: true,  tpo: true  },
  { label: 'Legal costs against criminal charges',                         comp: true,  tpft: true,  tpo: true  },
  { label: 'Towing after an accident',                                     comp: true,  tpft: true,  tpo: false },
  { label: 'Damage by fire',                                               comp: true,  tpft: true,  tpo: false },
  { label: 'Damage or loss to your car due to theft',                      comp: true,  tpft: true,  tpo: false },
  { label: 'Damage to your car if someone else crashes into you',          comp: true,  tpft: false, tpo: false },
  { label: 'Damage to your car when it\'s your fault',                    comp: true,  tpft: false, tpo: false },
  { label: 'Damage by fallen trees, flood, storms or natural disaster',    comp: true,  tpft: false, tpo: false },
  { label: 'Damage by vandals',                                            comp: true,  tpft: false, tpo: false },
  { label: 'Damage to windscreen or windows',                              comp: true,  tpft: false, tpo: false },
];

const COVERS = [
  { key: 'comp', label: 'Comprehensive' },
  { key: 'tpft', label: 'TPFT' },
  { key: 'tpo',  label: 'TPO' },
];

function Tick({ yes }) {
  return yes
    ? <Check className="w-4 h-4 text-emerald-600 mx-auto" />
    : <X className="w-4 h-4 text-red-400 mx-auto" />;
}

export default function CoverageTable({ selectedCoverType, onHide }) {
  const sel = (selectedCoverType || 'COMP').toLowerCase();

  return (
    <div>
      {/* Mobile: stacked cards per cover type */}
      <div className="md:hidden space-y-4">
        {COVERS.map(c => (
          <div key={c.key} className={`rounded-lg border-2 p-3 ${c.key === sel ? 'border-bdred bg-bdred/5' : 'border-gray-200 bg-white'}`}>
            <h4 className={`font-montserrat font-bold text-sm mb-3 ${c.key === sel ? 'text-bdred' : 'text-carbon'}`}>{c.label}</h4>
            <div className="space-y-2">
              {COVER_DATA.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 flex-shrink-0 mt-0.5">
                    <Tick yes={b[c.key]} />
                  </div>
                  <span className={`text-xs font-montserrat ${b[c.key] ? 'text-carbon' : 'text-muted-foreground line-through'}`}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs font-montserrat border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium w-1/2">Cover</th>
              {COVERS.map(c => (
                <th key={c.key} className={`text-center py-2 px-2 font-bold ${c.key === sel ? 'text-bdred' : 'text-carbon'}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COVER_DATA.map((b, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2 pr-3 text-carbon leading-tight">{b.label}</td>
                {COVERS.map(c => (
                  <td key={c.key} className="py-2 px-2 text-center">
                    <Tick yes={b[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onHide}
        className="mt-3 text-xs font-montserrat font-bold text-cyan hover:underline"
      >
        Hide full coverage
      </button>
    </div>
  );
}