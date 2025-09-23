
import React from "react";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Badge } from "../ui/badge";
import { Trash2, Target, Play, Tag } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


const typeColors = {
  position: "bg-blue-100 text-blue-800",
  submission: "bg-red-100 text-red-800",
  escape: "bg-green-100 text-green-800",
  sweep: "bg-amber-100 text-amber-800",
  guard: "bg-purple-100 text-purple-800"
};

const ConnectionHandle = ({ position, onMouseDown }) => {
  const baseClasses = "absolute w-3 h-3 bg-amber-500 rounded-full cursor-crosshair hover:bg-amber-600 hover:scale-125 transition-all z-20 border-2 border-white shadow-sm";
  let positionClasses = "";
  switch(position) {
    case 'top': positionClasses = "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"; break;
    case 'right': positionClasses = "top-1/2 right-0 -translate-y-1/2 translate-x-1/2"; break;
    case 'bottom': positionClasses = "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"; break;
    case 'left': positionClasses = "top-1/2 left-0 -translate-y-1/2 -translate-x-1/2"; break;
  }
  
  return (
    <div 
      className={`${baseClasses} ${positionClasses}`} 
      onMouseDown={onMouseDown}
      style={{ pointerEvents: 'all' }}
    />
  );
};

export default function TechniqueNode({ technique, onDragStart, onMouseUp, onEdgeDrawStart, onDelete, onPlayVideo }) {
    const [menuOpen, setMenuOpen] = useState(false);
  
  if (!technique) return null;

  const handlePlayVideo = (e) => {
    e.stopPropagation();
    if (technique.url) {
      onPlayVideo(technique.url);
    }
  };

//   const handleNodeMouseDown = (e) => {
//     // Don't drag if clicking on connection handles or buttons
//     if (e.target.closest('.connection-handle') || e.target.closest('button')) {
//       return;
//     }
//     e.stopPropagation(); 
//     onDragStart(node.id, e);
//   };

//   const handleNodeMouseUp = (e) => {
//     // Removed e.stopPropagation() to fix "sticky drag" bug
//     onMouseUp(node.id);
//   };

  const handleConnectionStart = (position, e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdgeDrawStart(node.id, position, e);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="absolute bg-white rounded-xl shadow-lg border border-slate-200 w-72 p-4 cursor-grab active:cursor-grabbing hover:shadow-2xl hover:border-amber-400 transition-all group"
        style={{
          left: `${node.position.x}px`,
          top: `${node.position.y}px`,
          height: `${node.height}px`,
        }}
        // onMouseDown={handleNodeMouseDown}
        // onMouseUp={handleNodeMouseUp}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-slate-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 flex-1">{technique.name}</h4>
              </div>
              <div className="flex items-center">
                  {technique.video_url && (
                      <button onClick={handlePlayVideo} className="text-slate-400 hover:text-amber-500 mr-1">
                          <Play className="w-5 h-5" />
                      </button>
                  )}
                  <button 
                    onClick={() => {
                if (technique.destroyCard) {
                  technique.destroyCard(technique.id);
                }
                setMenuOpen(false);
              }}
                    className="text-slate-400 hover:text-red-500 opacity-50 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
              </div>
          </div>

          {technique.description ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2 cursor-help">
                  {technique.description}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="max-w-xs p-2 text-xs bg-slate-800 text-white border-slate-800">
                <p>{technique.description}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-xs text-slate-500 mb-3">
              No description available.
            </p>
          )}

          <div className="flex-grow" />

          <div className="space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                <Badge variant="secondary" className={typeColors[technique.type]}>
                  {technique.type}
                </Badge>
                <Badge variant="outline">{technique.difficulty_level}</Badge>
              </div>
              
              {technique.tags && technique.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                      {technique.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="font-normal text-xs">
                              <Tag className="w-3 h-3 mr-1"/>
                              {tag}
                          </Badge>
                      ))}
                  </div>
              )}
          </div>
        </div>

        {/* Connection Handles */}
        <div className="connection-handle">
          <ConnectionHandle 
            position="top" 
            onMouseDown={(e) => handleConnectionStart('top', e)} 
          />
        </div>
        <div className="connection-handle">
          <ConnectionHandle 
            position="right" 
            onMouseDown={(e) => handleConnectionStart('right', e)} 
          />
        </div>
        <div className="connection-handle">
          <ConnectionHandle 
            position="bottom" 
            onMouseDown={(e) => handleConnectionStart('bottom', e)} 
          />
        </div>
        <div className="connection-handle">
          <ConnectionHandle 
            position="left" 
            onMouseDown={(e) => handleConnectionStart('left', e)} 
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
