import React, { useState, useEffect } from "react";
// import { Technique, Sequence } from "@/entities/all";
import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";
import { createPageUrl } from "../lib/utils";
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
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Card } from "../components/ui/card";
// import { Button } from "@/components/ui/button";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// import { Badge } from "@/components/ui/badge";

import StatCard from "../components/dashboard/Statcard";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [techniques, setTechniques] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [techniquesData, sequencesData] = await Promise.all([
        Technique.list("-created_date", 10),
        Sequence.list("-created_date", 5)
      ]);
      setTechniques(techniquesData);
      setSequences(sequencesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const techniquesByType = techniques.reduce((acc, technique) => {
    acc[technique.type] = (acc[technique.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
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
            <Link to={createPageUrl("Techniques?action=create")}>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Technique
              </Button>
            </Link>
            <Link to={createPageUrl("FlowBuilder")}>
              <Button variant="outline" className="border-slate-200">
                <Workflow className="w-4 h-4 mr-2" />
                New Sequence
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Techniques"
          value={techniques.length}
          icon={Target}
          color="bg-blue-500"
          trend="+3 this week"
        />
        <StatCard
          title="Sequences Created"
          value={sequences.length}
          icon={BookOpen}
          color="bg-amber-500"
          trend="+1 this week"
        />
        <StatCard
          title="Most Used Type"
          value={Object.keys(techniquesByType).reduce((a, b) => 
            techniquesByType[a] > techniquesByType[b] ? a : b, 'position'
          ) || 'None'}
          icon={Award}
          color="bg-green-500"
        />
        <StatCard
          title="Avg. Difficulty"
          value="Intermediate"
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity 
            techniques={techniques}
            sequences={sequences}
            isLoading={isLoading}
          />
        </div>
        
        <div>
          <QuickActions 
            techniquesByType={techniquesByType}
            recentSequences={sequences.slice(0, 3)}
          />
        </div>
      </div>
    </div>
  );
}
const techniques = [
  {
    id: 'tech1',
    name: 'Armbar from Guard',
    type: 'submission',
    difficulty_level: 'beginner',
    created_date: '2025-08-27T10:30:00Z',
  },
  {
    id: 'tech2',
    name: 'Scissor Sweep',
    type: 'sweep',
    difficulty_level: 'intermediate',
    created_date: '2025-08-26T14:15:00Z',
  },
];
const sequences = [
  {
    id: 'seq1',
    name: 'Submission Chain A',
    techniques: ['armbar', 'triangle'],
    difficulty_level: 'advanced',
    created_date: '2025-08-28T08:00:00Z',
  },
  {    id: 'seq2',
    name: 'Escape Series',
    techniques: [],
    difficulty_level: 'beginner',
    created_date: '2025-08-25T18:45:00Z',
  },
];     