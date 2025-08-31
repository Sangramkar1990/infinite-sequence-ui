
import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Input } from "@/components/ui/input";
import Input from "../components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { Badge } from "../components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Button } from "../components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
import { Skeleton } from "../components/ui/skeleton";
import { 
  Target, 
  Search, 
  BookOpen, 
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const typeColors = {
  position: "bg-blue-100 text-blue-800",
  submission: "bg-red-100 text-red-800",
  escape: "bg-green-100 text-green-800",
  sweep: "bg-amber-100 text-amber-800",
  guard: "bg-purple-100 text-purple-800"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700"
};

// export default function TechniqueLibrarySidebar({ techniques, isLoading }) {
    export default function TechniqueLibrarySidebar({  isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const filteredTechniques = techniques.filter(technique => {
    const matchesSearch = technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || technique.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || technique.difficulty_level === selectedDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleDragStart = (e, technique) => {
    e.dataTransfer.setData("application/json", JSON.stringify(technique));
    e.dataTransfer.effectAllowed = "copy";
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-slate-200 flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="m-2 h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-slate-400 rotate-90" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full">
      <CardHeader className="pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Technique Library
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search techniques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="submission">Submission</SelectItem>
                <SelectItem value="escape">Escape</SelectItem>
                <SelectItem value="sweep">Sweep</SelectItem>
                <SelectItem value="guard">Guard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ))
          ) : filteredTechniques.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No techniques found</p>
            </div>
          ) : (
            filteredTechniques.map((technique) => (
              <div
                key={technique.id}
                draggable
                onDragStart={(e) => handleDragStart(e, technique)}
                className="p-3 bg-slate-50 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-slate-600" />
                  <h4 className="font-medium text-slate-900 text-sm">{technique.name}</h4>
                </div>
                
                <div className="flex gap-1 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${typeColors[technique.type]}`}
                  >
                    {technique.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${difficultyColors[technique.difficulty_level]}`}
                  >
                    {technique.difficulty_level}
                  </Badge>
                </div>
                
                {technique.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {technique.description}
                  </p>
                )}
                
                <p className="text-xs text-slate-400 mt-2">
                  Drag to canvas to add
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </div>
  );
}
