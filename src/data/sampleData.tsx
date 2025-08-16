import { Notification, UserProps, Schedule } from "../components/interface/Notification";

export const notificationsData: Notification[] = [
  {
    id: 1,
    user: 'John Doe',
    location: 'Downtown, Block 5',
    urgency: 'high',
    type: 'emergency',
    message: 'Suspicious activity reported near the park',
    timestamp: '2 mins ago',
    status: 'pending'
  },
  {
    id: 2,
    user: 'Sarah Wilson',
    location: 'Suburb Area, Street 12',
    urgency: 'medium',
    type: 'safety_concern',
    message: 'Poor lighting on walking path',
    timestamp: '15 mins ago',
    status: 'pending'
  },
  {
    id: 3,
    user: 'Mike Johnson',
    location: 'City Center, Mall Area',
    urgency: 'low',
    type: 'general',
    message: 'Request for additional security patrol',
    timestamp: '1 hour ago',
    status: 'resolved'
  },
  {
    id: 4,
    user: 'Emily Davis',
    location: 'North District',
    urgency: 'high',
    type: 'emergency',
    message: 'Medical emergency in progress',
    timestamp: '5 mins ago',
    status: 'pending'
  },
  {
    id: 5,
    user: 'Alex Rodriguez',
    location: 'South Park Area',
    urgency: 'medium',
    type: 'maintenance',
    message: 'Broken streetlight reported',
    timestamp: '30 mins ago',
    status: 'in-progress'
  }
];

export const usersData: UserProps[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@email.com',
    phone: '+1-234-567-8901',
    location: 'Downtown Area',
    status: 'active',
    joinDate: '2024-01-15',
    emergencyContacts: 2
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah@email.com',
    phone: '+1-234-567-8902',
    location: 'Suburb Area',
    status: 'active',
    joinDate: '2024-02-20',
    emergencyContacts: 3
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@email.com',
    phone: '+1-234-567-8903',
    location: 'City Center',
    status: 'inactive',
    joinDate: '2024-03-10',
    emergencyContacts: 1
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@email.com',
    phone: '+1-234-567-8904',
    location: 'North District',
    status: 'active',
    joinDate: '2024-04-05',
    emergencyContacts: 4
  }
];

export const schedulesData: Schedule[] = [
  {
    id: 1,
    title: 'Security Patrol - Downtown',
    location: 'Downtown Area',
    urgency: 'high',
    assignedTeam: 'Team Alpha',
    dateTime: '2024-08-16 14:00',
    duration: '4 hours',
    status: 'scheduled'
  },
  {
    id: 2,
    title: 'Safety Check - Suburb',
    location: 'Suburb Area',
    urgency: 'medium',
    assignedTeam: 'Team Beta',
    dateTime: '2024-08-16 16:00',
    duration: '2 hours',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Evening Patrol - City Center',
    location: 'City Center',
    urgency: 'low',
    assignedTeam: 'Team Gamma',
    dateTime: '2024-08-16 20:00',
    duration: '6 hours',
    status: 'scheduled'
  }
];
