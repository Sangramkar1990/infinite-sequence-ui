import {
  Target,
  Home,
  BookOpen,
  Plus,
  Workflow,
  Share2,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CreateCardModal from "./CreateCardModal";
import CreateSequenceModal from "./CreateSequenceModal";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function SidebarNavigation({ selectedItem }) {
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("john doe");

  useEffect(() => {
    if (user && user.name) {
      setIsLoading(false);
      setUserName(user.name);
    }
  }, [user]);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard", id: "dashboard" },
    { path: "/techniques", icon: Target, label: "Techniques", id: "techniques" },
    { path: "/sequences", icon: BookOpen, label: "Sequences", id: "sequences" },
    {
      path: "/flow-builder",
      icon: Workflow,
      label: "Flow Builder",
      id: "flow-builder",
    },
  ];

  return (
    <nav className="sidebar pt-4 px-4 flex flex-col h-screen fixed top-0 left-0">
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
      <div className='overflow-y-auto'>
      <h5 className="fs-6 ps-3 text-muted">NAVIGATION</h5>
      <div className="flex flex-col gap-1 mb-5">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-button my-2 ${
              selectedItem === item.id ? "selected" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <h5 className="fs-6 ps-3 text-muted">QUICK ACTIONS</h5>


      <div className="quick-links">
        <button
          className="sidebar-button my-2"
          onClick={() => setShowCardModal(true)}
        >
          {" "}
          <Plus className="h-4 w-4" />
          Add Technique
        </button>
        <button
          className="sidebar-button my-2"
          onClick={() => setShowSequenceModal(true)}
        >
          {" "}
          <Workflow className="h-4 w-4" />
          New Sequence
        </button>
      </div>
      </div>

      <div className="mt-auto mb-4 ">
        <button className="w-full p-2 bg-transparent border-0 " onClick={() => navigate('/account')}>
          <div className="flex items-center">
            <User className="h-10 w-10 flex-shrink-0" />
            <div className="ml-3 text-center flex-grow">
              <div className="text-lg">
                {isLoading ? (
                  <div className="relative overflow-hidden rounded bg-gray-200">
                    <div className="h-10" />
                    <div className="absolute inset-0 -translate-x-full animate-[shine_1.2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                ) : (
                  userName
                )}
              </div>
              <div className="text-sm font-bold">account setting</div>
            </div>
          </div>
        </button>
      </div>
      <CreateCardModal
        show={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
      <CreateSequenceModal
        show={showSequenceModal}
        onClose={() => setShowSequenceModal(false)}
      />
      


<style>

</style>
      <style>{`
        .sidebar-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          border-radius: 0.375rem;
          color: #334155;
          font-weight: 500;
          transition: background-color 0.2s, color 0.2s;
          background-color: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }
        .sidebar-button:hover {
          background-color: #334155;
          color: white;
        }
        .sidebar-button.selected {
          background-color: #334155;
          color: white;
        }
        .sidebar-button .lucide {
          color: #6c757d;
          transition: color 0.2s;
        }
        .sidebar-button:hover .lucide,
        .sidebar-button.selected .lucide {
          color: white;
        }
      `}</style>
    </nav>
  );
}