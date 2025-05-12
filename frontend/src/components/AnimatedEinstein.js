import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
 
// Import all Einstein waving frame images
import frame1 from '../assets/einstein_wave_1.png';
import frame2 from '../assets/einstein_wave_2.png';
import frame3 from '../assets/einstein_wave_3.png';
import frame4 from '../assets/einstein_wave_4.png';
 
// These images differ only in the hand pose
const wavingFrames = [frame1, frame2, frame3, frame2, frame4, frame2];
 
export default function AnimatedEinstein() {
  const [frameIndex, setFrameIndex] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % wavingFrames.length);
    }, 160); // approx 6 fps for smooth hand movement
    return () => clearInterval(interval);
  }, []);
 
  return (
<Box
      component="img"
      src={wavingFrames[frameIndex]}
      alt="Einstein hand waving"
      sx={{
        width: 200,
        height: 200,
        userSelect: 'none',
        pointerEvents: 'none',
        mb: 2,
      }}
    />
  );
}