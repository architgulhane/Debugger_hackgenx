import React, { useState } from 'react';
import SignIn from "../components/SIgnIn";
import Register from "../components/Register";
import Home from './Home';
import Visualization from './Visualization'; 
import Ledger from './Ledger';
import Entry from './Entry';
import AdminHome from './AdminHome';
import AdminVisualization from './AdminVisualization';
import AdminLedger from './AdminLedger';
import AdminEntry from './AdminEntry';
import "../../global.css";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState('SignIn');

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <>
      {/* Auth Screens */}
      {currentScreen === 'SignIn' && <SignIn navigateTo={navigateTo} />}
      {currentScreen === 'Register' && <Register navigateTo={navigateTo} />}
      
      {/* User Screens */}
      {currentScreen === 'Home' && <Home navigateTo={navigateTo} />}
      {currentScreen === 'Visualization' && <Visualization navigateTo={navigateTo} />}
      {currentScreen === 'Ledger' && <Ledger navigateTo={navigateTo} />} 
      {currentScreen === 'Entry' && <Entry navigateTo={navigateTo} />}
      
      {/* Admin Screens */}
      {currentScreen === 'AdminHome' && <AdminHome navigateTo={navigateTo} />}
      {currentScreen === 'AdminVisualization' && <AdminVisualization navigateTo={navigateTo} />}
      {currentScreen === 'AdminLedger' && <AdminLedger navigateTo={navigateTo} />}
      {currentScreen === 'AdminEntry' && <AdminEntry navigateTo={navigateTo} />}
    </>
  );
}