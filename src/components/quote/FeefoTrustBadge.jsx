import { Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-56 flex-shrink-0 flex flex-col justify-between" style={{ height: '164px' }}>
      <div className="overflow-hidden flex-1">
        <p className="font-montserrat font-bold text-xs text-carbon mb-1 truncate">"{review.title}"</p>
        <div className="flex items-center gap-1 mb-1.5">
          <StarRating />
          <span className="text-[10px] font-montserrat font-semibold text-carbon ml-1">{review.author}</span>
        </div>
        <p className={`text-[11px] font-montserrat text-carbon/80 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>{review.body}</p>
      </div>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="text-[10px] font-montserrat font-bold text-cyan mt-1.5 text-left hover:underline"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
}

function AutoScrollCarousel() {
  const trackRef = useRef(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf;
    let pos = 0;
    const speed = 0.4;
    const step = () => {
      pos += speed;
      const half = track.scrollWidth / 2;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-3" style={{ width: 'max-content' }}>
        {doubled.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>
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

      {/* Review carousel */}
      <AutoScrollCarousel />

      <p className="text-[11px] text-center font-montserrat text-muted-foreground">
        Reviews collected and verified by <span className="font-semibold">Feefo</span>
      </p>
    </div>
  );
}