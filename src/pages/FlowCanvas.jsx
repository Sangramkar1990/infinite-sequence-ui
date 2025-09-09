
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
// need to create TechniqueNode done
import { useParams } from "react-router-dom";
import TechniqueNode from "../components/editor/TechniqueNode";
// need to create Edge
// import Edge from "./Edge";
import Edge from "../components/editor/Edge";
import {
  Dialog,
  DialogContent,
} from "../components/ui/dialog";
import { sequenceService } from "../services/api";





const NODE_WIDTH = 288;
const NODE_HEIGHT = 160;

export default function FlowCanvas() {
  const canvasRef = useRef(null);
  const { id } = useParams();
  console.log("received id", id)
  
  useEffect(() => {
    if (id) {
      const fetchSequence = async () => {
        try {
          const response = await sequenceService.getSequenceById(id);
          console.log("Sequence data:", response);
          // Here you can update your state with the fetched sequence data
          // For example: setNodes(response.nodes);
        } catch (error) {
          console.error("Error fetching sequence:", error);
        }
      };
      
      fetchSequence();
    }
  }, [id]);

  // { nodes, setNodes, allTechniques }
   const allTechniques = useMemo(() => [
    {
      id: 'tech_1',
      name: 'Armbar from Guard',
      description: 'Basic submission from closed guard position',
      type: 'submission',
      difficulty_level: 'beginner',
      tags: ['guard', 'submission', 'fundamental'],
      video_url: 'https://www.youtube.com/watch?v=example1'
    },
    {
      id: 'tech_2',
      name: 'Triangle Choke',
      description: 'Submission using legs to create a triangle around opponent\'s neck and arm',
      type: 'submission',
      difficulty_level: 'intermediate',
      tags: ['guard', 'submission'],
      video_url: 'https://www.youtube.com/watch?v=example2'
    },
    {
      id: 'tech_3',
      name: 'Guard Pass',
      description: 'Basic technique to pass the closed guard',
      type: 'position',
      difficulty_level: 'beginner',
      tags: ['guard', 'passing'],
      video_url: 'https://www.youtube.com/watch?v=example3'
    }
  ], []);

  // State for nodes in the flow canvas
  const [nodes, setNodes] = useState([
    {
      id: 'node_1',
      techniqueId: 'tech_1',
      position: { x: 100, y: 100 },
      connections: ['node_2']
    },
    {
      id: 'node_2',
      techniqueId: 'tech_2',
      position: { x: 400, y: 200 },
      connections: []
    }
  ]);
  
  const [draggingNode, setDraggingNode] = useState(null);
  const [drawingEdge, setDrawingEdge] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDrawingEdge(null);
      setDraggingNode(null);
    };

    const handleGlobalMouseMove = (e) => {
      if (drawingEdge) {
        const canvasBounds = canvasRef.current?.getBoundingClientRect();
        if (canvasBounds) {
          setMousePosition({
            x: e.clientX - canvasBounds.left,
            y: e.clientY - canvasBounds.top
          });
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [drawingEdge, draggingNode]); // Added draggingNode to dependencies

  const handleMouseMove = useCallback((e) => {
    if (draggingNode) {
      setNodes(prevNodes => prevNodes.map(n =>
        n.id === draggingNode.nodeId
          ? { ...n, position: { 
              x: n.position.x + e.movementX,
              y: n.position.y + e.movementY
            } }
          : n
      ));
    }
  }, [draggingNode, setNodes]);

  const handleDrop = (e) => {
    e.preventDefault();
    const technique = JSON.parse(e.dataTransfer.getData("application/json"));
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasBounds.left - NODE_WIDTH / 2;
    const y = e.clientY - canvasBounds.top - NODE_HEIGHT / 2;

    const newNode = {
      id: 'node_' + Date.now() + Math.random().toString(36).substr(2, 9),
      techniqueId: technique.id,
      position: { x, y },
      connections: [],
    };
    setNodes(prev => [...prev, newNode]);
  };
  
  const onNodeDragStart = (nodeId, event) => {
    if (!drawingEdge) {
      setDraggingNode({ nodeId });
    }
  };
  
  const onEdgeDrawStart = (sourceNodeId, sourceHandle, event) => {
    event.preventDefault();
    event.stopPropagation();
    setDrawingEdge({ sourceNodeId, sourceHandle });
    
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (canvasBounds) {
      setMousePosition({
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      });
    }
  };

  const onNodeMouseUp = (targetNodeId) => {
    if (drawingEdge && targetNodeId && drawingEdge.sourceNodeId !== targetNodeId) {
      setNodes(prev => prev.map(n => {
        if (n.id === drawingEdge.sourceNodeId) {
          const newConnections = [...(n.connections || [])];
          if (!newConnections.includes(targetNodeId)) {
            newConnections.push(targetNodeId);
          }
          return { ...n, connections: newConnections };
        }
        return n;
      }));
    }
    setDrawingEdge(null);
  };

  const onNodeDelete = (nodeId) => {
    setNodes(prev => prev
      .filter(n => n.id !== nodeId)
      .map(n => ({
        ...n,
        connections: (n.connections || []).filter(c => c !== nodeId)
      }))
    );
  };

  const handleDeleteEdge = (edge) => {
    setNodes(prev => prev.map(node => {
      if (node.id === edge.source.id) {
        return {
          ...node,
          connections: (node.connections || []).filter(connId => connId !== edge.target.id)
        };
      }
      if (edge.bidirectional && node.id === edge.target.id) {
         return {
          ...node,
          connections: (node.connections || []).filter(connId => connId !== edge.source.id)
        };
      }
      return node;
    }));
  };

  const getTechniqueById = useCallback((id) => {
    return allTechniques.find(t => t.id === id);
  }, [allTechniques]);

  const nodeElements = nodes.map(node => ({
    ...node,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    technique: getTechniqueById(node.techniqueId)
  })).filter(node => node.technique);
  
  const edgeElements = [];
  const processedEdges = new Set();
  nodeElements.forEach(sourceNode => {
    (sourceNode.connections || []).forEach(targetNodeId => {
      const targetNode = nodeElements.find(n => n.id === targetNodeId);
      if (targetNode) {
        const edgeId = [sourceNode.id, targetNode.id].sort().join('--');
        if (processedEdges.has(edgeId)) return;
        processedEdges.add(edgeId);

        const isBidirectional = targetNode.connections?.includes(sourceNode.id);
        edgeElements.push({
          id: `${sourceNode.id}->${targetNode.id}`,
          source: sourceNode,
          target: targetNode,
          bidirectional: isBidirectional,
        });
      }
    });
  });

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-slate-200 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] relative overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      style={{width: '100vw', height: '100vh'}} 
    >
      
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {edgeElements.map((edge) => (
          <Edge 
            key={edge.id} 
            edge={edge} 
            isHovered={hoveredEdgeId === edge.id}
            onMouseEnter={() => setHoveredEdgeId(edge.id)}
            onMouseLeave={() => setHoveredEdgeId(null)}
            onDelete={() => handleDeleteEdge(edge)}
          />
        ))}
        {drawingEdge && (
          <line
            x1={nodeElements.find(n=>n.id === drawingEdge.sourceNodeId)?.position.x + NODE_WIDTH / 2}
            y1={nodeElements.find(n=>n.id === drawingEdge.sourceNodeId)?.position.y + NODE_HEIGHT / 2}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
      
      {nodeElements.map(node => (
        <TechniqueNode
          key={node.id}
          node={node}
          onDragStart={onNodeDragStart}
          onMouseUp={onNodeMouseUp}
          onEdgeDrawStart={onEdgeDrawStart}
          onDelete={onNodeDelete}
          onPlayVideo={setPlayingVideoUrl}
        />
      ))}
      
      {nodes.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-slate-500 pointer-events-none">
              <p className="text-lg font-medium">Drag techniques from the library to start building your flow.</p>
              <p className="text-xs mt-2">Drag from the amber connection points to link techniques together.</p>
          </div>
      )}

      {playingVideoUrl && (
        <Dialog open={!!playingVideoUrl} onOpenChange={() => setPlayingVideoUrl(null)}>
            <DialogContent className="max-w-4xl p-0">
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={playingVideoUrl.replace("watch?v=", "embed/")}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

