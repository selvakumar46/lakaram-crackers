import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 w-10 h-10 rounded-full bg-[#1e2236] border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all active:scale-95"
      title="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
