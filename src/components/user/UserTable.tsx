import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Eye, Trash2, Heart, Activity, UserCheck, User, X } from 'lucide-react';

// ---------- TYPES ----------
interface GridProps {
  subtitle?: string;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  showHeader?: boolean;
  children: React.ReactNode;
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
}

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color: 'blue' | 'green' | 'red';
  tooltip: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}

interface EmergencyContact {
  id: number;
  name: string;
  relation: string;
  phone: string;
}

interface UserProps {
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

interface UserCardProps {
  user: UserProps;
  onView: (id: number) => void;
  onDelete: (email: string) => void;
}

interface ApiUser {
  id: number;
  fullName: string;
  cellNumber: string;
  address: string;
  createdAt: string;
  allergies: string;
  conditions: string;
  email: string;
  bloodType?: { type: string };
  medicalAid?: { name: string };
  userRole: { roleName: string };
  emergencyContacts: EmergencyContact[];
}

interface UserTableProps {
  searchTerm?: string;
  onUserCountChange?: (count: number) => void;
}

// ---------- GRID ----------
const Grid: React.FC<GridProps> = ({ subtitle, columns = 3, gap = "lg", showHeader = false, children }) => {
  const gapClasses: Record<string, string> = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8"
  };

  return (
    <div className="w-full">
      {showHeader && subtitle && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{subtitle}</h2>
        </div>
      )}
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${columns} ${gapClasses[gap]}`}>
        {children}
      </div>
    </div>
  );
};

// ---------- STATUS BADGE ----------
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ---------- ACTION BUTTON ----------
const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, onClick, color, tooltip }) => {
  const colorStyles: Record<string, string> = {
    blue: "text-blue-600 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500",
    green: "text-green-600 hover:text-white hover:bg-green-600 dark:hover:bg-green-500",
    red: "text-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-500"
  };

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg border dark:border-gray-600 ${colorStyles[color]} transition-all duration-300`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// ---------- CARD COMPONENTS ----------
const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, badge }) => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
    {badge && <div>{badge}</div>}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children }) => (
  <div className="mt-4 flex justify-end space-x-2">{children}</div>
);

// ---------- USER CARD ----------
const UserCard: React.FC<UserCardProps> = ({ user, onView, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border dark:border-gray-700">
      <CardHeader
        title={user.name}
        subtitle={`Member since ${user.joinDate}`}
        badge={<StatusBadge status={user.status} />}
      />
      <hr className='border mb-2 border-gray-200 dark:border-gray-600'/>
      <CardBody>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-500" />
          <span className="text-gray-900 dark:text-gray-100">{user.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="text-gray-900 dark:text-gray-100">{user.location}</span>
        </div>
      </CardBody>
      <CardFooter>
        <ActionButton icon={Eye} onClick={() => onView(user.id)} color="blue" tooltip="View Details" />
        <ActionButton icon={Trash2} onClick={() => onDelete(user.email)} color="red" tooltip="Delete User" />
      </CardFooter>
    </div>
  );
};

// ---------- USER MODAL ----------
interface ModalProps {
  user: UserProps | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<ModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative border dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-bold"
        >
          <X className="w-8 h-8 hover:text-red-500" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{user.name} - Details</h2>
        <hr className='border mb-2 border-gray-200 dark:border-gray-600'/>

        <div className="space-y-3 text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-500" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-purple-500" />
            <span className="capitalize">{user.status}</span>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <span>{user.allergies || 'None'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-yellow-500" />
            <span>{user.conditions || 'None'}</span>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-purple-500" />
            <span>{user.bloodType}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-500" />
            <span>{user.medicalAid}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <span>{user.role}</span>
          </div>

          <h3 className="mt-6 font-semibold text-lg">Emergency Contacts:</h3>
          {user.emergencyContacts.length ? (
            <ul className="space-y-2">
              {user.emergencyContacts.map(contact => (
                <li key={contact.id} className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>{contact.name} ({contact.relation}) - {contact.phone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- USER SERVICE ----------
class UserService {
  private static readonly BASE_URL = 'http://localhost:3000/api';

  static async getAllUsers(): Promise<ApiUser[]> {
    const response = await fetch(`${this.BASE_URL}/users`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.users;
  }

  static async deleteUserByEmail(email: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/users/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }
}

// ---------- TRANSFORM API DATA ----------
const transformApiUserToUserProps = (apiUser: ApiUser): UserProps => {
  const getStatus = (role: string): 'active' | 'pending' | 'inactive' => role === 'user' ? 'active' : 'pending';
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return {
    id: apiUser.id,
    name: apiUser.fullName,
    email: apiUser.email,
    phone: apiUser.cellNumber,
    location: apiUser.address,
    status: getStatus(apiUser.userRole.roleName),
    joinDate: formatDate(apiUser.createdAt),
    allergies: apiUser.allergies,
    conditions: apiUser.conditions,
    bloodType: apiUser.bloodType?.type || 'Unknown',
    medicalAid: apiUser.medicalAid?.name || 'None',
    role: apiUser.userRole?.roleName || 'Unknown',
    emergencyContacts: apiUser.emergencyContacts
  };
};

// ---------- USER TABLE ----------
const UserTable: React.FC<UserTableProps> = ({ searchTerm = '', onUserCountChange }) => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const apiUsers = await UserService.getAllUsers();
      const transformedUsers = apiUsers.map(transformApiUserToUserProps);
      setUsers(transformedUsers);
      onUserCountChange?.(transformedUsers.length);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleView = (id: number) => {
    const user = users.find(u => u.id === id) || null;
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (email: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try { await UserService.deleteUserByEmail(email); await loadUsers(); }
      catch { alert('Failed to delete user.'); }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-gray-900 dark:text-gray-100">Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Grid subtitle={`Managing ${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}`} columns={3} gap="lg">
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </Grid>

      <UserModal user={selectedUser} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default UserTable;
