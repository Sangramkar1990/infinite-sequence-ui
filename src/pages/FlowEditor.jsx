import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Handle,
} from "reactflow";
import { useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import "reactflow/dist/style.css";

// Define card layout sizes
const initialPosition = { x: 50, y: 50 };
const cardWidth = 250;
const cardHeight = 150;
const gapX = 80;
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
      </div>
      <Handle type="source" position="right" style={{ background: '#555' }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSequenceParams = searchParams.get("sequenceSelected");
  const [sequenceSelected, setSequenceSelected] = useState(urlSequenceParams || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const calculateNewPosition = (nodeCount) => {
    const cardsPerRow = Math.floor(canvasWidth / (cardWidth + gapX));
    const row = Math.floor(nodeCount / cardsPerRow);
    const col = nodeCount % cardsPerRow;

    return {
      x: initialPosition.x + col * (cardWidth + gapX),
      y: initialPosition.y + row * (cardHeight + gapY),
    };
  };

  // Add new state for tracking changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Function to convert nodes and edges to linked list format
  const convertToLinkedList = () => {
    const nodeMap = new Map();
    nodes.forEach(node => {
      nodeMap.set(node.id, {
        ...node.data,
        next: null
      });
    });

    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      if (sourceNode) {
        sourceNode.next = edge.target;
      }
    });

    // Convert to array starting from nodes without incoming edges
    const startNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );

    const linkedList = [];
    const processedNodes = new Set();

    const traverseList = (nodeId) => {
      if (!nodeId || processedNodes.has(nodeId)) return;
      
      const node = nodeMap.get(nodeId);
      if (node) {
        processedNodes.add(nodeId);
        linkedList.push({
          name: node.name,
          type: node.type,
          effect: node.effect,
          description: node.description,
          url: node.url,
          next: node.next
        });
        traverseList(node.next);
      }
    };

    startNodes.forEach(node => traverseList(node.id));
    return linkedList;
  };

  // Function to save sequence
  const saveSequence = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !sequenceSelected) return;

      const linkedListData = convertToLinkedList();
      
      const response = await fetch(`http://localhost:5001/api/sequences/${sequenceSelected}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cards: linkedListData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save sequence');
      }

      const result = await response.json();
      if (result.success) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error saving sequence:', error);
    }
  };

  // Add auto-save effect
  useEffect(() => {
    console.log("auto save init", hasUnsavedChanges, sequenceSelected);
    if (hasUnsavedChanges && sequenceSelected) {
     
      const timeoutId = setTimeout(() => {
        saveSequence();
        
      }, 2000); // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, hasUnsavedChanges, sequenceSelected]);

  // Modify handleAddCard to trigger auto-save
  const handleAddCard = (card) => {
    console.log("card added");
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: calculateNewPosition(nodes.length),
      data: {
        name: card.name,
        type: card.type,
        effect: card.effect,
        description: card.description,
        url: card.url,
      },
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setSearchResults([]);
    setSearchQuery('');
    setHasUnsavedChanges(true);
  };

  // Add edge handling to trigger auto-save
  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge(params, eds));
    setHasUnsavedChanges(true);
  }, []);

  // Remove handleSearch function as we'll search on input change

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `http://localhost:5001/api/sequences/search/cards?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search cards");
      }

      const result = await response.json();
      if (result.success) {
        setSearchResults(result.data);
        setError(null);
      } else {
        throw new Error(result.message || "Failed to search cards");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error searching cards:", error);
    }
  };

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await fetch(
          "http://localhost:5001/api/sequences/user/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sequences");
        }

        const result = await response.json();
        if (result.success) {
          setSequences(result.data);
          setError(null);
        } else {
          throw new Error(result.message || "Failed to fetch sequences");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching sequences:", error);
      }
    };

    fetchSequences();
  }, []);

  // Function to convert linked list to flow nodes and edges
  const convertLinkedListToFlow = (cards) => {
    if (!cards || !cards.length) return { nodes: [], edges: [] };

    const newNodes = [];
    const newEdges = [];
    let position = { x: initialPosition.x, y: initialPosition.y };

    cards.forEach((card, index) => {
      const nodeId = `node-${index}`;
      newNodes.push({
        id: nodeId,
        type: 'custom',
        position: { ...position },
        data: {
          name: card.name,
          type: card.type,
          effect: card.effect,
          description: card.description,
          url: card.url
        }
      });

      if (card.next) {
        newEdges.push({
          id: `edge-${nodeId}-node-${cards.findIndex(c => c.name === card.next)}`,
          source: nodeId,
          target: `node-${cards.findIndex(c => c.name === card.next)}`
        });
      }

      // Update position for next node
      position = calculateNewPosition(index + 1);
    });

    return { nodes: newNodes, edges: newEdges };
  };

  // Modify sequence selection handler
  const [selectedSequenceName, setSelectedSequenceName] = useState("");

  // Modify handleSequenceSelect
  const handleSequenceSelect = async (event) => {
    const selectedId = event.target.value;
    if (!selectedId) {
      setNodes([]);
      setEdges([]);
      setSelectedSequenceName("");
      return;
    }
    setSequenceSelected(selectedId);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/sequences/${selectedId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sequence');
      }

      const result = await response.json();
      if (result.success && result.data) {
        const flowData = convertLinkedListToFlow(result.data.cards);
        setNodes(flowData.nodes);
        setEdges(flowData.edges);
        setSelectedSequenceName(result.data.name); // Set the sequence name
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching sequence:', error);
    }
  };

  // Update the return statement to match FlowViewer's layout
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="d-flex mb-3 align-items-center justify-content-between">
            <select
              className="form-select w-25 me-2"
              id="sequenceSelect"
              value={sequenceSelected || ''}
              onChange={handleSequenceSelect}
            >
              <option value="">{selectedSequenceName || "Select a sequence"}</option>
              {sequences.map((sequence) => (
                <option key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </option>
              ))}
            </select>

            <div className="d-flex flex-column w-40 position-relative" style={{ width: '40%' }}>
              <input
                type="text"
                className="form-control w-100 me-2"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <div className="position-absolute start-0 w-25" style={{ zIndex: 1000, top: '100%' }}>
                  <div className="card shadow">
                    <div className="card-body p-0">
                      <h6 className="p-3 mb-0 border-bottom">Search Results</h6>
                      <div className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {searchResults.map((card) => (
                          <button
                            key={card.id}
                            className="list-group-item list-group-item-action border-0"
                            onClick={() => handleAddCard(card)}
                          >
                            <strong>{card.name}</strong><br />
                            <small className="text-muted">{card.description}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button className="btn btn-secondary me-2">Share</button>
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate('/create-card')}
              >
                Create Card +
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/create-sequence')}
              >
                Create Sequence +
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Flow Editor {selectedSequenceName && `- ${selectedSequenceName}`}</h3>
              <p className="text-muted">Create and connect cards in this editor</p>
            </div>
            <div className="card-body">
              <div style={{ height: '70vh', width: '100%' }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onConnect={onConnect}
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
