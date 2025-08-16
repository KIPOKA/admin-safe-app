// types.ts
export interface Notification {
  id: number;
  user: string;
  location: string;
  urgency: 'high' | 'medium' | 'low';
  type: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed' | 'in-progress';
}

export interface UserProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
  joinDate: string;
  emergencyContacts: number;
}

export interface Schedule {
  id: number;
  title: string;
  location: string;
  urgency: 'high' | 'medium' | 'low';
  assignedTeam: string;
  dateTime: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}