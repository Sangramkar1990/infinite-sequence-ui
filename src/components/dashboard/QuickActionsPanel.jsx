import React, { useState, useEffect } from "react";
import { Card , CardContent, CardHeader, CardTitle} from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Target, BookOpen, Workflow, BarChart3 } from "lucide-react";
import CreateCardModal from "./CreateCardModal";
import CreateSequenceModal from "./CreateSequenceModal";
import { userService } from "../../services/api";

export default function QuickActions({ techniquesByType, recentSequences }) {
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);

  console.log('recent sequences ---->', {recentSequences})

  const [breakdown, setBreakdown] = useState({
        
        techniques: {
          Submission: 0,
          Position: 0,
          Sweep: 0,
          Escape: 0,
          Guard: 0,
          Other: 0,
  
        },
      });
    
      useEffect(() => {
        const fetchStats = async () => {
          try {
            const data = await userService.techniqueBreakdown();
            console.log('breakdown ---- >', {data} )
            setBreakdown(data );
          } catch (error) {
            console.error("Failed to fetch statistics:", error);
          }
        };
    
        fetchStats();
      }, []);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start mb-2" id="add-technique-button" onClick={() => setShowCardModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Technique
          </Button>
          <Button variant="outline" className="w-full justify-start mb-2" id="add-sequence-button" onClick={() => setShowSequenceModal(true)}>
            <Workflow className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
          <a href={"/Techniques"} className="block">
            <Button variant="outline" className="w-full justify-start mb-2">
              <Target className="w-4 h-4 mr-2" />
              Browse Techniques
            </Button>
          </a>
          <a href={"/Sequences"} className="block">
            <Button variant="outline" className="w-full justify-start mb-2">
              <BookOpen className="w-4 h-4 mr-2" />
              View Sequences
            </Button>
          </a>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Technique Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize text-slate-700">
                  {key}
                </span>
                <span className="text-sm font-bold text-slate-900">{typeof value === 'object' ?JSON.stringify(value) : String(value)}</span>
              </div>
            ))}
            {Object.keys(techniquesByType).length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                No techniques added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {recentSequences.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Sequences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSequences.map((sequence) => (
                <div key={sequence.id} className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 text-sm">{sequence.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {sequence.cards?.length || 0} techniques
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <CreateCardModal show={showCardModal} onClose={() => setShowCardModal(false)} />
      <CreateSequenceModal show={showSequenceModal} onClose={() => setShowSequenceModal(false)} />
    </div>
  );
}