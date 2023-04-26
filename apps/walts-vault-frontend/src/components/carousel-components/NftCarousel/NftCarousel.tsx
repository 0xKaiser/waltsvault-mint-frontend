import NFT_VIDEO_1 from 'assets/videos/nfts/nft-1.mp4';
import NFT_VIDEO_2 from 'assets/videos/nfts/nft-2.mp4';
import NFT_VIDEO_3 from 'assets/videos/nfts/nft-3.mp4';
import NFT_VIDEO_4 from 'assets/videos/nfts/nft-4.mp4';
import NFT_VIDEO_5 from 'assets/videos/nfts/nft-5.mp4';
import NFT_VIDEO_6 from 'assets/videos/nfts/nft-6.mp4';
import Carousel from 'components/carousel-components/Carousel';
import React from 'react';

import NftCarouselCard from '../NftCarouselCard';

const NFT_IMAGES = [NFT_VIDEO_1, NFT_VIDEO_2, NFT_VIDEO_3, NFT_VIDEO_4, NFT_VIDEO_5, NFT_VIDEO_6];

interface NftCarouselProps {
  toggleNftFocus?: () => void;
  lightOn: boolean;
}
export default function NftCarousel({ toggleNftFocus, lightOn }: NftCarouselProps) {
  function renderNftCard({ animation, data }: { animation: number; data: string }) {
    return (
      <button type="button" onClick={toggleNftFocus}>
        <NftCarouselCard lightOn={lightOn} animation={animation} src={data} />
      </button>
    );
  }

  return (
    <div className="relative flex justify-center items-center h-full w-full">
      <div className="h-[71%] w-[71%] flex justify-start items-center">
        <Carousel images={NFT_IMAGES} renderCard={renderNftCard} scrollSpeedMultiplier={5} />
      </div>
    </div>
  );
}
