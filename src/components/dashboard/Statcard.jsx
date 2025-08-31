import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { Card , CardContent} from "../ui/card";
import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <Card className="technique-card border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}