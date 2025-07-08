import React from 'react';

const OrganizationSidebar = ({ selected, setSelected }) => (
  <div className="d-flex flex-column  p-3" style={{ width: 180, borderRadius: 8, height: 'fit-content' }}>
    <div className={`sideMenu-item-conatiner ps-2 ${selected === 'manage' ? 'selected-side-item' : ''}`}>
      <button className={`sideMenu-item w-100 text-start ${selected === 'manage' ? 'selected' : ''}`} onClick={() => setSelected('manage')}><strong>Manage</strong></button>
    </div>
    <hr className='sidebar-line'></hr>
    <div className={`sideMenu-item-conatiner ps-2 ${selected === 'request' ? 'selected-side-item' : ''}`}>
      <button className={`sideMenu-item w-100 text-start ${selected === 'request' ? 'selected' : ''}`} onClick={() => setSelected('request')}><strong>Requests</strong></button>
    </div>
    <hr className='sidebar-line'></hr>
    <div className={`sideMenu-item-conatiner ps-2 ${selected === 'join' ? 'selected-side-item' : ''}`}>
      <button className={`sideMenu-item w-100 text-start ${selected === 'join' ? 'selected' : ''}`} onClick={() => setSelected('join')}><strong>Join</strong></button>
    </div>
  </div>
);

export default OrganizationSidebar;