import EllipseGradient from '../../assets/images/img-ellipse-gradient.png';
import BG_VIDEO from '../../assets/videos/WV-bg-team.mp4';
import {ReactComponent as MintReserveBackdrop} from 'assets/images/backdrops/img-mint-total-backdrop.svg';
import {ReactComponent as MintAllocationBackdrop} from 'assets/images/backdrops/img-mint-black-backdrop.svg';
import {ReactComponent as MintAirdropBackdrop} from 'assets/images/backdrops/img-vw-black-backdrop.svg';
import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import {ReactComponent as Delimeter} from '../../assets/icons/ic-delimeter.svg';

export default function Home() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <img className="absolute h-[100vh] xl:h-[auto] m-auto min-w-[100vw] xl:min-w-[1200px]" src={EllipseGradient}
             alt="ellipse"/>
        <video autoPlay className="w-full h-full object-cover object-center" loop muted playsInline>
          <source src={BG_VIDEO} type="video/mp4"/>
        </video>
        <Menu/>
        <div className="cover infoCover flex flex-col gap-4 md:gap-[40px] justify-start md:justify-center items-center">
          <div className="text-[64px] flex justify-center items-center h-[50px]">Mint Info</div>
          <div className='flex flex-col md:flex-row gap-[50px] justify-start md:justify-center items-center h-[100%] md:h-[auto] overflow-y-auto'>
            <div className="max-w-[300px] flex flex-col gap-1">
              <div className="flex items-center relative justify-center">
                <MintReserveBackdrop className="w-[280px] absolute z-0"/>
                <div className="text-[42px] text-white z-10">April 30th</div>
              </div>
              <div className="text-[42px] flex justify-center items-center h-[40px]">Reserve Mint</div>
              <Delimeter className="max-w-[100%] h-[10px]"/>
              <p className="text-[14px] text-center info-text">Ravendale holders will need to stake their dream catcher
                token in order to unlock their vault list and
                free claims. You can have as many ravendales in the same wallet and claim all your spots and merkels.</p>
            </div>

            <div className="max-w-[300px] flex flex-col gap-1">
              <div className="flex items-center relative justify-center">
                <MintAllocationBackdrop className=" absolute z-0"/>
                <div className="text-[42px] text-white z-10">may 1st</div>
              </div>
              <div className="text-[42px] flex justify-center items-center h-[40px]">Allocation Distribution</div>
              <Delimeter className="max-w-[100%] h-[10px]"/>
              <p className="text-[14px] text-center info-text">Ravendale holders will need to stake their dream catcher
                token in order to unlock their vault list and free claims. You can have as many ravendales in the same
                wallet and claim all your spots and merkels.</p>
            </div>

            <div className="max-w-[300px] flex flex-col gap-1">
              <div className="flex items-center relative justify-center">
                <MintAirdropBackdrop className="absolute z-0"/>
                <div className="text-[42px] text-white z-10">may 2nd</div>
              </div>
              <div className="text-[42px] flex justify-center items-center h-[40px]">Token Airdrop</div>
              <Delimeter className="max-w-[100%] h-[10px]"/>
              <p className="text-[14px] text-center info-text">Ravendale holders will need to stake their dream catcher
                token in order to unlock their vault list and free claims. You can have as many ravendales in the same
                wallet and claim all your spots and merkels.</p>
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    </>
  )
}
