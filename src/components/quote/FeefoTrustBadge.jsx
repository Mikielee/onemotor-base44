import { Star } from 'lucide-react';

const REVIEWS = [
  {
    title: 'Great customer service',
    author: 'Trusted Customer',
    date: 'April 1, 2026',
    tag: 'Comprehensive Car Insurance',
    body: 'I had a great experience with Kavina\'s customer service. She was extremely patient in handling my request, especially as I was an existing customer with a 40% NCD. After returning from overseas, I needed to expedite my policy as I was purchasing a car the very next day. Kavina went above and beyond to assist me promptly, ensuring everything was settled in time.',
  },
  {
    title: 'Excellent service.',
    author: 'Trusted Customer',
    date: 'March 31, 2026',
    tag: 'Comprehensive Car Insurance',
    body: 'Alan Yang was professional and helpful throughout the entire process from delivering a quote to the day I signed up. He deserves a compliment for his excellent service and patience.',
  },
  {
    title: 'Value for Money',
    author: 'Beng Heok',
    date: 'March 31, 2026',
    tag: 'Comprehensive Car Insurance',
    body: 'I was served by Shem. He is patient and explained clearly on the policy details. Was able to clearly answer my queries.',
  },
  {
    title: 'Price was competitive and agent were responsive.',
    author: 'Trusted Customer',
    date: 'March 31, 2026',
    tag: 'Comprehensive Motorcycle Insurance',
    body: 'Agent was helpful and explained the policy clearly.',
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="font-montserrat font-bold text-sm text-carbon mb-1.5">"{review.title}"</p>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <StarRating />
        <span className="text-xs font-montserrat font-semibold text-carbon">{review.author}</span>
        <span className="text-xs text-muted-foreground font-montserrat">· {review.date}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground font-montserrat">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 inline-block" />
          {review.tag}
        </span>
      </div>
      <p className="text-xs font-montserrat text-carbon/80 leading-relaxed">{review.body}</p>
    </div>
  );
}

export default function FeefoTrustBadge() {
  return (
    <div className="space-y-3">
      {/* Rating + Badge row */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
        <img
          src="https://media.base44.com/images/public/69cbaefc69ec721334277fa7/3dda4e934_image.png"
          alt="Feefo Platinum Trusted Service Award 2026"
          className="w-20 h-20 object-contain flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StarRating />
            <span className="font-montserrat font-bold text-sm text-carbon">4.9 / 5.0</span>
          </div>
          <p className="font-montserrat font-semibold text-xs text-carbon">Rated Excellent by our customers</p>
          <p className="font-montserrat text-[11px] text-muted-foreground mt-0.5">Based on 2,400+ verified Feefo reviews</p>
          <img
            src="https://www.feefo.com/resources/images/logos/feefo-logo-new.png"
            alt="Feefo"
            className="h-5 mt-1.5 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-2">
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>

      <p className="text-[11px] text-center font-montserrat text-muted-foreground">
        Reviews collected and verified by <span className="font-semibold">Feefo</span>
      </p>
    </div>
  );
}