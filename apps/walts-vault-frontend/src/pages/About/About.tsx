import BackgroundVideo from 'assets/videos/WV-bg-about.mp4';
import SubPageLayout from 'components/SubPageLayout';
import React from 'react';

export default function About() {
  return (
    <SubPageLayout title="About" backgroundVideoSrc={BackgroundVideo}>
      The motivation to create Walt’s Vault lies in the idea of art for the sake of art. Can art simply be an end,
      rather than a means? We’ve brought together the world’s top animators, artists, and storytellers to honour a
      timeless era and create a magical experience. Nothing more, nothing less.
    </SubPageLayout>
  );
}
