import React, { useState, useEffect } from 'react'; // Modified: Added useState, useEffect
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
  const [organizationInfo, setOrganizationInfo] = useState(null); // null: loading, string: name, false: individual

  useEffect(() => {
    const fetchOrganizationInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (!token) {
          setOrganizationInfo(false); // No token, assume individual
          console.log('No token found, defaulting to individual.');
          return;
        }

        // Ensure this endpoint matches the one you set up in your backend
        const response = await fetch('http://localhost:5001/api/organization/status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // It's important to check response.ok first
        if (!response.ok) {
          // If the API intentionally returns an error status for "not found" or "no org",
          // you might want to parse the body to see if it's a structured "false" response.
          // For now, any non-ok status is treated as an error or leads to "Individual".
          console.error(`API error! status: ${response.status}`);
          const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty object
          console.error('Error data from API:', errorData);
          setOrganizationInfo(false); // Default to individual on error
          return;
        }

        const result = await response.json();

        if (result.success && result.data && result.data.organizationName) {
          setOrganizationInfo(result.data.organizationName);
        } else {
          // This covers cases where result.success is true but organizationName is false or not present
          setOrganizationInfo(false);
        }
      } catch (error) {
        console.error("Failed to fetch organization info:", error);
        setOrganizationInfo(false); // On network error or JSON parsing error, assume individual
      }
    };

    fetchOrganizationInfo();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {/* Parent div with d-flex class for layout */}
          <div className="d-flex mb-3 align-items-center justify-content-between">
            {/* Organization/Individual Info Display - Added to the top-left */}
            <div className="me-3" style={{ minWidth: '150px', textAlign: 'left', fontWeight: 'bold' }}>
              {organizationInfo === null && <span>Loading...</span>}
              {organizationInfo && typeof organizationInfo === 'string' && <span>Organization: {organizationInfo}</span>}
              {organizationInfo === false && <span>Individual</span>}
            </div>
            
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