import React from 'react';

const ConstructionOverlay = ({ show = true }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[100] backdrop-blur-md bg-black/50 flex items-center justify-center">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl max-w-lg mx-4 text-center">
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-yellow-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-100 mb-4">
          Under Construction
        </h2>
        
        <p className="text-neutral-300 mb-6">
          We&apos;re working hard to bring you something amazing. The Pulsar Engine website is currently under development. Check back soon for updates!
        </p>
        
        <div className="flex justify-center gap-4">
          <a 
            href="https://github.com/Far-Beyond-Pulsar" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-all"
          >
            Visit GitHub
          </a>
          <a 
            href="https://discord.gg/NM4awJWGWu" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-all"
          >
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConstructionOverlay;