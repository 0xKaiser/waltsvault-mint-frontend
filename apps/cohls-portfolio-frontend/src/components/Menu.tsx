import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'WORK', link: '/' },
  { label: 'ABOUT', link: '/about' },
];

export const Menu = () => {
  const { pathname } = useLocation();

  return (
    <div className="h-[50px] w-full flex justify-center items-center">
      {menuItems.map(menuItem => (
        <Link to={menuItem.link} key={menuItem.label} className="ml-[28px] first:ml-0">
          <span className={`text-h1 ml-[20px] ${pathname === menuItem.link ? '' : 'text-grey'}`}>{menuItem.label}</span>
        </Link>
      ))}
    </div>
  );
};
