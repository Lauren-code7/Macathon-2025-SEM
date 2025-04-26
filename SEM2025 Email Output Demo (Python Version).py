#<<<<<<< Updated upstream
#Updated upstream

#Coding Program for Macathon 2025 
#A system in which students pick dates they are available from a morning or afternoon time during the week on Allocate+. 
#This will then take this inofrmation and the relevant information stored in Monash WES (Name, Degree, Membership information, ID and email) to assign them
#to a group that fits their availability, but has at least 1 other member from their degree.
#Emails are then sent to the student with the amount of people in their group,and the date and time of their weekly meeting along with the location on 
#campus, which is chosen from a list and booked by the system. Another email is sent to the SEM coordinators to inform them of any bookings made, the 
#groups and their members and some ideas for catering based on time to get to them and cost. 

#Authors: Lauren Hermann and Fatima Baghdadi
#Date Updated: 25/04/2025

import datetime
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dataclasses import dataclass
from typing import List, Dict, Set, Tuple

# Data structures
@dataclass
class Student:
    id: int
    name: str
    email: str
    degree: str
    has_membership: bool
    availability: Dict[str, List[str]]  # {"Monday": ["morning", "afternoon"], "Tuesday": ["morning"], ...}

#=======
import datetime
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dataclasses import dataclass
from typing import List, Dict, Set, Tuple

# Data structures
@dataclass
class Student:
    id: int
    name: str
    email: str
    degree: str
    has_membership: bool
    availability: Dict[str, List[str]]  # {"Monday": ["morning", "afternoon"], "Tuesday": ["morning"], ...}

#>>>>>>> Stashed changes
@dataclass
class Location:
    id: int
    name: str
    capacity: int
    availability: Dict[str, List[str]]  # {"Monday": ["morning", "afternoon"], "Tuesday": ["morning"], ...}
#<<<<<<< Updated upstream

@dataclass
class CateringOption:
    name: str
    location: str
    price_range: str  # "$", "$$", etc.
    walking_times: Dict[str, float]  # location_name -> walking time in minutes

@dataclass
class StudyGroup:
    id: int
    day: str
    time_slot: str  # "morning" or "afternoon"
    location: Location
    students: List[Student]
    
# Sample data (in a real system, this would come from a database)
students = [
    Student(1, "Alice Smith", "asmith0001@student.monash.edu", "Computer Science", True, 
            {"Monday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning", "afternoon"]}),
    Student(2, "Bob Johnson", "bjohnson0002@student.monash.edu", "Computer Science", True, 
            {"Monday": ["afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning"]}),
    Student(3, "Charlie Brown", "cbrown0003@student.monash.edu", "Biology", True, 
            {"Tuesday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
    Student(4, "Diana Prince", "dprince0004@student.monash.edu", "Biology", True, 
            {"Monday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
    Student(5, "Evan Williams", "ewilliams0005@student.monash.edu", "Physics", True, 
            {"Monday": ["morning", "afternoon"], "Thursday": ["afternoon"], "Friday": ["morning"]}),
    Student(6, "Fiona Apple", "fapple0006@student.monash.edu", "Physics", False,  # No membership
            {"Tuesday": ["morning", "afternoon"], "Wednesday": ["morning"], "Friday": ["afternoon"]}),
    Student(7, "Greg House", "ghouse0007@student.monash.edu", "Medicine", True, 
            {"Monday": ["afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning"]}),
    Student(8, "Helen Troy", "htroy0008@student.monash.edu", "Medicine", True, 
            {"Tuesday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
    Student(9, "Ivan Drago", "idrago0009@student.monash.edu", "Computer Science", True, 
            {"Monday": ["morning"], "Wednesday": ["morning", "afternoon"], "Friday": ["morning"]}),
]

locations = [
    Location(1, "C1 Leacture Theatre", 8, 
             {"Monday": ["morning", "afternoon"], "Tuesday": ["morning", "afternoon"], 
              "Wednesday": ["morning", "afternoon"], "Thursday": ["morning", "afternoon"], 
              "Friday": ["morning", "afternoon"]}),
    Location(2, "Matherson Collaberative room", 15, 
             {"Monday": ["afternoon"], "Tuesday": ["morning"], 
              "Wednesday": ["morning", "afternoon"], "Thursday": ["afternoon"], 
              "Friday": ["morning"]}),
    Location(3, "LTB G29", 10, 
             {"Monday": ["morning"], "Tuesday": ["afternoon"], 
              "Wednesday": ["morning"], "Thursday": ["morning", "afternoon"], 
              "Friday": ["afternoon"]}),
    Location(4, "LTB G30", 20, 
             {"Monday": ["morning", "afternoon"], "Wednesday": ["afternoon"], 
              "Friday": ["morning", "afternoon"]}),
]

catering_options = [
    CateringOption("GYG", "Campus Centre", "$", {
        "C1 Leacture Theatre": 2,
        "Matherson Collaberative room": 4,
        "LTB G29": 6,
        "LTB G30": 6,
    }),
    CateringOption("Subway", "Campus Centre", "$$", {
        "C1 Leacture Theatre": 2,
        "Matherson Collaberative room": 4,
        "LTB G29": 6,
        "LTB G30": 6,
    }),
    CateringOption("Rolled", "Campus Centre", "$", {
        "C1 Leacture Theatre": 2,
        "Matherson Collaberative room": 4,
        "LTB G29": 6,
        "LTB G30": 6,
    }),
    CateringOption("Sandwich Express", "Library Ground Floor", "$", {
        "C1 Leacture Theatre": 1,
        "Matherson Collaberative room": 2,
        "LTB G29": 4,
        "LTB G30": 3,
    }),
    CateringOption("Healthy Bites", "Sports Complex", "$$", {
        "C1 Leacture Theatre": 7,
        "Matherson Collaberative room": 10,
        "LTB G29": 9,
        "LTB G30": 8,
    }),
    CateringOption("Taco Truck", "Engineering Parking Lot", "$", {
        "C1 Leacture Theatre": 3,
        "Matherson Collaberative room": 5,
        "LTB G29": 2,
        "LTB G30": 2,
    }),
]

# Email configuration (replace with actual SMTP settings)
SMTP_SERVER = "smtp.monash.edu"
SMTP_PORT = 587
SENDER_EMAIL = "study.groups@sem.org.au"
SENDER_PASSWORD = "password123"  # In a real system, use environment variables

def verify_membership(student: Student) -> bool:
    """Check if student has paid for membership"""
    return student.has_membership

def find_common_availability(students: List[Student]) -> Dict[str, List[str]]:
    """Find days and time slots when all students are available"""
    common_availability = {}
    
    # Start with the first student's availability
    if students:
        for day, slots in students[0].availability.items():
            common_availability[day] = slots.copy()
    
    # Intersect with each subsequent student's availability
    for student in students[1:]:
        for day in list(common_availability.keys()):
            if day not in student.availability:
                common_availability.pop(day)
                continue
                
            common_slots = []
            for slot in common_availability[day]:
                if slot in student.availability[day]:
                    common_slots.append(slot)
                    
            if common_slots:
                common_availability[day] = common_slots
            else:
                common_availability.pop(day)
                
    return common_availability

def find_available_locations(day: str, time_slot: str, group_size: int) -> List[Location]:
    """Find locations available for the given day, time slot, and group size"""
    available_locations = []
    
    for location in locations:
        if (day in location.availability and 
            time_slot in location.availability[day] and 
            location.capacity >= group_size):
            available_locations.append(location)
            
    return available_locations

def book_location(location: Location, day: str, time_slot: str) -> bool:
    """Book a location for a specific day and time slot"""
    if day in location.availability and time_slot in location.availability[day]:
        # In a real system, this would update a database
        location.availability[day].remove(time_slot)
        return True
    return False

def create_study_groups() -> List[StudyGroup]:
    """Main function to create and allocate study groups"""
    study_groups = []
    eligible_students = [s for s in students if verify_membership(s)]
    unallocated_students = eligible_students.copy()
    group_id = 1
    
    # Group by degree
    degree_groups = {}
    for student in eligible_students:
        if student.degree not in degree_groups:
            degree_groups[student.degree] = []
        degree_groups[student.degree].append(student)
    
    # Create groups ensuring at least 2 students from the same degree
    for degree, students_in_degree in degree_groups.items():
        # Create a working copy so we don't modify the original degrees list
        degree_students = students_in_degree.copy()
        
        while len(degree_students) >= 2:
            # Start with 2 students from the same degree
            first_student = degree_students.pop(0)
            second_student = degree_students.pop(0)
            
            # Make sure we remove them from unallocated_students as well
            if first_student in unallocated_students:
                unallocated_students.remove(first_student)
            if second_student in unallocated_students:
                unallocated_students.remove(second_student)
            
            group_students = [first_student, second_student]
            
            # Try to add more students (up to 6 per group) with compatible schedules
            common_avail = find_common_availability(group_students)
            
            if not common_avail:  # If these two students have no common time
                continue
                
            # Add more students if possible
            potential_additions = unallocated_students.copy()
            random.shuffle(potential_additions)  # Mix it up a bit
            
            for student in potential_additions:
                if len(group_students) >= 6:  # Limit group size
                    break
                    
                # Test if this student can be added
                test_group = group_students + [student]
                test_avail = find_common_availability(test_group)
                
                if test_avail:  # Can add this student
                    group_students.append(student)
                    unallocated_students.remove(student)
                    if student in degree_students:
                        degree_students.remove(student)
                    common_avail = test_avail
            
            # Schedule the group
            if common_avail:
                day = random.choice(list(common_avail.keys()))
                time_slot = random.choice(common_avail[day])
                
                # Find and book location
                available_locations = find_available_locations(day, time_slot, len(group_students))
                
                if available_locations:
                    location = random.choice(available_locations)
                    if book_location(location, day, time_slot):
                        study_group = StudyGroup(group_id, day, time_slot, location, group_students)
                        study_groups.append(study_group)
                        group_id += 1
    
    # Try to allocate remaining students to existing groups or create new diverse groups
    while unallocated_students:
        current_student = unallocated_students.pop(0)
        added = False
        
        # Try to add to existing groups first
        for group in study_groups:
            if len(group.students) < 6:  # Check if group has space
                test_group = group.students + [current_student]
                test_avail = find_common_availability(test_group)
                
                if (group.day in test_avail and 
                    group.time_slot in test_avail[group.day] and
                    group.location.capacity > len(group.students)):
                    group.students.append(current_student)
                    added = True
                    break
        
        if not added and len(unallocated_students) >= 1:
            # Try to form a new group with remaining students
            potential_group = [current_student]
            common_avail = current_student.availability.copy()
            
            # Make a temporary list to iterate through
            temp_unallocated = unallocated_students.copy()
            random.shuffle(temp_unallocated)
            
            # Track which students we actually add so we can remove them later
            students_to_remove = []
            
            for student in temp_unallocated:
                if len(potential_group) >= 6:
                    break
                    
                test_group = potential_group + [student]
                test_avail = find_common_availability(test_group)
                
                if test_avail:
                    potential_group.append(student)
                    common_avail = test_avail
                    students_to_remove.append(student)
            
            # Remove the students we've added
            for student in students_to_remove:
                if student in unallocated_students:  # Safety check
                    unallocated_students.remove(student)
            
            if len(potential_group) >= 2 and common_avail:
                day = random.choice(list(common_avail.keys()))
                time_slot = random.choice(common_avail[day])
                
                available_locations = find_available_locations(day, time_slot, len(potential_group))
                if available_locations:
                    location = random.choice(available_locations)
                    if book_location(location, day, time_slot):
                        study_group = StudyGroup(group_id, day, time_slot, location, potential_group)
                        study_groups.append(study_group)
                        group_id += 1
                        added = True
    
    return study_groups

def send_student_email(student: Student, group: StudyGroup):
    """Send email to student with their group details"""
    time_info = "9:00 AM - 12:00 PM" if group.time_slot == "morning" else "1:00 PM - 4:00 PM"
    
    subject = f"Your Study Group Assignment - Group #{group.id}"
    
    body = f"""
    Hello {student.name},
    
    You have been successfully assigned to Study Group #{group.id}. Here are the details:
    
    Day: {group.day}
    Time: {time_info}
    Location: {group.location.name}
    Group Size: {len(group.students)} students
    
    Your group includes students from the following degrees:
    {", ".join(set(s.degree for s in group.students))}
    
    Please arrive 5 minutes before the session starts.
    
    Best regards,
    SEM 
    """
    
    send_email(student.email, subject, body)

def send_organizer_email(group: StudyGroup):
    """Send booking confirmation and catering recommendations to organizers"""
    time_info = "9:00 AM - 12:00 PM" if group.time_slot == "morning" else "1:00 PM - 4:00 PM"
    location_name = group.location.name

    # Sort catering options by walking time from the location
    nearby_catering = sorted(
        catering_options,
        key=lambda c: c.walking_times.get(location_name, float('inf'))
    )[:3]  # Recommend top 3

    subject = f"Study Group #{group.id} - Booking Confirmation"

    body = f"""
    Study Group #{group.id} has been successfully created:
    
    Day: {group.day}
    Time: {time_info}
    Location: {group.location.name}
    Group Size: {len(group.students)}
    
    Student Information:
    {''.join([f"\t- {s.name}, {s.degree}, {s.email}\n" for s in group.students])}
    
    Recommended Catering Options (by proximity):
    {''.join([f"\t- {c.name} ({c.price_range}) - {c.location}, {c.walking_times.get(location_name, 'N/A')} min walk\n" for c in nearby_catering])}
    
    Please confirm catering arrangements 24 hours before the session.
    """

    send_email(SENDER_EMAIL, subject, body)


def send_email(recipient: str, subject: str, body: str):
    """Send an email (For demonstration - in a real system this would connect to SMTP)"""
    print(f"\nEMAIL to: {recipient}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    print("-" * 50)
    
    # In a real system, you would use code like this:
    """
    message = MIMEMultipart()
    message["From"] = SENDER_EMAIL
    message["To"] = recipient
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(message)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    """

def main():
    """Main function to run the study group allocation system"""
    print("Starting study group allocation process...")
    study_groups = create_study_groups()
    
    print(f"Created {len(study_groups)} study groups")
    
    for group in study_groups:
        print(f"\nGroup #{group.id} - {group.day} ({group.time_slot})")
        print(f"Location: {group.location.name}")
        print(f"Students: {', '.join(s.name for s in group.students)}")
        
        # Send emails
        for student in group.students:
            send_student_email(student, group)
        
        send_organizer_email(group)
    
    print("\nAllocation process completed!")

if __name__ == "__main__":
    main()

@dataclass
class CateringOption:
    name: str
    location: str
    price_range: str  # "$", "$$", etc.
    distance_to_campus: float  # in minutes walking

@dataclass
class StudyGroup:
    id: int
    day: str
    time_slot: str  # "morning" or "afternoon"
    location: Location
    students: List[Student]
    
# Sample data (in a real system, this would come from a database)
students = [
    Student(1, "Alice Smith", "alice@university.edu", "Computer Science", True, 
            {"Monday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning", "afternoon"]}),
    Student(2, "Bob Johnson", "bob@university.edu", "Computer Science", True, 
            {"Monday": ["afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning"]}),
    Student(3, "Charlie Brown", "charlie@university.edu", "Biology", True, 
            {"Tuesday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
    Student(4, "Diana Prince", "diana@university.edu", "Biology", True, 
            {"Monday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
    Student(5, "Evan Williams", "evan@university.edu", "Physics", True, 
            {"Monday": ["morning", "afternoon"], "Thursday": ["afternoon"], "Friday": ["morning"]}),
    Student(6, "Fiona Apple", "fiona@university.edu", "Physics", False,  # No membership
            {"Tuesday": ["morning", "afternoon"], "Wednesday": ["morning"], "Friday": ["afternoon"]}),
    Student(7, "Greg House", "greg@university.edu", "Medicine", True, 
            {"Monday": ["afternoon"], "Wednesday": ["morning", "afternoon"], "Thursday": ["morning"]}),
    Student(8, "Helen Troy", "helen@university.edu", "Medicine", True, 
            {"Tuesday": ["morning"], "Wednesday": ["afternoon"], "Friday": ["morning"]}),
    Student(9, "Ivan Drago", "ivan@university.edu", "Computer Science", True, 
            {"Monday": ["morning"], "Wednesday": ["morning", "afternoon"], "Friday": ["morning"]}),
]

locations = [
    Location(1, "Library Study Room A", 8, 
             {"Monday": ["morning", "afternoon"], "Tuesday": ["morning", "afternoon"], 
              "Wednesday": ["morning", "afternoon"], "Thursday": ["morning", "afternoon"], 
              "Friday": ["morning", "afternoon"]}),
    Location(2, "Computer Lab 101", 15, 
             {"Monday": ["afternoon"], "Tuesday": ["morning"], 
              "Wednesday": ["morning", "afternoon"], "Thursday": ["afternoon"], 
              "Friday": ["morning"]}),
    Location(3, "Science Building Room 305", 10, 
             {"Monday": ["morning"], "Tuesday": ["afternoon"], 
              "Wednesday": ["morning"], "Thursday": ["morning", "afternoon"], 
              "Friday": ["afternoon"]}),
    Location(4, "Student Union Meeting Room", 20, 
             {"Monday": ["morning", "afternoon"], "Wednesday": ["afternoon"], 
              "Friday": ["morning", "afternoon"]}),
]

catering_options = [
    CateringOption("Campus Cafe", "Student Union Building", "$", 2),
    CateringOption("Green Salads", "Science Building", "$$", 0),
    CateringOption("Pizza Corner", "Off-campus (North)", "$", 5),
    CateringOption("Sandwich Express", "Library Ground Floor", "$", 1),
    CateringOption("Healthy Bites", "Sports Complex", "$$", 7),
    CateringOption("Taco Truck", "Engineering Parking Lot", "$", 3),
]

# Email configuration (replace with actual SMTP settings)
SMTP_SERVER = "smtp.university.edu"
SMTP_PORT = 587
SENDER_EMAIL = "study.groups@university.edu"
SENDER_PASSWORD = "password123"  # In a real system, use environment variables

def verify_membership(student: Student) -> bool:
    """Check if student has paid for membership"""
    return student.has_membership

def find_common_availability(students: List[Student]) -> Dict[str, List[str]]:
    """Find days and time slots when all students are available"""
    common_availability = {}
    
    # Start with the first student's availability
    if students:
        for day, slots in students[0].availability.items():
            common_availability[day] = slots.copy()
    
    # Intersect with each subsequent student's availability
    for student in students[1:]:
        for day in list(common_availability.keys()):
            if day not in student.availability:
                common_availability.pop(day)
                continue
                
            common_slots = []
            for slot in common_availability[day]:
                if slot in student.availability[day]:
                    common_slots.append(slot)
                    
            if common_slots:
                common_availability[day] = common_slots
            else:
                common_availability.pop(day)
                
    return common_availability

def find_available_locations(day: str, time_slot: str, group_size: int) -> List[Location]:
    """Find locations available for the given day, time slot, and group size"""
    available_locations = []
    
    for location in locations:
        if (day in location.availability and 
            time_slot in location.availability[day] and 
            location.capacity >= group_size):
            available_locations.append(location)
            
    return available_locations

def book_location(location: Location, day: str, time_slot: str) -> bool:
    """Book a location for a specific day and time slot"""
    if day in location.availability and time_slot in location.availability[day]:
        # In a real system, this would update a database
        location.availability[day].remove(time_slot)
        return True
    return False

def create_study_groups() -> List[StudyGroup]:
    """Main function to create and allocate study groups"""
    study_groups = []
    eligible_students = [s for s in students if verify_membership(s)]
    unallocated_students = eligible_students.copy()
    group_id = 1
    
    # Group by degree
    degree_groups = {}
    for student in eligible_students:
        if student.degree not in degree_groups:
            degree_groups[student.degree] = []
        degree_groups[student.degree].append(student)
    
    # Create groups ensuring at least 2 students from the same degree
    for degree, students_in_degree in degree_groups.items():
        # Create a working copy so we don't modify the original degrees list
        degree_students = students_in_degree.copy()
        
        while len(degree_students) >= 2:
            # Start with 2 students from the same degree
            first_student = degree_students.pop(0)
            second_student = degree_students.pop(0)
            
            # Make sure we remove them from unallocated_students as well
            if first_student in unallocated_students:
                unallocated_students.remove(first_student)
            if second_student in unallocated_students:
                unallocated_students.remove(second_student)
            
            group_students = [first_student, second_student]
            
            # Try to add more students (up to 6 per group) with compatible schedules
            common_avail = find_common_availability(group_students)
            
            if not common_avail:  # If these two students have no common time
                continue
                
            # Add more students if possible
            potential_additions = unallocated_students.copy()
            random.shuffle(potential_additions)  # Mix it up a bit
            
            for student in potential_additions:
                if len(group_students) >= 6:  # Limit group size
                    break
                    
                # Test if this student can be added
                test_group = group_students + [student]
                test_avail = find_common_availability(test_group)
                
                if test_avail:  # Can add this student
                    group_students.append(student)
                    unallocated_students.remove(student)
                    if student in degree_students:
                        degree_students.remove(student)
                    common_avail = test_avail
            
            # Schedule the group
            if common_avail:
                day = random.choice(list(common_avail.keys()))
                time_slot = random.choice(common_avail[day])
                
                # Find and book location
                available_locations = find_available_locations(day, time_slot, len(group_students))
                
                if available_locations:
                    location = random.choice(available_locations)
                    if book_location(location, day, time_slot):
                        study_group = StudyGroup(group_id, day, time_slot, location, group_students)
                        study_groups.append(study_group)
                        group_id += 1
    
    # Try to allocate remaining students to existing groups or create new diverse groups
    while unallocated_students:
        current_student = unallocated_students.pop(0)
        added = False
        
        # Try to add to existing groups first
        for group in study_groups:
            if len(group.students) < 6:  # Check if group has space
                test_group = group.students + [current_student]
                test_avail = find_common_availability(test_group)
                
                if (group.day in test_avail and 
                    group.time_slot in test_avail[group.day] and
                    group.location.capacity > len(group.students)):
                    group.students.append(current_student)
                    added = True
                    break
        
        if not added and len(unallocated_students) >= 1:
            # Try to form a new group with remaining students
            potential_group = [current_student]
            common_avail = current_student.availability.copy()
            
            # Make a temporary list to iterate through
            temp_unallocated = unallocated_students.copy()
            random.shuffle(temp_unallocated)
            
            # Track which students we actually add so we can remove them later
            students_to_remove = []
            
            for student in temp_unallocated:
                if len(potential_group) >= 6:
                    break
                    
                test_group = potential_group + [student]
                test_avail = find_common_availability(test_group)
                
                if test_avail:
                    potential_group.append(student)
                    common_avail = test_avail
                    students_to_remove.append(student)
            
            # Remove the students we've added
            for student in students_to_remove:
                if student in unallocated_students:  # Safety check
                    unallocated_students.remove(student)
            
            if len(potential_group) >= 2 and common_avail:
                day = random.choice(list(common_avail.keys()))
                time_slot = random.choice(common_avail[day])
                
                available_locations = find_available_locations(day, time_slot, len(potential_group))
                if available_locations:
                    location = random.choice(available_locations)
                    if book_location(location, day, time_slot):
                        study_group = StudyGroup(group_id, day, time_slot, location, potential_group)
                        study_groups.append(study_group)
                        group_id += 1
                        added = True
    
    return study_groups

def send_student_email(student: Student, group: StudyGroup):
    """Send email to student with their group details"""
    time_info = "9:00 AM - 12:00 PM" if group.time_slot == "morning" else "1:00 PM - 4:00 PM"
    
    subject = f"Your Study Group Assignment - Group #{group.id}"
    
    body = f"""
    Hello {student.name},
    
    You have been successfully assigned to Study Group #{group.id}. Here are the details:
    
    Day: {group.day}
    Time: {time_info}
    Location: {group.location.name}
    Group Size: {len(group.students)} students
    
    Your group includes students from the following degrees:
    {", ".join(set(s.degree for s in group.students))}
    
    Please arrive 5 minutes before the session starts.
    
    Best regards,
    University Study Group Program
    """
    
    send_email(student.email, subject, body)

def send_organizer_email(group: StudyGroup):
    """Send booking confirmation and catering recommendations to organizers"""
    time_info = "9:00 AM - 12:00 PM" if group.time_slot == "morning" else "1:00 PM - 4:00 PM"
    
    # Find nearby catering options (would be more sophisticated in a real system)
    recommended_catering = random.sample(catering_options, min(3, len(catering_options)))
    
    subject = f"Study Group #{group.id} - Booking Confirmation"
    
    body = f"""
    Study Group #{group.id} has been successfully created:
    
    Day: {group.day}
    Time: {time_info}
    Location: {group.location.name}
    Group Size: {len(group.students)}
    
    Student Information:
    {''.join([f"- {s.name}, {s.degree}, {s.email}" + "\n" for s in group.students])}
    
    Recommended Catering Options:
    {''.join([f"- {c.name} ({c.price_range}) - {c.location}, {c.distance_to_campus} min walking distance" + "\n" for c in recommended_catering])}
    
    Please confirm catering arrangements 24 hours before the session.
    """
    
    send_email(SENDER_EMAIL, subject, body)  # Sent to organizers

def send_email(recipient: str, subject: str, body: str):
    """Send an email (For demonstration - in a real system this would connect to SMTP)"""
    print(f"\nEMAIL to: {recipient}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    print("-" * 50)
    
    # In a real system, you would use code like this:
    """
    message = MIMEMultipart()
    message["From"] = SENDER_EMAIL
    message["To"] = recipient
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(message)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    """

def main():
    """Main function to run the study group allocation system"""
    print("Starting study group allocation process...")
    study_groups = create_study_groups()
    
    print(f"Created {len(study_groups)} study groups")
    
    for group in study_groups:
        print(f"\nGroup #{group.id} - {group.day} ({group.time_slot})")
        print(f"Location: {group.location.name}")
        print(f"Students: {', '.join(s.name for s in group.students)}")
        
        # Send emails
        for student in group.students:
            send_student_email(student, group)
        
        send_organizer_email(group)
    
    print("\nAllocation process completed!")

if __name__ == "__main__":
    main()