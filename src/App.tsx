// App.tsx
import React, { useState } from 'react';
import { Users, Bell, AlertTriangle, Calendar, Plus, Filter, MapPin, Clock, User, Phone, Mail, Edit, Trash2, Eye } from 'lucide-react';

// Import all components
import { Login } from './auth/Signin';
import { Header } from './components/header/HeaderProps';
import { Sidebar } from './components/sidebar/Sidebar';
import { StatsCard } from './components/stats/StatsCard';
import { SearchBar } from './components/search/SearchBar';
import { Grid, Card, CardHeader, CardBody, CardFooter } from "./components/grd/Grids" 
import { StatusBadge } from './components/status/StatusBadge';
import { UrgencyBadge } from './components/status/UrgencyBadge';
import { ActionButton } from './components/button/ActionButton';
  // Sample data
import { notificationsData, usersData, schedulesData } from './data/sampleData';
// Import types
import { Notification, Schedule, UserProps } from "./components/interface/Notification"

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');



const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
const [users, setUsers] = useState<UserProps[]>(usersData);
const [schedules] = useState<Schedule[]>(schedulesData);


  // Handle login
  const handleLogin = (credentials: { email: string; password: string }) => {
    if (credentials.email === 'admin@gmail.com' && credentials.password === '123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use admin@safetyapp.com / admin123');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  // Update notification status
  const updateNotificationStatus = (id: number, status: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, status: status as any } : notif
    ));
  };

  // User management functions
  const handleViewUser = (id: number) => {
    console.log('View user:', id);
  };

  const handleEditUser = (id: number) => {
    console.log('Edit user:', id);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Dashboard Overview Component
  const DashboardOverview: React.FC = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={users.length}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Alerts"
          value={notifications.filter(n => n.status === 'pending').length}
          icon={Bell}
          color="red"
        />
        <StatsCard
          title="Scheduled Tasks"
          value={schedules.length}
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="High Priority"
          value={notifications.filter(n => n.urgency === 'high').length}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Recent Notifications Grid */}
      <Grid 
        title="Recent Notifications" 
        subtitle="Latest alerts and safety reports from users"
        columns={2}
        gap="lg"
      >
        {notifications.slice(0, 6).map((notification) => (
          <div key={notification.id}>
            <CardHeader
              title={notification.user}
              subtitle={notification.type.replace('_', ' ').toUpperCase()}
              icon={<Bell className="w-5 h-5" />}
              badge={<UrgencyBadge urgency={notification.urgency} />}
            />
            <CardBody>
              <p className="text-gray-700 mb-3">{notification.message}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {notification.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {notification.timestamp}
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <StatusBadge status={notification.status} />
              <div className="flex space-x-2">
                <ActionButton
                  icon={Eye}
                  onClick={() => {}}
                  color="blue"
                  tooltip="View Details"
                />
                <ActionButton
                  icon={AlertTriangle}
                  onClick={() => updateNotificationStatus(notification.id, 'resolved')}
                  color="green"
                  tooltip="Mark Resolved"
                />
              </div>
            </CardFooter>
          </div>
        ))}
      </Grid>
    </div>
  );

  // Notifications Tab Component
  const NotificationsTab: React.FC = () => {
    const filteredNotifications = notifications.filter(notif =>
      notif.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Notifications & Alerts</h2>
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <Grid 
          subtitle={`Showing ${filteredNotifications.length} notifications`}
          columns={3}
          showHeader={false}
        >
          {filteredNotifications.map((notification) => (
            <div key={notification.id}>
              <CardHeader
                title={notification.user}
                subtitle={notification.type.replace('_', ' ').toUpperCase()}
                icon={<Bell className="w-5 h-5" />}
                badge={<UrgencyBadge urgency={notification.urgency} />}
              />
              <CardBody>
                <p className="text-gray-700 mb-4">{notification.message}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {notification.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {notification.timestamp}
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <StatusBadge status={notification.status} />
                <div className="flex space-x-2">
                  <ActionButton
                    icon={Eye}
                    onClick={() => {}}
                    color="blue"
                    tooltip="View Details"
                  />
                  <ActionButton
                    icon={AlertTriangle}
                    onClick={() => updateNotificationStatus(notification.id, 'resolved')}
                    color="green"
                    tooltip="Resolve"
                  />
                </div>
              </CardFooter>
            </div>
          ))}
        </Grid>
      </div>
    );
  };

  // Users Tab Component
  const UsersTab: React.FC = () => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search users..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <Grid 
          subtitle={`Managing ${filteredUsers.length} users`}
          columns={3}
          showHeader={false}
        >
          {filteredUsers.map((user) => (
            <div key={user.id}>
              <CardHeader
                title={user.name}
                subtitle={`Member since ${user.joinDate}`}
                icon={<User className="w-5 h-5" />}
                badge={<StatusBadge status={user.status} />}
              />
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {user.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Emergency Contacts:</span>
                    <span className="font-semibold text-gray-900">{user.emergencyContacts}</span>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <span className="text-sm text-gray-500">ID: {user.id}</span>
                <div className="flex space-x-2">
                  <ActionButton
                    icon={Eye}
                    onClick={() => handleViewUser(user.id)}
                    color="blue"
                    tooltip="View Details"
                  />
                  <ActionButton
                    icon={Edit}
                    onClick={() => handleEditUser(user.id)}
                    color="green"
                    tooltip="Edit User"
                  />
                  <ActionButton
                    icon={Trash2}
                    onClick={() => handleDeleteUser(user.id)}
                    color="red"
                    tooltip="Delete User"
                  />
                </div>
              </CardFooter>
            </div>
          ))}
        </Grid>
      </div>
    );
  };

  // Schedule Tab Component
  const ScheduleTab: React.FC = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Schedule Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Schedule Task</span>
        </button>
      </div>

      <Grid 
        subtitle={`${schedules.length} scheduled tasks`}
        columns={2}
        showHeader={false}
      >
        {schedules.map((schedule) => (
          <div key={schedule.id}>
            <CardHeader
              title={schedule.title}
              subtitle={schedule.assignedTeam}
              icon={<Calendar className="w-5 h-5" />}
              badge={<UrgencyBadge urgency={schedule.urgency} />}
            />
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {schedule.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {schedule.dateTime}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">{schedule.duration}</span>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <StatusBadge status={schedule.status} />
              <div className="flex space-x-2">
                <ActionButton
                  icon={Eye}
                  onClick={() => {}}
                  color="blue"
                  tooltip="View Details"
                />
                <ActionButton
                  icon={Edit}
                  onClick={() => {}}
                  color="green"
                  tooltip="Edit Schedule"
                />
                <ActionButton
                  icon={Trash2}
                  onClick={() => {}}
                  color="red"
                  tooltip="Delete Schedule"
                />
              </div>
            </CardFooter>
          </div>
        ))}
      </Grid>
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard': 
        return <DashboardOverview />;
      case 'notifications': 
        return <NotificationsTab />;
      case 'users': 
        return <UsersTab />;
      case 'schedule': 
        return <ScheduleTab />;
      default: 
        return <DashboardOverview />;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header notifications={notifications} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          notifications={notifications} 
        />
        
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default App;