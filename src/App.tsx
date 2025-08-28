import React, { useState } from 'react';
import { Login } from './auth/Signin';
import { Header } from './components/header/HeaderProps';
import { Sidebar } from './components/sidebar/Sidebar';
import NotificationRow from './components/notification/NotificationRow';
import UserTable from './components/user/UserTable';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 

  // Handle login
  const handleLogin = (credentials: { email: string; password: string }) => {
    if (credentials.email === 'admin' && credentials.password === '123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use admin / 123');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  // Dashboard Overview Component
  const DashboardOverview: React.FC = () => (
    <div>
      <NotificationRow />   
    </div>
  ); 

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'notifications': return <NotificationRow />;
      case 'users': return <UserTable />;
      default: return <DashboardOverview />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ✅ Only pass onLogout now */}
      <Header onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
