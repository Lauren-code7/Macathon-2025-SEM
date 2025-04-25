'use client';

import React, { useState, useEffect } from 'react';

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [studentInfo, setStudentInfo] = useState({
    availability: { 
      Monday: [], 
      Tuesday: [], 
      Wednesday: [],
      Thursday: [],
      Friday: []
    },
  });

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: value ? [value] : [],
      },
    }));
  };

  const submitStudentInfo = () => {
    console.log(studentInfo);
    alert('Your SEM2025 preferences have been submitted');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Top Timetables Home Button */}
      <div className="bg-gray-100 py-1 px-4 flex justify-end">
        <button className="bg-blue-900 text-white px-3 py-1 text-sm">
          Timetables home
        </button>
      </div>

      {/* Allocate+ Header */}
      <div className="bg-blue-900 text-white flex justify-between items-center px-4 py-2">
        <div className="text-2xl font-bold">
          Allocate<span className="align-super text-sm">+</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-white hover:underline">Home</a>
          <a href="#" className="text-white hover:underline">Timetable</a>
          <a href="#" className="text-white hover:underline">Preferences</a>
          <a href="#" className="text-white hover:underline">Planner</a>
          <a href="#" className="text-white hover:underline">Help</a>
          <a href="#" className="text-white hover:underline">Logout</a>
        </div>
      </div>

      {/* User Info Panel */}
      <div className="bg-gray-100 border border-gray-300 m-4 p-3">
        <div className="flex flex-col text-gray-800 font-medium">
          <div>Student name</div>
          <div>Email</div>
          <div>Degree number</div>
        </div>
        <div className="flex mt-3">
          <div className="bg-green-500 text-white px-2 py-1 text-sm mr-2 flex items-center">
            <span className="font-bold mr-1">0</span> Allocated
          </div>
          <div className="bg-yellow-500 text-white px-2 py-1 text-sm mr-2 flex items-center">
            <span className="font-bold mr-1">0</span> Pending
          </div>
          <div className="bg-red-500 text-white px-2 py-1 text-sm flex items-center">
            <span className="font-bold mr-1">1</span> Not Allocated
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex m-4">
        {/* Left Column */}
        <div className="w-1/3 mr-4">
          <div className="border border-gray-300">
            <div className="bg-blue-800 text-white p-2 flex justify-between items-center">
              <span>Enrollment</span>
              <div className="flex items-center">
                <span className="text-xs mr-2">Sort by: Alpha</span>
                <span>▼</span>
              </div>
            </div>
            
            <div className="p-2 border-b border-gray-300 bg-blue-100">
              <div className="font-bold text-blue-900">SEM2025_CL_S1_ON-CAMPUS</div>
              <div className="text-blue-900">SOCIAL ENGAGEMENT MONASH</div>
            </div>
            
            <div className="pl-4 pr-2 py-1 border-b border-gray-200 flex items-center">
              <span className="mr-2 text-yellow-400" >►</span>
              <span className="text-gray-800">Meeting</span>
              <span className="text-xs text-gray-700 ml-2">(READ ONLY)</span>
              <span className="ml-auto flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 font-bold">!</span>
            </div>
          </div>
          
          <div className="border border-gray-300 mt-4">
            <div className="bg-blue-800 text-white p-2">
              Search
            </div>
            <div className="p-2">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Search code or description" 
                  className="border border-gray-300 p-1 w-full text-gray-800"
                />
                <button className="bg-gray-200 border border-gray-300 px-2">
                  🔍
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Main Display */}
        <div className="w-2/3">
          <div className="bg-blue-800 text-white p-2">
            <div>SEM2025_CL_S1_ON-CAMPUS</div>
            <div>SOCIAL ENGAGEMENT MONASH</div>
            <div>Meeting</div>
          </div>
          
          <div className="border border-gray-300 mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 text-gray-800">Activity</th>
                  <th className="p-2 text-gray-800">Day</th>
                  <th className="p-2 text-gray-800">Time</th>
                  <th className="p-2 text-gray-800">Timezone</th>
                  <th className="p-2 text-gray-800">Free</th>
                  <th className="p-2 text-gray-800">Campus</th>
                  <th className="p-2 text-gray-800">Location</th>
                  <th className="p-2 text-gray-800">Staff</th>
                  <th className="p-2 text-gray-800">Duration</th>
                  <th className="p-2 text-gray-800">Weeks</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-b border-gray-300">
                  <td className="p-2">01_Meeting</td>
                  <td className="p-2">Mon</td>
                  <td className="p-2">09:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">1</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">02_Meeting</td>
                  <td className="p-2">Mon</td>
                  <td className="p-2">13:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">12</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">03_Meeting</td>
                  <td className="p-2">Tue</td>
                  <td className="p-2">09:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">5</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">04_Meeting</td>
                  <td className="p-2">Tue</td>
                  <td className="p-2">13:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">8</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">05_Meeting</td>
                  <td className="p-2">Wed</td>
                  <td className="p-2">09:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">7</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">06_Meeting</td>
                  <td className="p-2">Wed</td>
                  <td className="p-2">13:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">9</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">07_Meeting</td>
                  <td className="p-2">Thu</td>
                  <td className="p-2">09:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">4</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">08_Meeting</td>
                  <td className="p-2">Thu</td>
                  <td className="p-2">13:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">3</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2">09_Meeting</td>
                  <td className="p-2">Fri</td>
                  <td className="p-2">09:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">2</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
                <tr>
                  <td className="p-2">10_Meeting</td>
                  <td className="p-2">Fri</td>
                  <td className="p-2">13:00</td>
                  <td className="p-2">Australia/Melbourne</td>
                  <td className="p-2">6</td>
                  <td className="p-2">Clayton</td>
                  <td className="p-2">CL_Eng-33_G02</td>
                  <td className="p-2"></td>
                  <td className="p-2">3 hrs</td>
                  <td className="p-2">1-12</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Register section */}
          <div className="mt-6 border border-gray-300">
            <div className="bg-blue-800 text-white p-2">
              <div className="text-lg font-medium">Register for SEM2025</div>
            </div>
            
            <div className="p-4">
              <div className="bg-blue-50 border border-blue-300 p-3 mb-4 text-sm">
                <p className="text-gray-800">Please select your preferred meeting sessions for SEM2025. Morning sessions run from 9:00-12:00 and afternoon sessions run from 13:00-16:00.</p>
              </div>
              
              <div className="flex flex-wrap -mx-2">
                {/* Monday Preferences */}
                <div className="w-full md:w-1/2 lg:w-1/5 px-2 mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Monday
                  </label>
                  <select
                    name="Monday"
                    value={studentInfo.availability.Monday[0] || ""}
                    onChange={handleAvailabilityChange}
                    className="w-full p-2 border border-gray-300 rounded-sm bg-white text-gray-800"
                  >
                    <option value="">Not Available</option>
                    <option value="morning">Morning (9:00-12:00)</option>
                    <option value="afternoon">Afternoon (13:00-16:00)</option>
                  </select>
                </div>

                {/* Tuesday Preferences */}
                <div className="w-full md:w-1/2 lg:w-1/5 px-2 mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Tuesday
                  </label>
                  <select
                    name="Tuesday"
                    value={studentInfo.availability.Tuesday[0] || ""}
                    onChange={handleAvailabilityChange}
                    className="w-full p-2 border border-gray-300 rounded-sm bg-white text-gray-800"
                  >
                    <option value="">Not Available</option>
                    <option value="morning">Morning (9:00-12:00)</option>
                    <option value="afternoon">Afternoon (13:00-16:00)</option>
                  </select>
                </div>

                {/* Wednesday Preferences */}
                <div className="w-full md:w-1/2 lg:w-1/5 px-2 mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Wednesday
                  </label>
                  <select
                    name="Wednesday"
                    value={studentInfo.availability.Wednesday[0] || ""}
                    onChange={handleAvailabilityChange}
                    className="w-full p-2 border border-gray-300 rounded-sm bg-white text-gray-800"
                  >
                    <option value="">Not Available</option>
                    <option value="morning">Morning (9:00-12:00)</option>
                    <option value="afternoon">Afternoon (13:00-16:00)</option>
                  </select>
                </div>
                
                {/* Thursday Preferences */}
                <div className="w-full md:w-1/2 lg:w-1/5 px-2 mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Thursday
                  </label>
                  <select
                    name="Thursday"
                    value={studentInfo.availability.Thursday[0] || ""}
                    onChange={handleAvailabilityChange}
                    className="w-full p-2 border border-gray-300 rounded-sm bg-white text-gray-800"
                  >
                    <option value="">Not Available</option>
                    <option value="morning">Morning (9:00-12:00)</option>
                    <option value="afternoon">Afternoon (13:00-16:00)</option>
                  </select>
                </div>
                
                {/* Friday Preferences */}
                <div className="w-full md:w-1/2 lg:w-1/5 px-2 mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Friday
                  </label>
                  <select
                    name="Friday"
                    value={studentInfo.availability.Friday[0] || ""}
                    onChange={handleAvailabilityChange}
                    className="w-full p-2 border border-gray-300 rounded-sm bg-white text-gray-800"
                  >
                    <option value="">Not Available</option>
                    <option value="morning">Morning (9:00-12:00)</option>
                    <option value="afternoon">Afternoon (13:00-16:00)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={submitStudentInfo}
                  className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-800"
                >
                  Submit Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;