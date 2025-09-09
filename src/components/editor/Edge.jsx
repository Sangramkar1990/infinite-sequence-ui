import React from "react";
import { X } from "lucide-react";

// Helper function to get handle coordinates
const getHandleCoords = (node, handle) => {
    switch (handle) {
        case 'top': return { x: node.position.x + node.width / 2, y: node.position.y };
        case 'right': return { x: node.position.x + node.width, y: node.position.y + node.height / 2 };
        case 'bottom': return { x: node.position.x + node.width / 2, y: node.position.y + node.height };
        case 'left': return { x: node.position.x, y: node.position.y + node.height / 2 };
        default: return { x: node.position.x + node.width / 2, y: node.position.y + node.height / 2 };
    }
}

// Calculate the best connection points between two nodes
const getOptimalPath = (source, target) => {
    const handles = ['top', 'right', 'bottom', 'left'];
    let minDistance = Infinity;
    let bestPair = { sourceHandle: 'right', targetHandle: 'left' };

    for (const sh of handles) {
        for (const th of handles) {
            const sPos = getHandleCoords(source, sh);
            const tPos = getHandleCoords(target, th);
            const distance = Math.sqrt(Math.pow(sPos.x - tPos.x, 2) + Math.pow(sPos.y - tPos.y, 2));
            
            // Penalize connections to the same side (e.g., right-to-right)
            const anglePenalty = (sh === th) ? 1.5 : 1;
            
            if (distance * anglePenalty < minDistance) {
                minDistance = distance * anglePenalty;
                bestPair = { sourceHandle: sh, targetHandle: th };
            }
        }
    }

    const sourcePos = getHandleCoords(source, bestPair.sourceHandle);
    const targetPos = getHandleCoords(target, bestPair.targetHandle);
    
    return { sourcePos, targetPos };
}

const ArrowHead = ({ point, angle }) => {
  const arrowLength = 12;
  const arrowAngle = Math.PI / 6;

  const p1 = {
    x: point.x - arrowLength * Math.cos(angle - arrowAngle),
    y: point.y - arrowLength * Math.sin(angle - arrowAngle)
  };
  const p2 = {
    x: point.x - arrowLength * Math.cos(angle + arrowAngle),
    y: point.y - arrowLength * Math.sin(angle + arrowAngle)
  };

  return (
    <polygon
      points={`${point.x},${point.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
      fill="black"
    />
  );
}

export default function Edge({ edge, isHovered, onMouseEnter, onMouseLeave, onDelete }) {
  const { source, target, bidirectional } = edge;
  const { sourcePos, targetPos } = getOptimalPath(source, target);

  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  
  const path = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x + dx * 0.5} ${sourcePos.y}, ${sourcePos.x + dx * 0.5} ${targetPos.y}, ${targetPos.x} ${targetPos.y}`;

  const targetAngle = Math.atan2(dy, dx);
  const sourceAngle = Math.atan2(-dy, -dx);

  // Midpoint for the delete button
  const midX = sourcePos.x + dx * 0.5;
  const midY = sourcePos.y + dy * 0.5;

  return (
    <g onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Invisible wider path for easier hovering */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        className="cursor-pointer"
        style={{ pointerEvents: 'stroke' }}
      />
      {/* Visible path */}
      <path
        d={path}
        stroke={isHovered ? "#f59e0b" : "black"}
        strokeWidth="2.5"
        fill="none"
        className="transition-all"
      />
      
      {/* Arrow heads */}
      <ArrowHead point={targetPos} angle={targetAngle} />
      {bidirectional && <ArrowHead point={sourcePos} angle={sourceAngle} />}

      {/* Delete button */}
      {isHovered && (
        <foreignObject x={midX - 12} y={midY - 12} width="24" height="24">
          <button 
            onClick={onDelete} 
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </foreignObject>
      )}
    </g>
  );
}
