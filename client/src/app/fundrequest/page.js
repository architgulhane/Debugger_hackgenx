"use client";

import { DashboardShell } from "../../../components/dashboard-shell";
import LoadingScreen from '../../../components/loading';
import { useState } from 'react';

const MINISTRY_CODE_MAP = {
  'Defence': '1',
  'Finance': '2',
  'Home Affairs': '3',
  'Education': '4',
  'Health': '5',
  'Agriculture': '6',
  'Railways': '7',
  'Commerce': '9'
};

const PRIORITY_LEVEL_MAP = {
  'High': '0',
  'Medium': '5',
  'Low': '9'
};

const REGION_IMPACT_MAP = {
  'Local': '0',
  'State': '1',
  'Regional': '2',
  'National': '3',
  'International': '4'
};

const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const REGION_IMPACT_OPTIONS = ['Local', 'State', 'Regional', 'National', 'International'];
const MINISTRY_OPTIONS = [
  'Defence', 
  'Finance', 
  'Home Affairs', 
  'Education', 
  'Health', 
  'Agriculture', 
  'Railways', 
  'Commerce'
];

export default function ScenariosPage() {
  const [formData, setFormData] = useState({
    ministry: '',
    priority: '',
    regionImpact: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fund Requests</h1>
          <p className="text-muted-foreground">
            Simulate different budget Requests and analyze their potential Chances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="ministry" className="block text-sm font-medium text-gray-700">Ministry</label>
            <select
              id="ministry"
              name="ministry"
              value={formData.ministry}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Ministry</option>
              {MINISTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Priority</option>
              {PRIORITY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="regionImpact" className="block text-sm font-medium text-gray-700">Region Impact</label>
            <select
              id="regionImpact"
              name="regionImpact"
              value={formData.regionImpact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Region Impact</option>
              {REGION_IMPACT_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Provide a brief description of the fund request"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-black-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Request
          </button>
        </form>

        <LoadingScreen />
      </div>
    </DashboardShell>
  );
}
