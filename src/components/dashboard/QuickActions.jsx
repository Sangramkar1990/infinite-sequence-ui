import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";
import { createPageUrl } from "../../lib/utils";
import { Plus, Target, BookOpen, Workflow, BarChart3 } from "lucide-react";

export default function QuickActions({ techniquesByType, recentSequences }) {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 ">
          

         
          <Link to={createPageUrl("Techniques?action=create")} className="block my-6">
            <Button variant="outline" className="w-full justify-start ">
              <Plus className="w-4 h-4 mr-2" />
              Add New Technique
            </Button>
          </Link>
           
          <Link to={createPageUrl("FlowBuilder")} className="block">
            <Button variant="outline" className="w-full justify-start">
              <Workflow className="w-4 h-4 mr-2" />
              Create Sequence
            </Button>
          </Link>
          <Link to={createPageUrl("Techniques")} className="block">
            <Button variant="outline" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              Browse Techniques
            </Button>
          </Link>
          <Link to={createPageUrl("Sequences")} className="block">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              View Sequences
            </Button>
          </Link>
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
            {Object.entries(techniquesByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize text-slate-700">
                  {type.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold text-slate-900">{count}</span>
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
                    {sequence.techniques?.length || 0} techniques
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}