import { Target,Home, BookOpen,Plus, Workflow, Share2, Orbit } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 


export default function SidebarNavigation() {
  const navigate = useNavigate();
  return (
    <nav className="sidebar pt-4 px-4">
      <h5 className="fs-6 ps-3 text-muted">NAVIGATION</h5>
      <div className="flex flex-col gap-1 mb-5">
        <button className="sidebar-button my-2" onClick={()=> navigate("/dashboard")}>
          <Home className="h-4 w-4" />
          Dashboard
        </button>
        <button className="sidebar-button my-2" onClick={()=> navigate("/techniques")}>
          <Target className="h-4 w-4" />
          Techniques
        </button>
        <button className="sidebar-button my-2">
          <BookOpen  className="h-4 w-4" />
          Sequences
        </button>
        <button className="sidebar-button my-2" onClick={()=> navigate("/flow-editor")}>
          <Workflow className="h-4 w-4" />
          Flow Builder
        </button>
      </div>

      <h5 className="fs-6 ps-3 text-muted">QUICK ACTIONS</h5>


      <div className="quick-links">
        <button className="sidebar-button my-2" onClick={()=> navigate("/create-card")}> <Plus className="h-4 w-4"/>Add Technique</button>
        <button className="sidebar-button my-2" onClick={()=> navigate("/create-sequence")}> <Share2 className="h-4 w-4" />New Sequence</button>
      </div>
    </nav>
  );
}
