// =======================
// User-related interfaces
// =======================
export interface BloodType {
  id: number;
  type: string;
}

export interface MedicalAid {
  id: number;
  name: string;
  type: string;
}

export interface UserRole {
  id: number;
  roleName: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relation: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface ApiUser {
  id: number;
  fullName: string;
  cellNumber: string;
  address: string;
  allergies: string;
  conditions: string;
  createdAt: string;
  updatedAt: string;
  bloodTypeId: number;
  medicalAidId: number;
  roleId: number;
  bloodType: BloodType;
  medicalAid: MedicalAid;
  userRole: UserRole;
  emergencyContacts: EmergencyContact[];
}

export interface UserProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  allergies: string;
  conditions: string;
  bloodType: string;
  medicalAid: string;
  role: string;
  emergencyContacts: EmergencyContact[];
}

// =======================
// Button interface
// =======================
export interface ActionButtonProps {
  icon: React.ComponentType<any>;
  onClick: () => void;
  color: 'blue' | 'green' | 'red';
  tooltip: string;
}

// =======================
// Example other modules
// =======================
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
