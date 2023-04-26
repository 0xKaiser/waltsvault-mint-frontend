import SMOKE_VIDEO from 'assets/videos/smoke.mp4';
import React from 'react';

function SmokeScreen() {
  return (
    <div className="bg-blend-screen">
      <video muted loop autoPlay src={SMOKE_VIDEO}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
export default React.memo(SmokeScreen);
