"use client"
import { useState } from 'react';
import { FiHome, FiBarChart2, FiBook, FiEdit, FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

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

const Entry = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [formData, setFormData] = useState({
    Ministry: 'Defence',
    Priority_Level: 'Low',
    Projects_Count: '15',
    Region_Impact: 'National',
    Dev_Index: '0.45',
    expected_budget: '200',
    Prev_Budget: '52000',
    GDP_Impact: '2.3'
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState({
    name: '',
    options: [] as string[],
  });

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Budget form submitted successfully!');
    navigateTo('Home');
  };

  const openDropdown = (name: string, options: string[]) => {
    setCurrentDropdown({ name, options });
    setModalVisible(true);
  };

  const selectItem = (item: string) => {
    handleChange(currentDropdown.name, item);
    setModalVisible(false);
  };

  const CustomDropdown = ({ 
    label, 
    value, 
    name,
    options 
  }: { 
    label: string, 
    value: string, 
    name: string,
    options: string[] 
  }) => {
    return (
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div 
          className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg cursor-pointer"
          onClick={() => openDropdown(name, options)}
        >
          <span className="text-gray-800">{value}</span>
          <FiChevronDown className="text-gray-500" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow p-5">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Budget Allocation Form</h1>
          <p className="text-center text-gray-500 mb-6">Fill in the details for budget allocation</p>

          {/* Ministry Dropdown */}
          <CustomDropdown
            label="Ministry"
            value={formData.Ministry}
            name="Ministry"
            options={MINISTRY_OPTIONS}
          />

          {/* Priority Level Dropdown */}
          <CustomDropdown
            label="Priority Level"
            value={formData.Priority_Level}
            name="Priority_Level"
            options={PRIORITY_LEVELS}
          />

          {/* Projects Count Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Projects</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.Projects_Count}
              onChange={(e) => handleChange('Projects_Count', e.target.value)}
              placeholder="Enter number of projects"
            />
          </div>

          {/* Region Impact Dropdown */}
          <CustomDropdown
            label="Region Impact"
            value={formData.Region_Impact}
            name="Region_Impact"
            options={REGION_IMPACT_OPTIONS}
          />

          {/* Development Index Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Development Index (0-1)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.Dev_Index}
              onChange={(e) => handleChange('Dev_Index', e.target.value)}
              placeholder="Enter development index"
            />
          </div>

          {/* Expected Budget Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Budget (Cr)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.expected_budget}
              onChange={(e) => handleChange('expected_budget', e.target.value)}
              placeholder="Enter expected budget"
            />
          </div>

          {/* Previous Budget Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Previous Budget (Cr)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.Prev_Budget}
              onChange={(e) => handleChange('Prev_Budget', e.target.value)}
              placeholder="Enter previous budget"
            />
          </div>

          {/* GDP Impact Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">GDP Impact (%)</label>
            <input
              type="number"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.GDP_Impact}
              onChange={(e) => handleChange('GDP_Impact', e.target.value)}
              placeholder="Enter GDP impact"
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            onClick={handleSubmit}
          >
            Submit Budget Request
          </button>
        </div>
      </div>
      
      {/* Dropdown Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-xl max-h-[70vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Select {currentDropdown.name.replace('_', ' ')}
              </h2>
              <button onClick={() => setModalVisible(false)}>
                <FiX className="text-gray-500 text-xl" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {currentDropdown.options.map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  onClick={() => selectItem(item)}
                >
                  <span className="text-gray-800">{item}</span>
                  {formData[currentDropdown.name as keyof typeof formData] === item && (
                    <FiCheck className="text-blue-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-3 bg-white border-t border-gray-200">
        <button 
          onClick={() => navigateTo('Home')} 
          className="flex flex-col items-center text-gray-500"
        >
          <FiHome className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => navigateTo('Visualization')} 
          className="flex flex-col items-center text-gray-500"
        >
          <FiBarChart2 className="text-xl" />
          <span className="text-xs mt-1">Visualization</span>
        </button>
        <button 
          onClick={() => navigateTo('Ledger')} 
          className="flex flex-col items-center text-gray-500"
        >
          <FiBook className="text-xl" />
          <span className="text-xs mt-1">Ledger</span>
        </button>
        <button className="flex flex-col items-center text-blue-500">
          <FiEdit className="text-xl" />
          <span className="text-xs mt-1 font-medium">Entry</span>
        </button>
      </div>
    </div>
  );
};

export default Entry;