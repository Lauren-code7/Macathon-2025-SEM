'use client';

import React, { useState } from 'react';

const page = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    studentId: '',
    availability: { Monday: [], Tuesday: [], Wednesday: [] },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: value.split(','),
      },
    }));
  };

  const submitStudentInfo = () => {
    // Handle submitting student info (e.g., saving to state, or calling an API)
    console.log(studentInfo);
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0', // Light grey background for better contrast
        minHeight: '100vh', // Ensures the background covers the full height
      }}
    >
      <div
        id="outer-container"
        style={{
          position: 'absolute',
          top: '20px',
          bottom: '0',
          width: '100%',
          padding: '30px',
          backgroundColor: '#ffffff', // White background for the form
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds some shadow for depth
        }}
      >
        <h1 style={{ color: '#2C7DAF', marginBottom: '20px' }}>Join a Study Group</h1>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="name"
            style={{ display: 'block', fontSize: '16px', color: '#333' }} // Dark text
          >
            Your Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={studentInfo.name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9', // Light background for input fields
              color: '#333', // Dark text inside the input fields
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="studentId"
            style={{ display: 'block', fontSize: '16px', color: '#333' }}
          >
            Student ID (9 digits):
          </label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            value={studentInfo.studentId}
            onChange={handleInputChange}
            pattern="\d{9}"
            maxLength={9}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              color: '#333',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="availability"
            style={{ display: 'block', fontSize: '16px', color: '#333' }}
          >
            Select your availability:
          </label>
          <select
            name="Monday"
            value={studentInfo.availability.Monday.join(',')}
            onChange={handleAvailabilityChange}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              color: '#333',
            }}
          >
            <option value="">Select Monday</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </select>

          <select
            name="Tuesday"
            value={studentInfo.availability.Tuesday.join(',')}
            onChange={handleAvailabilityChange}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              color: '#333',
            }}
          >
            <option value="">Select Tuesday</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </select>

          <select
            name="Wednesday"
            value={studentInfo.availability.Wednesday.join(',')}
            onChange={handleAvailabilityChange}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              color: '#333',
            }}
          >
            <option value="">Select Wednesday</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </select>
        </div>

        <button
          onClick={submitStudentInfo}
          style={{
            backgroundColor: '#2C7DAF',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default page;
