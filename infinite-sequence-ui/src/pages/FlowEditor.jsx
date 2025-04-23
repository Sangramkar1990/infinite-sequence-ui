import { useState } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

const FlowEditor = () => {
  // This is just a placeholder for the flow editor
  // We'll implement the actual card creation and connection later
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Flow Editor</h3>
              <p className="text-muted">Create and connect cards in this editor</p>
            </div>
            <div className="card-body">
              <div style={{ height: '70vh', width: '100%' }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                >
                  {/* We'll add node types and controls later */}
                </ReactFlow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;
