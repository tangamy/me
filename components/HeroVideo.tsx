'use client';

import { useState } from 'react';

export default function HeroVideo() {
  const [desktopLooping, setDesktopLooping] = useState(false);
  const [mobileLooping, setMobileLooping]   = useState(false);

  return (
    <>
      {/* Landscape — desktop */}
      <video
        key={`desktop-${desktopLooping}`}
        autoPlay
        muted
        playsInline
        loop={desktopLooping}
        onEnded={() => setDesktopLooping(true)}
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      >
        {desktopLooping ? (
          <>
            <source src="/media/homepage-loop-1920x1080.webm" type="video/webm" />
            <source src="/media/homepage-loop-1920x1080.mp4"  type="video/mp4" />
          </>
        ) : (
          <>
            <source src="/media/homepage-intro-1920x1080.webm" type="video/webm" />
            <source src="/media/homepage-intro-1920x1080.mp4"  type="video/mp4" />
          </>
        )}
      </video>

      {/* Portrait — mobile */}
      <video
        key={`mobile-${mobileLooping}`}
        autoPlay
        muted
        playsInline
        loop={mobileLooping}
        onEnded={() => setMobileLooping(true)}
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        {mobileLooping ? (
          <>
            <source src="/media/homepage-loop-1080x1920.webm" type="video/webm" />
            <source src="/media/homepage-loop-1080x1920.mp4"  type="video/mp4" />
          </>
        ) : (
          <source src="/media/homepage-intro-1080x1920.mp4" type="video/mp4" />
        )}
      </video>

      {/* Scrim so dark text stays readable over the video */}
      <div className="absolute inset-0 bg-site-bg/40" />
    </>
  );
}
