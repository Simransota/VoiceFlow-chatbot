"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { LottiePlayer } from 'lottie-web';

export default function ThinkingIndicator() {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    // Dynamically import lottie-web only on the client side
    import('lottie-web').then((lottieModule) => {
      setLottie(lottieModule.default);
    });
  }, []);

  useEffect(() => {
    if (lottie && lottieContainer.current) {
      const animation = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://cdn.prod.website-files.com/671f6b2c9790f5627796e087/672e3d8b8aa1f6b9598da3f4_logo%20loop%20json%202.json'
      });

      return () => animation.destroy(); // Clean up on unmount
    }
  }, [lottie]);

  return (
    <div className="flex items-center text-gray-300 text-3xl font-medium">
      <div ref={lottieContainer} className="w-10 h-10" />
      <span>Thinking...</span>
    </div>
  );
}