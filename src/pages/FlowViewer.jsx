import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

// Dummy data for the sequence
const dummyNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 50, y: 50 },
    data: { name: 'Card 1', type: 'Type A', effect: 'Effect A', description: 'Description A' }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 330, y: 50 },
    data: { name: 'Card 2', type: 'Type B', effect: 'Effect B', description: 'Description B' }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 610, y: 50 },
    data: { name: 'Card 3', type: 'Type C', effect: 'Effect C', description: 'Description C' }
  }
];

const dummyEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true }
];

// Custom Node Component
const CustomNode = ({ data }) => {
  return (
    <div style={{ padding: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 8, minWidth: 220 }}>
      <div>
        <strong>{data.name}</strong><br />
        <small>Type: {data.type}</small><br />
        <small>Effect: {data.effect}</small><br />
        <small>{data.description}</small><br />
      </div>
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const FlowViewer = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {/* Parent div with d-flex class for layout */}
          <div className="d-flex mb-3 align-items-center justify-content-between">
            <select className="form-select w-25 me-2" id="sequenceSelect">
              <option value="sequence1">Default Sequence</option>
            </select>
            <input type="text" className="form-control w-25 me-2" placeholder="Search" />
            <div>
            <button className="btn btn-secondary me-2">Share</button>
            <button className="btn btn-secondary me-2">Create Card +</button>
            <button className="btn btn-secondary">Create Sequence +</button>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Flow Viewer</h3>
              <p className="text-muted">View the sequence of cards</p>
            </div>
            <div className="card-body">
              <div style={{ height: '70vh', width: '100%' }}>
                <ReactFlow
                  nodes={dummyNodes}
                  edges={dummyEdges}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowViewer;