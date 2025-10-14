import React, { useState } from 'react';
import { Building2, Users, Shield, User, ChevronDown } from 'lucide-react';
import RolesPermissionsComponent from './roles';
import TeamsManagementComponent from './teamsA';
import Subscription from './Subscription';
import Security from './Secuirity';
import Profile from './Profile';
import OrganizationManage from './OrganizationManage';
import OrganizationRequest from './OrganizationRequest';
import OrganizationJoin from './OrganizationJoin';
import { useNavigate } from 'react-router-dom';

import {
  Target,
  ChevronLeft
} from "lucide-react";

// Dummy components for content rendering
const Organization = () => <div className="p-4">Organization Settings</div>;
const Teams = () => <div className="p-4">Team Management</div>;
const Roles = () => <div className="p-4">Role Configuration</div>;
const UserRoles = () => <div className="p-4">User Role Assignment</div>;
// const Profile = () => <div className="p-4">User Profile</div>;
// const Subscription = () => <div className="p-4">Subscription Details</div>;
// const Security = () => <div className="p-4">Security Settings</div>;

const contentComponents = {
  Organization,
  TeamsManagementComponent,
  RolesPermissionsComponent,
  UserRoles,
  Profile,
  Subscription,
  Security,
  OrganizationManage,
  OrganizationRequest,
  OrganizationJoin,
};

const SidebarNavigationComponent = () => {
  const [selectedItem, setSelectedItem] = useState('manage');
  const [openSubMenu, setOpenSubMenu] = useState('organization');
   const navigate = useNavigate();

  const menuItems = [
    { id: 'organization', icon: Building2, label: 'Organization', component: 'Organization' ,
      subItems : [
        {id: 'manage', label: 'Manage', component: 'OrganizationManage'},
        {id: 'requests', label: 'Requests', component: 'OrganizationRequest'},
        {id: 'join', label: 'Join', component: 'OrganizationJoin'},
              ],
    },
    { id: 'teams', icon: Users, label: 'Teams', component: 'TeamsManagementComponent' },
    { id: 'roles', icon: Shield, label: 'Roles', component: 'RolesPermissionsComponent' },
    
    {
      id: 'accounts',
      icon: User,
      label: 'Accounts',
      subItems: [
        { id: 'profile', label: 'Profile', component: 'Profile' },
        { id: 'subscription', label: 'Subscription', component: 'Subscription' },
        { id: 'security', label: 'Security', component: 'Security' },
      ],
    },
  ];

  const handleMenuItemClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      if (openSubMenu === item.id) {
        setOpenSubMenu(null);
        setSelectedItem(null);
      } else {
        setOpenSubMenu(item.id);
        setSelectedItem(item.subItems[0].id);
      }
    } else {
      setSelectedItem(item.id);
      setOpenSubMenu(null);
    }
  };

  const handleSubMenuItemClick = (subItem, parentId) => {
    setSelectedItem(subItem.id);
    setOpenSubMenu(parentId);
  };

  const findComponent = (itemId) => {
    for (const item of menuItems) {
      if (item.id === itemId && item.component) {
        return item.component;
      }
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.id === itemId);
        if (subItem && subItem.component) {
          return subItem.component;
        }
      }
    }
    return undefined; // No component for parent items
  };

  const componentName = findComponent(selectedItem);
  const SelectedComponent = componentName ? contentComponents[componentName] : null;

  const isParentOfSelected = (item) => {
    if (!item.subItems) return false;
    return item.subItems.some(si => si.id === selectedItem);
  }

  return (
    <>
      {/* Sidebar */}
      <div className="bg-white border-end vh-100 position-fixed start-0 top-0" 
           style={{ width: '280px', zIndex: 1050 }}>
        <div className="d-flex flex-column h-100">
          {/* Brand */}
          <div className="p-3 mb-4">
          <div className="flex items-center">
            <div className="bg-black rounded-lg p-2">
                <Target className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
                <div className="text-lg font-bold">BBJ Flows</div>
                <div className="text-sm">techniques and sequences</div>
            </div>
          </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow-1 px-3 py-4">
            <ul className="list-unstyled">
              {menuItems.map((item) => (
                <li key={item.id} className="mb-1">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleMenuItemClick(item); }}
                    className={`sidebar-nav-item d-flex align-items-center justify-content-between gap-3 px-3 py-3 text-decoration-none rounded ${
                      (selectedItem === item.id && !item.subItems) || openSubMenu === item.id || isParentOfSelected(item) ? 'selected' : ''
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <item.icon size={20} strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </div>
                    {item.subItems && <ChevronDown size={16} className={`chevron ${openSubMenu === item.id ? 'rotate-180' : ''}`} />}
                  </a>
                  {item.subItems && openSubMenu === item.id && (
                    <ul className="list-unstyled ps-4 pt-2">
                      {item.subItems.map(subItem => (
                        <li key={subItem.id}>
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleSubMenuItemClick(subItem, item.id); }}
                            className={`sidebar-sub-item d-flex align-items-center gap-3 px-3 py-2 text-decoration-none rounded ${
                              selectedItem === subItem.id ? 'selected' : ''
                            }`}
                          >
                            <span>{subItem.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto mb-4 ">
          <button className="w-full p-2 bg-transparent border-0 "onClick={() => navigate('/dashboard')}>
            <div className="flex items-center">
                <ChevronLeft className="h-10 w-10 flex-shrink-0" />
                <div className="ml-3 text-center flex-grow">
                    <div className="text-lg">Dashboard</div>
                    <div className="text-sm font-bold">go back to dashboard</div>
                </div>
            </div>
          </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='w-100' style={{ marginLeft: '280px' }}>
        <div className="p-5">
          <h3 className="fw-bold mb-3 mx-auto text-center">Account Settings</h3>
          <div className="content-area mx-auto">
            {SelectedComponent ? <SelectedComponent /> : <p className="text-muted">Select an option from the sidebar.</p>}
          </div>
          
        </div>
      </div>

      <style>{`
        .sidebar-nav-item, .sidebar-sub-item {
          color: #334155;
          font-weight: 500;
          transition: background-color 0.2s, color 0.2s;
        }
        .sidebar-nav-item .lucide, .sidebar-nav-item .chevron {
          color: #6c757d;
          transition: color 0.2s;
        }
        .sidebar-nav-item:hover, .sidebar-sub-item:hover {
          background-color: #334155;
          color: white;
        }
        .sidebar-nav-item:hover .lucide, .sidebar-nav-item:hover .chevron {
          color: white;
        }
        .sidebar-nav-item.selected, .sidebar-sub-item.selected {
          background-color: #334155;
          color: white;
        }
        .sidebar-nav-item.selected .lucide, .sidebar-nav-item.selected .chevron {
          color: white;
        }
        .chevron.rotate-180 {
          transform: rotate(180deg);
        }
        .chevron {
          transition: transform 0.2s;
        }
      `}</style>
    </>
  );
};

export default SidebarNavigationComponent;