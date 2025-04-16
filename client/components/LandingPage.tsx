"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage(){
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4">
      <div className="flex md:flex-row flex-col items-center justify-center">
          <Image
          className='rounded-full'
          width={40}
          height={40}
           src={'/images/logo.png'} alt={'main-logo'}/>
        </div>
        <div className="flex text-sm gap-x-2">
          <Button className="px-2 py-2"><Link href='/Dashboard'>Dashboard</Link></Button>
          <Button className="px-2 py-2 bg-[#111c3d] text-white rounded-md">
          <Link href='/dashboard'>Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className=" mx-auto text-center mt-[170px] px-4">
        <motion.h1 
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Manager Your Expense
        </motion.h1>
        
        <motion.h2 
          className="text-xl font-bold text-[#111c3d] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Control your Money
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 text-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Smart Budget Allocation System – Automated public budget allocation using data
        </motion.p>
        
        <motion.button 
          className="px-8 py-3 bg-[#111c3d] text-white rounded-md text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
        <Link href='/dashboard'>
        Get Started
        </Link>
        </motion.button>
      </div>

      {/* Dashboard Preview */}
      <motion.div 
        className="md:w-[800px] mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex items-center mb-6">
          <FileText className=" h-8 text-[#111c3d] mr-2" />
          <span className="text-sm font-bold">Budget-DashBoard</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-6">
            <h3 className="text-sm font-bold">Hi, user</h3>
          </div>
          
          <div className="flex md:grid md:grid-cols-3 md:gap-4 flex-col gap-2 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600">Total Budget</h4>
              <p className="text-xl font-bold">₹650000</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600">Total Spend</h4>
              <p className="text-2xl font-bold">₹240000</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600">No of Budgets</h4>
              <p className="text-2xl font-bold">20</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
