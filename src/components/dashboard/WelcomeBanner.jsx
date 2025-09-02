import { Link } from "react-router-dom";
import { 
  Target, 
  BookOpen, 
  Workflow, 
  Plus, 
  Play,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "../ui/button";
import { createPageUrl } from "../../lib/utils";


export default function WelcomeBanner() {
  return (
   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Welcome back to BJJ Flow
            </h1>
            <p className="text-slate-600 text-lg">
              Build, visualize, and master your jiu jitsu sequences
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("/create-card")}>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Technique
              </Button>
            </Link>
            <Link to={createPageUrl("/create-sequence")}>
              <Button variant="outline" className="border-slate-200">
                <Workflow className="w-4 h-4 mr-2" />
                New Sequence
              </Button>
            </Link>
          </div>
        </div>
  ) ;
}
