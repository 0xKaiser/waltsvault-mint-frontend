import BackgroundVideo from 'assets/videos/WV-bg-vision.mp4';
import SubPageLayout from 'components/SubPageLayout';
import React from 'react';

export default function Vision() {
  return (
    <SubPageLayout title="Vision" backgroundVideoSrc={BackgroundVideo}>
      How can a story last forever? How can a creation live beyond its creator? Inventing something timeless and magical
      requires simplicity. Walt’s Vault focuses on crafting art that honours tradition while exploring the boundaries of
      new mediums.
    </SubPageLayout>
  );
}
