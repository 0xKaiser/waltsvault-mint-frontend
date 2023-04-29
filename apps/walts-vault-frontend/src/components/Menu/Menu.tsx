import {PAGE_ROUTE} from 'constants/index';

import Modal from '@twl/common/components/Modal';
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import {ReactComponent as IcClose} from 'assets/icons/ic-close.svg';
import {ReactComponent as IcMenu} from 'assets/icons/ic-menu.svg';
import {ReactComponent as VwBackdrop} from 'assets/images/backdrops/img-vw-backdrop.svg';
import SocialIcons from 'components/SocialIcons';
import React, {useEffect, useState} from 'react';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import configs from '../../web3/config.json';

export default function Menu({
                               isMintPeriod,
                               isPostMintPeriod,
                             }: {
  mintState?: string;
  isMintPeriod?: boolean;
  isPostMintPeriod?: boolean;
}) {
  const {isMobile, isDesktop} = useBreakpoints();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const {pathname} = useLocation();
  const navigate = useNavigate()
  const isMintPage = pathname === '/mint' || pathname === '/claim-and-refund';

  useEffect(() => {
    setIsModalOpened(false);
  }, [pathname]);

  function onModalClickHandler() {
    setIsModalOpened(prevDisplayMobileMenu => !prevDisplayMobileMenu);
  }

  function renderSubpageLinks() {
    const PAGE_ROUTE_WITH_MINT = Object.values(PAGE_ROUTE);

    if (isMintPeriod) {
      PAGE_ROUTE_WITH_MINT.push({path: '/mint', name: 'Mint', backdrop: VwBackdrop});
    }
    if (isPostMintPeriod) {
      PAGE_ROUTE_WITH_MINT.push({path: '/claim-and-refund', name: 'Claim / Refund', backdrop: VwBackdrop});
    }
    const handleCheckPath = (path: any) => {
      console.log('path----', path)
      navigate(path)
    }

    return Object.values(PAGE_ROUTE_WITH_MINT).map(({path, name, backdrop: Backdrop}) => (
      <a onClick={() => handleCheckPath(path)} key={path}
         className="relative flex justify-center items-center z-100 mx-[-8px] link">
        {Backdrop && (
          <Backdrop
            className={`cover ${pathname !== path ? 'opacity-0' : ''} w-max h-max min-w-[250px] md:min-w-[0]`}
          />
        )}
        <div className="relative w-full px-10">
          <button type="button" className={`button ${pathname === path ? 'text-black' : 'text-white'}`}>
            {isMobile ? <h1>{name}</h1> : name}
          </button>
        </div>
      </a>
    ));
  }

  function renderMobileMenu() {
    return (
      <div className="flex flex-row w-full justify-end pt-8 pr-8">
        {!isModalOpened && (
          <div onClick={onModalClickHandler} aria-hidden="true" className={`${pathname === '/mint-info' && 'black' }`} >
            <IcMenu/>
          </div>
        )}
        <Modal isOpen={isModalOpened} className="flex flex-col py-7 bg-black overflow-y-scroll z-20">
          <div className="fixed top-4 right-4">
            <button onClick={onModalClickHandler} type="button">
              <IcClose/>
            </button>
          </div>
          <div className="flex flex-col w-full flex-1 items-start justify-start py-16">
            {renderSubpageLinks()}
          </div>
          <div className="absolute bottom-8 flex flex-row w-full justify-end">
            <SocialIcons/>
          </div>
        </Modal>
      </div>
    );
  }

  function renderDesktopMenu() {
    return (
      <div className="flex flex-row w-full justify-between py-6 px-6">
        {/*<div className="absolute top-[-160px] left-[-320px] bg-black  w-[1200px] h-[300px] radial-shadow"/>*/}
        <div className="flex relative">{renderSubpageLinks()}</div>
        <div className="ml-10 flex items-center">
          <SocialIcons/>
        </div>
      </div>
    );
  }

  function renderMintPageMenu() {
    return (
      <div className={`flex flex-row w-full py-6 px-6 ${isMobile ? 'justify-center' : 'justify-between'}`}>
        <div className="flex relative">
          <Link to={PAGE_ROUTE.vault.path} className="relative flex justify-center items-center z-100 mx-[-8px]">
            <div className="relative w-full px-10">
              <button type="button" className="button text-black">
                {PAGE_ROUTE.vault.name}
              </button>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full z-10 pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center">
        {/* eslint-disable-next-line */}
        {isMintPage ? renderMintPageMenu() : isDesktop ? renderDesktopMenu() : renderMobileMenu()}
      </div>
    </div>
  );
}
