import { useState, useCallback } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background, Handle } from 'reactflow';
import 'reactflow/dist/style.css';

// Define card layout sizes
const initialPosition = { x: 50, y: 50 };
const cardWidth = 250;
const cardHeight = 150;
const gapX = 30;
const gapY = 30;
const canvasWidth = 1000;

// Custom Node Component
const CustomNode = ({ data }) => {
  return (
    <div style={{ padding: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 8, minWidth: 220 }}>
      <Handle type="target" position="left" style={{ background: '#555' }} />
      <div>
        <strong>{data.name}</strong><br />
        <small>Type: {data.type}</small><br />
        <small>Effect: {data.effect}</small><br />
        <small>{data.description}</small><br />
        {data.youtube && (
          <a href={data.youtube} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
            YouTube
          </a>
        )}
      </div>
      <Handle type="source" position="right" style={{ background: '#555' }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [formData, setFormData] = useState({
    youtube: '',
    name: '',
    type: '',
    effect: '',
    description: ''
  });

  const [lastPosition, setLastPosition] = useState(initialPosition);
  const [lastNodeId, setLastNodeId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCard = () => {
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type: 'custom',
      position: lastPosition,
      data: { ...formData }
    };

    setNodes((nds) => [...nds, newNode]);

    if (lastNodeId) {
      const newEdge = {
        id: `e${lastNodeId}-${id}`,
        source: lastNodeId,
        target: id,
        animated: true
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }

    // Calculate new position
    let nextX = lastPosition.x + cardWidth + gapX;
    let nextY = lastPosition.y;

    if (nextX + cardWidth > canvasWidth) {
      nextX = initialPosition.x;
      nextY += cardHeight + gapY;
    }

    setLastPosition({ x: nextX, y: nextY });
    setLastNodeId(id);

    // Reset form
    setFormData({
      youtube: '',
      name: '',
      type: '',
      effect: '',
      description: ''
    });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card mb-3">
            <div className="card-header">
              <h3>Create New Card</h3>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {['youtube', 'name', 'type', 'effect', 'description'].map((field) => (
                  <div className="col-md-6" key={field}>
                    <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-3" onClick={handleAddCard}>
                Add Card
              </button>
            </div>
          </div>

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

export default FlowEditor;
