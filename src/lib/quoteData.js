export const CAR_MAKES = [
  'Toyota', 'Honda', 'Mazda', 'Nissan', 'Hyundai',
  'Mercedes-Benz', 'BMW', 'Kia', 'Subaru', 'Mitsubishi'
];

export const CAR_MODELS = {
  'Toyota': ['Corolla', 'Camry', 'Vios', 'Yaris', 'RAV4'],
  'Honda': ['Civic', 'Jazz', 'HR-V', 'CR-V', 'Accord'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-30', 'MX-5'],
  'Nissan': ['Sylphy', 'Note', 'Qashqai', 'X-Trail', 'Kicks'],
  'Hyundai': ['Avante', 'Tucson', 'Kona', 'i30', 'Santa Fe'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC'],
  'BMW': ['1 Series', '3 Series', '5 Series', 'X1', 'X3'],
  'Kia': ['Cerato', 'Sportage', 'Seltos', 'Stonic', 'Carnival'],
  'Subaru': ['Impreza', 'XV', 'Forester', 'Outback', 'WRX'],
  'Mitsubishi': ['Attrage', 'Outlander', 'ASX', 'Eclipse Cross', 'Triton'],
};

export const SUB_MODELS = {
  'Corolla': ['1.6 Auto', '1.8 Auto', '1.8 Hybrid'],
  'Camry': ['2.0 Auto', '2.5 Auto', '2.5 Hybrid'],
  'Vios': ['1.5 Auto', '1.5 Manual'],
  'Civic': ['1.5 Turbo Auto', '2.0 Auto', '1.5 e:HEV'],
  'Jazz': ['1.5 Auto', '1.5 Hybrid'],
  'Mazda3': ['1.5 Auto', '2.0 Auto'],
  'CX-5': ['2.0 Auto', '2.5 Auto', '2.5 Turbo'],
};

export const INSURERS = [
  'NTUC Income', 'AIG', 'AXA', 'Tokio Marine', 'Etiqa',
  'Great Eastern', 'MSIG', 'DirectAsia', 'QBE', 'Budget Direct', 'Other'
];

export const FINANCE_COMPANIES = [
  'DBS', 'OCBC', 'UOB', 'Maybank', 'Standard Chartered', 'Grab Finance', 'Other'
];

export const COVER_TYPES = [
  {
    id: 'COMP',
    name: 'Comprehensive',
    desc: 'Full protection — covers damage to your car, other vehicles, fire, theft, and more.',
    maxAge: 15,
  },
  {
    id: 'TPFT',
    name: 'Third Party, Fire & Theft',
    desc: 'Covers damage to other vehicles plus fire and theft of your car.',
    maxAge: 20,
  },
  {
    id: 'TPO',
    name: 'Third Party Only',
    desc: 'Basic cover — protects against damage you cause to other vehicles and property.',
    maxAge: null,
  },
];

export const COVER_INCLUSIONS = {
  'COMP': [
    'Accidental damage to your vehicle',
    'Third-party property damage up to $5M',
    'Fire and theft protection',
  ],
  'TPFT': [
    'Third-party property damage up to $5M',
    'Fire and theft protection',
    'Personal injury cover for third parties',
  ],
  'TPO': [
    'Third-party property damage up to $5M',
    'Personal injury cover for third parties',
    'Legal liability protection',
  ],
};

export const BASE_PRICES = {
  'COMP': 1234,
  'TPFT': 890,
  'TPO': 456,
};

export function calculatePrice(formData) {
  const coverType = formData.coverType || 'COMP';
  let price = BASE_PRICES[coverType] || 1234;

  // Usage adjustments
  if (formData.carUsage === 'business') price += 80;
  if (formData.offPeak === 'yes') price -= 60;
  if (formData.claimsInPast3Years === 'yes') price += 40;
  if (formData.certificateOfMerit === 'yes') price -= 30;

  // NCD discount
  const ncd = parseInt(formData.ncdEntitlement || '0');
  price = price * (1 - ncd / 100);

  // Additional drivers
  if (formData.additionalDriverPlan === 'any') price += 200;
  if (formData.namedDrivers?.length) price += formData.namedDrivers.length * 80;

  // Drive Less Pay Less
  if (formData.driveLessOptIn) price -= 150;

  // Excess adjustment
  const excess = formData.excess || 1000;
  const excessDelta = { 500: 80, 1000: 0, 1500: -60, 2000: -120, 2500: -160 };
  price += (excessDelta[excess] || 0);

  // Optional benefits
  if (formData.benefitPA) {
    const paPrice = { 50000: 78, 100000: 110, 200000: 158 };
    price += paPrice[formData.paCoverLevel || 50000] || 78;
  }
  if (formData.benefitNCD) price += 95;
  if (formData.benefitLOU) price += 120;
  if (formData.benefitWindscreen) price += 60;

  return Math.max(Math.round(price), 200);
}

export const EXCESS_OPTIONS = [500, 1000, 1500, 2000, 2500];
export const EXCESS_DELTA = { 500: 80, 1000: 0, 1500: -60, 2000: -120, 2500: -160 };

export const HELP_TEXTS = {
  'COMP': 'Comprehensive insurance covers damage to your own car as well as damage to other vehicles and property. It\'s the highest level of motor insurance cover available.',
  'TPFT': 'Third Party, Fire & Theft covers damage to other vehicles and property, plus protection if your car is stolen or damaged by fire. It does not cover accidental damage to your own car.',
  'TPO': 'Third Party Only is the minimum legal requirement. It covers damage to other people\'s vehicles and property but does not cover any damage to your own car.',
  'offPeak': 'An off-peak car (also known as a "Red Plate" car) is registered under the Off-Peak Car scheme. These cars can only be used during off-peak hours on weekdays and freely on weekends and public holidays.',
  'com': 'The Certificate of Merit (COM) is awarded to drivers who have maintained a clean driving record (no claims) for at least 5 consecutive years. Having a COM may qualify you for a premium discount.',
  'ncd': 'No Claim Discount (NCD) is a discount on your motor insurance premium for every consecutive year you don\'t make a claim. It ranges from 10% to 50%.',
  'driveLess': 'Drive Less Pay Less (DLPL) is a usage-based insurance plan. You pay a lower premium if you drive less than 8,000 km per year. An odometer photo is required at policy start and renewal.',
  'pa': 'Personal Accident & Medical coverage provides financial protection for you and your passengers in case of injuries from a motor accident. It covers medical expenses and provides lump-sum payments for serious injuries.',
  'ncdProtection': 'NCD Protection allows you to make one at-fault claim during your policy period without losing your No Claim Discount. Without NCD Protection, any at-fault claim will reset your NCD to 0%.',
  'lou': 'Loss of Use cover provides a hire car while your vehicle is being repaired following a covered claim. This covers up to 30 days of hire car rental.',
  'windscreen': 'Excess-free Windscreen cover allows you to repair or replace your windscreen once per policy year without paying any excess. Standard cover requires you to pay an excess for windscreen claims.',
  'singpass': 'Singpass is Singapore\'s trusted digital identity. Using Singpass MyInfo, we can auto-fill your personal details securely, saving you time.',
  'excess': 'Your excess is the amount you agree to pay towards any claim. Choosing a higher excess lowers your premium, but means you pay more if you need to claim.',
};