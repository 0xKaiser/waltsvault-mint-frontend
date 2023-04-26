import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LOGO from '../assets/images/logo.svg';
import { About } from './About';
import { Footer } from './Footer';
import { Menu } from './Menu';
import { MyWork } from './Work';

export const App = () => (
  <BrowserRouter>
    <div className="h-full flex flex-col justify-center items-center my-[38px] bg-white">
      <img alt="logo" className="w-[261px]" src={LOGO} />
      <Menu />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<MyWork />} />
      </Routes>
      <Footer />
    </div>
  </BrowserRouter>
);
