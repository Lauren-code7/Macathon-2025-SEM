// Data structures using JavaScript classes
class Student {
  constructor(id, name, email, degree, hasMembership, availability) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.degree = degree;
    this.hasMembership = hasMembership;
    this.availability = availability; // {"Monday": ["morning", "afternoon"], "Tuesday": ["morning"], ...}
  }
}

class Location {
  constructor(id, name, capacity, availability) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.availability = availability; // {"Monday": ["morning", "afternoon"], "Tuesday": ["morning"], ...}
  }
}

class CateringOption {
  constructor(name, location, priceRange, distanceToCampus) {
    this.name = name;
    this.location = location;
    this.priceRange = priceRange; // "$", "$$", etc.
    this.distanceToCampus = distanceToCampus; // in minutes walking
  }
}

class StudyGroup {
  constructor(id, day, timeSlot, location, students) {
    this.id = id;
    this.day = day;
    this.timeSlot = timeSlot; // "morning" or "afternoon"
    this.location = location;
    this.students = students;
  }
}

// Sample data (in a real system, this would come from a database)
const students = [
  new Student(1, "Alice Smith", "alice@university.edu", "Computer Science", true, 
          {"Monday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning", "afternoon"]}),
  new Student(2, "Bob Johnson", "bob@university.edu", "Computer Science", true, 
          {"Monday": ["afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning"]}),
  new Student(3, "Charlie Brown", "charlie@university.edu", "Biology", true, 
          {"Tuesday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
  new Student(4, "Diana Prince", "diana@university.edu", "Biology", true, 
          {"Monday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
  new Student(5, "Evan Williams", "evan@university.edu", "Physics", true, 
          {"Monday": ["morning", "afternoon"], "Thursday": ["afternoon"], "Friday": ["morning"]}),
  new Student(6, "Fiona Apple", "fiona@university.edu", "Physics", false,  // No membership
          {"Tuesday": ["morning", "afternoon"], "Wednesday": ["morning"], "Friday": ["afternoon"]}),
  new Student(7, "Greg House", "greg@university.edu", "Medicine", true, 
          {"Monday": ["afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning"]}),
  new Student(8, "Helen Troy", "helen@university.edu", "Medicine", true, 
          {"Tuesday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
  new Student(9, "Ivan Drago", "ivan@university.edu", "Computer Science", true, 
          {"Monday": ["morning"], "Wednesday": ["morning", "afternoon"], "Friday": ["morning"]}),
];

const locations = [
  new Location(1, "Library Study Room A", 8, 
           {"Monday": ["morning", "afternoon"], "Tuesday": ["morning", "afternoon"], 
            "Wednesday": ["morning", "afternoon"], "Thursday": ["morning", "afternoon"], 
            "Friday": ["morning", "afternoon"]}),
  new Location(2, "Computer Lab 101", 15, 
           {"Monday": ["afternoon"], "Tuesday": ["morning"], 
            "Wednesday": ["morning", "afternoon"], "Thursday": ["afternoon"], 
            "Friday": ["morning"]}),
  new Location(3, "Science Building Room 305", 10, 
           {"Monday": ["morning"], "Tuesday": ["afternoon"], 
            "Wednesday": ["morning"], "Thursday": ["morning", "afternoon"], 
            "Friday": ["afternoon"]}),
  new Location(4, "Student Union Meeting Room", 20, 
           {"Monday": ["morning", "afternoon"], "Wednesday": ["afternoon"], 
            "Friday": ["morning", "afternoon"]}),
];

const cateringOptions = [
  new CateringOption("Campus Cafe", "Student Union Building", "$", 2),
  new CateringOption("Green Salads", "Science Building", "$$", 0),
  new CateringOption("Pizza Corner", "Off-campus (North)", "$", 5),
  new CateringOption("Sandwich Express", "Library Ground Floor", "$", 1),
  new CateringOption("Healthy Bites", "Sports Complex", "$$", 7),
  new CateringOption("Taco Truck", "Engineering Parking Lot", "$", 3),
];

// Email configuration (replace with actual SMTP settings)
const SMTP_SERVER = "smtp.university.edu";
const SMTP_PORT = 587;
const SENDER_EMAIL = "study.groups@university.edu";
const SENDER_PASSWORD = "password123"; // In a real system, use environment variables

// Helper functions
function verifyMembership(student) {
  /**
   * Check if student has paid for membership
   */
  return student.hasMembership;
}

function findCommonAvailability(students) {
  /**
   * Find days and time slots when all students are available
   */
  const commonAvailability = {};
  
  // Start with the first student's availability
  if (students.length > 0) {
    for (const [day, slots] of Object.entries(students[0].availability)) {
      commonAvailability[day] = [...slots];
    }
  }
  
  // Intersect with each subsequent student's availability
  for (let i = 1; i < students.length; i++) {
    const student = students[i];
    const daysToCheck = [...Object.keys(commonAvailability)];
    
    for (const day of daysToCheck) {
      if (!(day in student.availability)) {
        delete commonAvailability[day];
        continue;
      }
      
      const commonSlots = [];
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
}

function findAvailableLocations(day, timeSlot, groupSize) {
  /**
   * Find locations available for the given day, time slot, and group size
   */
  const availableLocations = [];
  
  for (const location of locations) {
    if (day in location.availability && 
        location.availability[day].includes(timeSlot) && 
        location.capacity >= groupSize) {
      availableLocations.push(location);
    }
  }
  
  return availableLocations;
}

function bookLocation(location, day, timeSlot) {
  /**
   * Book a location for a specific day and time slot
   */
  if (day in location.availability && location.availability[day].includes(timeSlot)) {
    // In a real system, this would update a database
    location.availability[day] = location.availability[day].filter(slot => slot !== timeSlot);
    return true;
  }
  return false;
}

function createStudyGroups() {
  /**
   * Main function to create and allocate study groups
   */
  const studyGroups = [];
  const eligibleStudents = students.filter(s => verifyMembership(s));
  const unallocatedStudents = [...eligibleStudents];
  let groupId = 1;
  
  // Group by degree
  const degreeGroups = {};
  for (const student of eligibleStudents) {
    if (!(student.degree in degreeGroups)) {
      degreeGroups[student.degree] = [];
    }
    degreeGroups[student.degree].push(student);
  }
  
  // Create groups ensuring at least 2 students from the same degree
  for (const [degree, studentsInDegree] of Object.entries(degreeGroups)) {
    // Create a working copy so we don't modify the original degrees list
    const degreeStudents = [...studentsInDegree];
    
    while (degreeStudents.length >= 2) {
      // Start with 2 students from the same degree
      const firstStudent = degreeStudents.shift();
      const secondStudent = degreeStudents.shift();
      
      // Make sure we remove them from unallocatedStudents as well
      const firstIndex = unallocatedStudents.findIndex(s => s.id === firstStudent.id);
      if (firstIndex !== -1) {
        unallocatedStudents.splice(firstIndex, 1);
      }
      
      const secondIndex = unallocatedStudents.findIndex(s => s.id === secondStudent.id);
      if (secondIndex !== -1) {
        unallocatedStudents.splice(secondIndex, 1);
      }
      
      const groupStudents = [firstStudent, secondStudent];
      
      // Try to add more students (up to 6 per group) with compatible schedules
      let groupAvailability = findCommonAvailability(groupStudents);
      
      if (Object.keys(groupAvailability).length === 0) { // If these two students have no common time
        continue;
      }
      
      // Add more students if possible
      const potentialAdditions = [...unallocatedStudents];
      // Shuffle the array (Fisher-Yates algorithm)
      for (let i = potentialAdditions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [potentialAdditions[i], potentialAdditions[j]] = [potentialAdditions[j], potentialAdditions[i]];
      }
      
      for (const student of potentialAdditions) {
        if (groupStudents.length >= 6) { // Limit group size
          break;
        }
        
        // Test if this student can be added
        const testGroup = [...groupStudents, student];
        const testAvail = findCommonAvailability(testGroup);
        
        if (Object.keys(testAvail).length > 0) { // Can add this student
          groupStudents.push(student);
          
          const studentIndex = unallocatedStudents.findIndex(s => s.id === student.id);
          if (studentIndex !== -1) {
            unallocatedStudents.splice(studentIndex, 1);
          }
          
          const degreeIndex = degreeStudents.findIndex(s => s.id === student.id);
          if (degreeIndex !== -1) {
            degreeStudents.splice(degreeIndex, 1);
          }
          
          // Update the common availability
          groupAvailability = testAvail;
        }
      }
      
      // Schedule the group
      if (Object.keys(groupAvailability).length > 0) {
        const days = Object.keys(groupAvailability);
        const day = days[Math.floor(Math.random() * days.length)];
        const timeSlot = groupAvailability[day][Math.floor(Math.random() * groupAvailability[day].length)];
        
        // Find and book location
        const availableLocations = findAvailableLocations(day, timeSlot, groupStudents.length);
        
        if (availableLocations.length > 0) {
          const location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
          if (bookLocation(location, day, timeSlot)) {
            const studyGroup = new StudyGroup(groupId, day, timeSlot, location, groupStudents);
            studyGroups.push(studyGroup);
            groupId++;
          }
        }
      }
    }
  }
  
  // Try to allocate remaining students to existing groups or create new diverse groups
  while (unallocatedStudents.length > 0) {
    const currentStudent = unallocatedStudents.shift();
    let added = false;
    
    // Try to add to existing groups first
    for (const group of studyGroups) {
      if (group.students.length < 6) { // Check if group has space
        const testGroup = [...group.students, currentStudent];
        const testAvail = findCommonAvailability(testGroup);
        
        if (group.day in testAvail && 
            testAvail[group.day].includes(group.timeSlot) && 
            group.location.capacity > group.students.length) {
          group.students.push(currentStudent);
          added = true;
          break;
        }
      }
    }
    
    if (!added && unallocatedStudents.length >= 1) {
      // Try to form a new group with remaining students
      const potentialGroup = [currentStudent];
      let remainingAvail = JSON.parse(JSON.stringify(currentStudent.availability)); // Deep copy
      
      // Make a temporary list to iterate through
      const tempUnallocated = [...unallocatedStudents];
      // Shuffle the array (Fisher-Yates algorithm)
      for (let i = tempUnallocated.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempUnallocated[i], tempUnallocated[j]] = [tempUnallocated[j], tempUnallocated[i]];
      }
      
      // Track which students we actually add so we can remove them later
      const studentsToRemove = [];
      
      for (const student of tempUnallocated) {
        if (potentialGroup.length >= 6) {
          break;
        }
        
        const testGroup = [...potentialGroup, student];
        const testAvail = findCommonAvailability(testGroup);
        
        if (Object.keys(testAvail).length > 0) {
          potentialGroup.push(student);
          remainingAvail = testAvail;
          studentsToRemove.push(student);
        }
      }
      
      // Remove the students we've added
      for (const student of studentsToRemove) {
        const studentIndex = unallocatedStudents.findIndex(s => s.id === student.id);
        if (studentIndex !== -1) { // Safety check
          unallocatedStudents.splice(studentIndex, 1);
        }
      }
      
      if (potentialGroup.length >= 2 && Object.keys(remainingAvail).length > 0) {
        const days = Object.keys(remainingAvail);
        const day = days[Math.floor(Math.random() * days.length)];
        const timeSlot = remainingAvail[day][Math.floor(Math.random() * remainingAvail[day].length)];
        
        const availableLocations = findAvailableLocations(day, timeSlot, potentialGroup.length);
        if (availableLocations.length > 0) {
          const location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
          if (bookLocation(location, day, timeSlot)) {
            const studyGroup = new StudyGroup(groupId, day, timeSlot, location, potentialGroup);
            studyGroups.push(studyGroup);
            groupId++;
            added = true;
          }
        }
      }
    }
  }
  
  return studyGroups;
}

function sendStudentEmail(student, group) {
  /**
   * Send email to student with their group details
   */
  const timeInfo = group.timeSlot === "morning" ? "9:00 AM - 12:00 PM" : "1:00 PM - 4:00 PM";
  
  const subject = `Your Study Group Assignment - Group #${group.id}`;
  
  const body = `
    Hello ${student.name},
    
    You have been successfully assigned to Study Group #${group.id}. Here are the details:
    
    Day: ${group.day}
    Time: ${timeInfo}
    Location: ${group.location.name}
    Group Size: ${group.students.length} students
    
    Your group includes students from the following degrees:
    ${[...new Set(group.students.map(s => s.degree))].join(", ")}
    
    Please arrive 5 minutes before the session starts.
    
    Best regards,
    University Study Group Program
  `;
  
  sendEmail(student.email, subject, body);
}

function sendOrganizerEmail(group) {
  /**
   * Send booking confirmation and catering recommendations to organizers
   */
  const timeInfo = group.timeSlot === "morning" ? "9:00 AM - 12:00 PM" : "1:00 PM - 4:00 PM";
  
  // Find nearby catering options (would be more sophisticated in a real system)
  const shuffledCatering = [...cateringOptions].sort(() => 0.5 - Math.random());
  const recommendedCatering = shuffledCatering.slice(0, Math.min(3, cateringOptions.length));
  
  const subject = `Study Group #${group.id} - Booking Confirmation`;
  
  const body = `
    Study Group #${group.id} has been successfully created:
    
    Day: ${group.day}
    Time: ${timeInfo}
    Location: ${group.location.name}
    Group Size: ${group.students.length}
    
    Student Information:
    ${group.students.map(s => `- ${s.name}, ${s.degree}, ${s.email}`).join("\n")}
    
    Recommended Catering Options:
    ${recommendedCatering.map(c => `- ${c.name} (${c.priceRange}) - ${c.location}, ${c.distanceToCampus} min walking distance`).join("\n")}
    
    Please confirm catering arrangements 24 hours before the session.
  `;
  
  sendEmail(SENDER_EMAIL, subject, body); // Sent to organizers
}

function sendEmail(recipient, subject, body) {
  /**
   * Send an email (For demonstration - in a real system this would connect to SMTP)
   */
  console.log(`\nEMAIL to: ${recipient}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log("-".repeat(50));
  
  // In a real system, you would use code like this with a library like nodemailer:
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD
    }
  });
  
  const mailOptions = {
    from: SENDER_EMAIL,
    to: recipient,
    subject: subject,
    text: body
  };
  
  try {
    transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return false;
  }
  */
}

function main() {
  /**
   * Main function to run the study group allocation system
   */
  console.log("Starting study group allocation process...");
  const studyGroups = createStudyGroups();
  
  console.log(`Created ${studyGroups.length} study groups`);
  
  for (const group of studyGroups) {
    console.log(`\nGroup #${group.id} - ${group.day} (${group.timeSlot})`);
    console.log(`Location: ${group.location.name}`);
    console.log(`Students: ${group.students.map(s => s.name).join(', ')}`);
    
    // Send emails
    for (const student of group.students) {
      sendStudentEmail(student, group);
    }
    
    sendOrganizerEmail(group);
  }
  
  console.log("\nAllocation process completed!");
}

// Run the program
main();