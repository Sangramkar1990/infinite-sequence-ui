import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import SidebarNavigation from "../components/dashboard/SidebarNavigation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "reactflow/dist/style.css";
import { flowService } from "../services/api";
import { CustomNode } from "../components/editor/CustomNode";

const FlowViewer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sequenceId = searchParams.get("sequenceId"); // Get sequenceId from URL
  const [sequenceName, setSequenceName] = useState("Loading Flow...");

  // Simplified nodeTypes for viewing only
  const nodeTypes = useMemo(
    () => ({
      custom: (props) => (
        <CustomNode
          {...props}
          data={{ ...props.data, destroyCard: () => {}, nodeId: props.id, deleteNode: () => {} }} // Disable editing functions
        />
      ),
    }),
    []
  );

  // Fetch flow data on component mount or sequenceId change
  useEffect(() => {
    if (sequenceId) {
      flowService.getFlow(sequenceId)
        .then((data) => {
          if (data && data.data) {
            setNodes(data.data.nodes || []);
            setEdges(data.data.edges || []);
            setSequenceName(data.data.sequence.name || "Unnamed Flow");
          } else {
            setError("Flow data not found.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch flow:", err);
          setError("Failed to load flow data.");
        });
    } else {
      setError("No sequence ID provided.");
    }
  }, [sequenceId]);

  // Read-only handlers for ReactFlow
  const onNodesChange = useCallback(
    (changes) => {
      // Allow only position changes for viewing, but don't save them
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      // No changes allowed for edges in viewer
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  return (
    <div className="flex">
      <SidebarNavigation selectedItem="sequences" />
      <div className="min-h-screen bg-gray-50 p-6" style={{ marginLeft: "306px", width: "calc(100% - 306px)" }}>
        {/* Breadcrumb */}
        {/* <div className="mb-6 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate(`/flow-builder?sequenceId=${sequenceId}`)}
          >
            Go back to sequence
          </span>{' '}
          &lt; View Sequence: {sequenceName}
        </div> */}

        <h1 className="text-3xl font-semibold text-center mb-6">
          Viewing Sequence: {sequenceName}
        </h1>

        <div style={{ height: "70vh", width: "100%" }}>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {!error && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange} // Keep for basic view interactions like selection
              onEdgesChange={onEdgesChange} // Keep for basic view interactions like selection
              nodeTypes={nodeTypes}
              fitView
              // Disable all editing props
              onConnect={() => {}}
              onNodeDragStop={() => {}}
              onEdgeClick={() => {}}
              onDrop={() => {}}
              onDragOver={() => {}}
              nodesDraggable={false} // Make nodes not draggable
              nodesConnectable={false} // Make nodes not connectable
              elementsSelectable={true} // Allow selection for viewing details
              panOnDrag={true} // Allow panning
              zoomOnScroll={true} // Allow zooming
              zoomOnPinch={true}
              zoomOnDoubleClick={true}
              paneMoveable={true}
              proOptions={{ hideAttribution: true }}
            >
              <MiniMap />
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowViewer;