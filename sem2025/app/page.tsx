'use client';

import React, { useState } from 'react';

// Types for the objects
type Availability = { [key: string]: string[] };
type Student = {
  id: number;
  name: string;
  email: string;
  degree: string;
  hasMembership: boolean;
  availability: Availability;
};

type Location = {
  id: number;
  name: string;
  capacity: number;
  availability: Availability;
};

type CateringOption = {
  name: string;
  location: string;
  priceRange: string;
  distanceToCampus: number;
};

type StudyGroup = {
  id: number;
  day: string;
  timeSlot: string;
  location: Location;
  students: Student[];
};

const page = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [availability, setAvailability] = useState<string>('');
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Sample data for locations
  const locations: Location[] = [
    { id: 1, name: "Library Study Room A", capacity: 8, availability: {"Monday": ["morning", "afternoon"], "Tuesday": ["morning", "afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning", "afternoon"], "Friday": ["morning", "afternoon"] }},
    { id: 2, name: "Computer Lab 101", capacity: 15, availability: {"Monday": ["afternoon"], "Tuesday": ["morning"], "Wednesday": ["morning", "afternoon"], "Thursday": ["afternoon"], "Friday": ["morning"] }},
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let parsedAvailability: Availability = {};
    try {
      parsedAvailability = JSON.parse(availability);
      setError(null); // Reset error on successful parse
    } catch (err) {
      setError('Invalid availability format. Please use a valid JSON format like {"Monday": ["morning", "afternoon"]}');
      return;
    }

    const newStudent = {
      id: parseInt(id),
      name,
      email: `${name.replace(' ', '').toLowerCase()}@university.edu`,
      degree: "Computer Science", // Hardcoded degree for simplicity
      hasMembership: true, // Assume the student has a membership
      availability: parsedAvailability,
    };

    setStudents([...students, newStudent]);

    // Clear form after submission
    setName('');
    setId('');
    setAvailability('');
  };

  const findCommonAvailability = (students: Student[]) => {
    const commonAvailability: { [key: string]: string[] } = {};
    if (students.length > 0) {
      for (const [day, slots] of Object.entries(students[0].availability)) {
        commonAvailability[day] = [...slots];
      }
    }
    for (let i = 1; i < students.length; i++) {
      const student = students[i];
      const daysToCheck = [...Object.keys(commonAvailability)];
      for (const day of daysToCheck) {
        if (!(day in student.availability)) {
          delete commonAvailability[day];
          continue;
        }
        const commonSlots: string[] = [];
        for (const slot of commonAvailability[day]) {
          if (student.availability[day].includes(slot)) {
            commonSlots.push(slot);
          }
        }
        if (commonSlots.length > 0) {
          commonAvailability[day] = commonSlots;
        } else {
          delete commonAvailability[day];
        }
      }
    }
    return commonAvailability;
  };

  const createStudyGroups = () => {
    const studyGroups: StudyGroup[] = [];
    let groupId = 1;

    // Group students by degree (simplified)
    const degreeGroups: { [key: string]: Student[] } = {};
    students.forEach(student => {
      if (!degreeGroups[student.degree]) {
        degreeGroups[student.degree] = [];
      }
      degreeGroups[student.degree].push(student);
    });

    // Create study groups based on common availability
    Object.keys(degreeGroups).forEach(degree => {
      const degreeStudents = [...degreeGroups[degree]];

      while (degreeStudents.length >= 2) {
        const groupStudents = [degreeStudents.shift()!, degreeStudents.shift()!]; // Start with two students
        let groupAvailability = findCommonAvailability(groupStudents);

        // Check if there are common availability
        if (Object.keys(groupAvailability).length === 0) {
          return; // Skip if no common availability
        }

        // Schedule the group and assign a random day/time slot
        const days = Object.keys(groupAvailability);
        const day = days[Math.floor(Math.random() * days.length)];
        const timeSlot = groupAvailability[day][Math.floor(Math.random() * groupAvailability[day].length)];

        // Book location (simplified to first available location)
        const availableLocation = locations.find(location =>
          location.availability[day]?.includes(timeSlot) && location.capacity >= groupStudents.length);

        if (availableLocation) {
          studyGroups.push({
            id: groupId++,
            day,
            timeSlot,
            location: availableLocation,
            students: groupStudents,
          });
        }
      }
    });

    return studyGroups;
  };

  const handleCreateStudyGroups = () => {
    const createdStudyGroups = createStudyGroups();
    setStudyGroups(createdStudyGroups);
  };

  return (
    <div>
      <h1>Join Study Groups</h1>
      
      <form onSubmit={handleSubmit}>
        <h2>Enter your details</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          ID (9 numbers):
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            maxLength={9}
            required
          />
        </label>
        <br />
        <label>
          Availability:
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder='{"Monday": ["morning"], "Wednesday": ["afternoon"]}'
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <br />
      <button onClick={handleCreateStudyGroups}>Create Study Groups</button>

      <br />
      <h2>Study Groups</h2>
      {studyGroups.length > 0 ? (
        <ul>
          {studyGroups.map(group => (
            <li key={group.id}>
              <h3>Group #{group.id}</h3>
              <p>Day: {group.day}</p>
              <p>Time: {group.timeSlot === "morning" ? "9:00 AM - 12:00 PM" : "1:00 PM - 4:00 PM"}</p>
              <p>Location: {group.location.name}</p>
              <p>Students: {group.students.map(student => student.name).join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No study groups created yet.</p>
      )}
    </div>
  );
};

export default page;
