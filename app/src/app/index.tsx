import React, { useState } from 'react';
import SignIn from "../components/SIgnIn";
import Home from './Home';
import Visualization from './Visualization'; 
import Ledger from './Ledger';
import Entry from './Entry';
import "../../global.css";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState('SignIn');

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <>
      {currentScreen === 'SignIn' && <SignIn navigateTo={navigateTo} />}
      {currentScreen === 'Home' && <Home navigateTo={navigateTo} />}
      {currentScreen === 'Visualization' && <Visualization navigateTo={navigateTo} />}
      {currentScreen === 'Ledger' && <Ledger navigateTo={navigateTo} />} 
      {currentScreen === 'Entry' && <Entry navigateTo={navigateTo} />} 
    </>
  );
}