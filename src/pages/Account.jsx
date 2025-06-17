import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Profile from './Profile';
import Subscription from './Subscription';
import Security from './Security';

const Account = () => {
  const [selected, setSelected] = useState('profile');

  const renderContent = () => {
    switch (selected) {
      case 'profile':
        return <Profile />;
      case 'subscription':
        return <Subscription />;
      case 'security':
        return <Security />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="container mt-4 d-flex">
      <Sidebar selected={selected} setSelected={setSelected} />
      <div className="flex-grow-1 ms-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Account;