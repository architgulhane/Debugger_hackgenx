"use client";

import { DashboardShell } from "../../../components/dashboard-shell";
import LoadingScreen from '../../../components/loading';
import { useState } from 'react';

import axios from 'axios';


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


const BUDGET_ALLOCATION_OPTIONS = ['Infrastructure', 'Technology', 'Healthcare', 'Education', 'Defense', 'Agriculture'];


export default function ScenariosPage() {
  const [formData, setFormData] = useState({
    ministry: '',
    priority: '',
    regionImpact: '',

    description: '',
    budgetAllocation: '',
    amount: '',
    prevBudget: '',
    prevBudgetCr: '',
    developmentIndex: ''
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mappedPayload = {
      input: {
        Dev_Index: formData.developmentIndex === 'High' ? 0 : formData.developmentIndex === 'Medium' ? 1 : 2,
        "GDP_Impact (%)": 34,
        Ministry: MINISTRY_CODE_MAP[formData.ministry],
        "Prev_Budget (Cr)": parseFloat(formData.prevBudgetCr || 0),
        Priority_Level: PRIORITY_LEVEL_MAP[formData.priority],
        Projects_Count: 10,
        Region_Impact: REGION_IMPACT_MAP[formData.regionImpact],
        expected_budget: parseFloat(formData.amount || 0),
      }
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", mappedPayload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Prediction Response:", response.data);
      alert(`Prediction Success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Axios Error:", error);
      alert("An error occurred while submitting the request.");
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black-600">Fund Requests</h1>
          <p className="text-muted-foreground text-lg">
            Simulate different budget Requests and analyze their potential Chances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <label htmlFor="ministry" className="block text-lg font-semibold text-gray-800">Ministry</label>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="ministry" className="block text-sm font-medium text-gray-700">Ministry</label>
            <select
              id="ministry"
              name="ministry"
              value={formData.ministry}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Ministry</option>
              {MINISTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>

            <label htmlFor="priority" className="block text-lg font-semibold text-gray-800">Priority Level</label>

            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"

              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Priority</option>
              {PRIORITY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="regionImpact" className="block text-lg font-semibold text-gray-800">Region Impact</label>
            <label htmlFor="regionImpact" className="block text-sm font-medium text-gray-700">Region Impact</label>
            <select
              id="regionImpact"
              name="regionImpact"
              value={formData.regionImpact}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"

              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Region Impact</option>
              {REGION_IMPACT_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budgetExpected" className="block text-lg font-semibold text-gray-800">Budget Expected</label>
            <select
              id="budgetAllocation"
              name="budgetAllocation"
              value={formData.budgetAllocation}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select Budget Expected</option>
              {BUDGET_ALLOCATION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-lg font-semibold text-gray-800">Requested Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter the requested amount"
            />
          </div>

          <div>
            <label htmlFor="prevBudgetCr" className="block text-lg font-semibold text-gray-800">Previous Budget (Cr)</label>
            <input
              type="number"
              id="prevBudgetCr"
              name="prevBudgetCr"
              value={formData.prevBudgetCr}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter the previous budget in crores"
            />
          </div>

          <div>
            <label htmlFor="developmentIndex" className="block text-lg font-semibold text-gray-800">Development Index</label>
            <select
              id="developmentIndex"
              name="developmentIndex"
              value={formData.developmentIndex}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select Development Index</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-gray-800">Description</label>

            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

              placeholder="Provide a brief description of the fund request"
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 float-right"
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
