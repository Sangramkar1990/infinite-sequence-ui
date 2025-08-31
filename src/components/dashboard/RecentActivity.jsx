import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";
import { createPageUrl } from "../../lib/utils";
import { Clock, Target, BookOpen, ExternalLink, Play } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const typeColors = {
  position: "bg-blue-100 text-blue-800 border-blue-200",
  submission: "bg-red-100 text-red-800 border-red-200",
  escape: "bg-green-100 text-green-800 border-green-200",
  sweep: "bg-amber-100 text-amber-800 border-amber-200"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700"
};

export default function RecentActivity({ techniques, sequences, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const allItems = [
    ...techniques.map(t => ({ ...t, type: 'technique', itemType: t.type })),
    ...sequences.map(s => ({ ...s, type: 'sequence', itemType: 'sequence' }))
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 8);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 secondary_title">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allItems.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No techniques or sequences yet</p>
            <Link to={createPageUrl("Techniques?action=create")}>
              <Button size="sm">Create Your First Technique</Button>
            </Link>
          </div>
        ) : (
          allItems.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                item.type === 'technique' ? 'bg-blue-100' : 'bg-amber-100'
              }`}>
                {item.type === 'technique' ? (
                  <Target className={`w-5 h-5 ${item.type === 'technique' ? 'text-blue-600' : 'text-amber-600'}`} />
                ) : (
                  <BookOpen className="w-5 h-5 text-amber-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-slate-900 truncate">{item.name}</h4>
                  {item.video_url && (
                    <a 
                      href={item.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Play className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={typeColors[item.itemType] || "bg-slate-100 text-slate-800"}
                  >
                    {item.itemType}
                  </Badge>
                  {item.difficulty_level && (
                    <Badge 
                      variant="outline" 
                      className={difficultyColors[item.difficulty_level]}
                    >
                      {item.difficulty_level}
                    </Badge>
                  )}
                  <span className="text-xs text-slate-500">
                    {format(new Date(item.created_date), "MMM d")}
                  </span>
                </div>
              </div>

              <Link 
                to={createPageUrl(item.type === 'technique' ? 'Techniques' : 'Sequences')}
                className="text-slate-400 hover:text-slate-600"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}