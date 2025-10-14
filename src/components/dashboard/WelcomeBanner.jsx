import React, { useState } from "react";
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
import CreateCardModal from "./CreateCardModal";
import CreateSequenceModal from "./CreateSequenceModal";


export default function WelcomeBanner() {
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
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
            <Button className="bg-slate-900 hover:bg-slate-800" id="add-technique-button" onClick={() => setShowCardModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Technique
            </Button>
            <Button variant="outline" className="border-slate-200" id="add-sequence-button" onClick={() => setShowSequenceModal(true)}>
              <Workflow className="w-4 h-4 mr-2" />
              New Sequence
            </Button>
          </div>
          <CreateCardModal show={showCardModal} onClose={() => setShowCardModal(false)} />
          <CreateSequenceModal show={showSequenceModal} onClose={() => setShowSequenceModal(false)} />
        </div>
  ) ;
}
