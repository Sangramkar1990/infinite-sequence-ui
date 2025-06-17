import React from 'react';

const Sidebar = ({ selected, setSelected }) => (
  <div className="d-flex flex-column  p-3" style={{ width: 180, borderRadius: 8, height: 'fit-content' }}>
    {/* <button className={`btn text-start mb-2 ${selected === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelected('profile')}>Profile</button>
    <button className={`btn text-start mb-2 ${selected === 'subscription' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelected('subscription')}>Subscription</button>
    <button className={`btn text-start ${selected === 'security' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelected('security')}>Security</button> */}
    <div className={`sideMenu-item-conatiner ps-2 ${selected === 'profile' ? 'selected-side-item' : ''}`}>
    <button className={`sideMenu-item w-100 text-start`} onClick={() => setSelected('profile')}><strong>Profile</strong></button>
    </div>
    <hr className='sidebar-line'></hr>
    <div className={`sideMenu-item-container ps-2 ${selected === 'subscription' ? 'selected-side-item' : ''}`}>
    <button className={`sideMenu-item w-100 text-start`} onClick={() => setSelected('subscription')}><strong>Subscription</strong></button>
    </div>
    <hr className='sidebar-line'></hr>
    <div className={`sidemenu-item-container ps-2  ${selected === 'security' ? 'selected-side-item' : ''}`}>
    <button className={`sideMenu-item w-100 text-start`} onClick={() => setSelected('security')}><strong>Security</strong></button>
    </div>
   
  </div>
);

export default Sidebar;