import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Handle,
MarkerType ,
useNodesState,
  useEdgesState,
  applyNodeChanges, // Import applyNodeChanges
} from "reactflow";
import { useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import { useDispatch, useSelector } from "react-redux";
import { setSequence } from "../store/sequenceSlice";
import "reactflow/dist/style.css";
import {
  fetchUserSequences,
  fetchSequenceById,
  saveSequence as saveSequenceThunk, // Renamed to avoid conflict with local saveSequence function
  searchCards,
  fetchCardById,
  clearFlowEditorError,
  clearSaveError,
  clearSearchError,
  resetSearchResults,
  deleteSequence,
} from "../store/flowEditorSlice";
import { CustomNode } from "../components/editor/CustomNode";

// Define card layout sizes
const initialPosition = { x: 50, y: 50 };
const cardWidth = 250;
const cardHeight = 150;
const gapX = 80;
const gapY = 30;
const canvasWidth = 1000;

// Custom Node Component
// const CustomNode = ({ data }) => {
//   return (
//     <div
//       style={{
//         padding: 10,
//         background: "#fff",
//         border: "1px solid #ccc",
//         borderRadius: 8,
//         minWidth: 220,
//       }}
//     >
//       <Handle type="target" position="left" style={{ background: "#555" }} />
//       <div>
//       <iframe
//           width="350"
//           height="197"
//           src={data.url}
//           title="Embedded Video"
          
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           style={{ marginTop: '1rem' }}
//         />
//         <br/>
//         <strong>{data.name}</strong>
//         <br />
//         <small>Type: {data.type}</small>
//         <br />
//         <small>Effect: {data.effect}</small>
//         <br />
//         <small>{data.description}</small>
//         <br />
//       </div>
//       <Handle type="source" position="right" style={{ background: "#555" }} />
//     </div>
//   );
// };

const nodeTypes = { custom: CustomNode };

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSequenceParams = searchParams.get("sequenceSelected");
  const cardId = searchParams.get("cardId");
  // const hasCardId = cardId ? true : false;
  const dispatch = useDispatch();
  const {
    sequences: flowEditorSequences, // Renamed to avoid conflict with local state
    currentSequence,
    searchResults: flowEditorSearchResults, // Renamed
    status: flowEditorStatus,
    error: flowEditorError,
    saveStatus,
    saveError,
    searchStatus,
    searchError,
    currentCard, 
  fetchCardStatus, 
  fetchCardError,
  } = useSelector((state) => state.flowEditor);
  const [sequenceSelected, setSequenceSelected] = useState(
    urlSequenceParams || ""
  );
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const handleDeleteSequence = async () => {
    if (!sequenceSelected) return;
    dispatch(deleteSequence(sequenceSelected))
      .unwrap()
      .then(() => {
        setSequenceSelected("");
        setNodes([]);
        setEdges([]);
        setSelectedSequenceName("");
        setSequences(sequences.filter(seq => seq.id !== sequenceSelected));
      })
      .catch((err) => {
        setError(err);
      });
  };

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

  // Add onNodesChange handler
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      setHasUnsavedChanges(true);
    },
    [setNodes]
  );

  // Function to convert nodes and edges to linked list format
  const convertToLinkedList = () => {
    const nodeMap = new Map();
    nodes.forEach((node) => {
      // console.log("convert linked list", node);
      return nodeMap.set(node.id, {
        ...node.data,
        position: {x : node.position.x * 1.0, y: node.position.y * 1.0}, // Include position data
        next: null,
      });
    });
    console.log("edges", edges);

    edges.forEach((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      console.log("edge : ", edge);
      console.log("source node : ", sourceNode);
      console.log("target node :", targetNode);
      if (sourceNode) {
        sourceNode.next_id = targetNode.id;
        sourceNode.next = edge.target;
      }
    });

    // Convert to array starting from nodes without incoming edges
    const startNodes = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );

    const linkedList = [];
    const processedNodes = new Set();

    const traverseList = (nodeId) => {
      console.log("traverseList nodeId", nodeId);
      if (!nodeId || processedNodes.has(nodeId)) return;

      const node = nodeMap.get(nodeId);
      if (node) {
        processedNodes.add(nodeId);
        linkedList.push({
          id: node.id,
          position: node.position,
          next: node.next_id,
        });
        traverseList(node.next);
      }
    };

    startNodes.forEach((node) => traverseList(node.id));

    return linkedList;
  };

  // Function to save sequence
  const saveSequence = async () => {
    
    if (!sequenceSelected) return;
    const linkedListData = convertToLinkedList(); // This logic remains
    console.log("linked list data ", {linkedListData});
    dispatch(
      saveSequenceThunk({
        sequenceId: sequenceSelected,
        cardsData: linkedListData,
      })
    )
      .unwrap() // Use unwrap to handle promise resolution/rejection here if needed
      .then(() => {
        setHasUnsavedChanges(false);
        // Optionally: dispatch(clearSaveError());
      })
      .catch((err) => {
        // Error is already in saveError from the slice, but you can log or handle locally too
        console.error("Failed to save sequence (local catch):", err);
      });
    
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

  // display selected sequence on page load
  useEffect(() => {
    let is_url_sequence_id = urlSequenceParams ? true : false;
    if (is_url_sequence_id) {
      dispatch(fetchSequenceById(urlSequenceParams)).then((data) => {
        
        if (data.meta.requestStatus === "fulfilled") {
          processSequenceData(data);
        }
      });
    }
  }, [urlSequenceParams]);
  useEffect(() => {
    
      if (cardId) {
        dispatch(fetchCardById(cardId))
          .unwrap()
          .then((cardData) => {
            // console.log("Fetched card:", cardData);
            
              const cardFromID = {
                name: cardData.card.name,
                description:  cardData.card.description,
                url:  cardData.card.url ,
                type:  cardData.card.type , 
                effect:  cardData.card.effect , 
                user:  cardData.card.user , 
                id:  cardData.id
                
              }
              console.log("Fetched card:", cardFromID);
              handleAddCard(cardFromID);
            // }
            
            
          })
          .catch((err) => {
            console.error("Failed to fetch card:", err);
            // Handle error display if needed
          });
      // searchHandler(cardId);
    }
  
}, [ cardId, dispatch]);

  // Modify handleAddCard to trigger auto-save
  const handleAddCard = (card) => {

    
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: "custom",
      position: calculateNewPosition(nodes.length),
      data: {
        name: card.name,
        type: card.type,
        effect: card.effect,
        description: card.description,
        url: card.url,
        id: card.id,
      },
    };
    console.log("handle add card", {newNode});

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setSearchResults([]);
    setSearchQuery("");
    setHasUnsavedChanges(true);
  };

  // Add edge handling to trigger auto-save
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    
    setHasUnsavedChanges(true);
  }, []);

  // Remove handleSearch function as we'll search on input change
  // function to handle search
  const searchHandler = (query) => {
    if (!query.trim()) {
      dispatch(resetSearchResults()); // Use action to clear results in store
      return;
    }
    dispatch(searchCards(query)).then((data) => {
     
      if (data.meta.requestStatus === "fulfilled") {
        setSearchResults(data.payload);
        setError(null);
      }
    });
  };
  const handleSearchChange = async (e) => {
    const query = e.target.value;

    setSearchQuery(query);
    searchHandler(query);

    
    if (!query.trim()) {
      dispatch(resetSearchResults()); // Use action to clear results in store
      return;
    }
    dispatch(searchCards(query)).then((data) => {
      console.log("search from redux thunk", data);
    });
  };

  useEffect(() => {
    

    dispatch(fetchUserSequences()).then((data) => {
      console.log("data----->", data.payload);
      setSequences(data.payload);
      setError(null);
    });
  }, [dispatch]);

  // Function to convert linked list to flow nodes and edges
  const convertLinkedListToFlow = (cards) => {
    if (!cards || !cards.length) return { nodes: [], edges: [] };

    const newNodes = [];
    const newEdges = [];
    // Remove initialPosition calculation here, use stored position

    cards.forEach((card, index) => {
      console.log("each card", card);
      const nodeId = `node-${index}`;
      newNodes.push({
        id: nodeId,
        type: "custom",
        position: card.position || calculateNewPosition(index), // Use stored position or calculate if not present
        data: {
          name: card.name,
          type: card.type,
          effect: card.effect,
          description: card.description,
          url: card.url,
          id: card.id,
          position: card.position,
          next: card.next,
        },
      });

      if (card.next) {
        newEdges.push({
          id: `edge-${nodeId}-node-${cards.findIndex(
            (c) => c.id === card.next
          )}`,
          source: nodeId,
          target: `node-${cards.findIndex((c) => c.id === card.next)}`,
          markerStart:{ type: MarkerType.ArrowClosed },
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Update position for next node
      // position = calculateNewPosition(index + 1);
    });

    return { nodes: newNodes, edges: newEdges };
  };

  // Modify sequence selection handler
  const [selectedSequenceName, setSelectedSequenceName] = useState("");

  //fetch sequence
  const processSequenceData = (data) => {
    // Extract sequence data
    let sequenceData = data.payload;

    // Convert linked list to flow representation
    const flowData = convertLinkedListToFlow(sequenceData.cards);

    // Dispatch the sequence data to Redux store
    dispatch(setSequence([sequenceData]));

    // Logging information
    console.log(sequenceData);
    console.log("new nodes", flowData.nodes);
    console.log("new edges", flowData.edges);

    // Updating state values
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
    setSelectedSequenceName(sequenceData.name);
    setError(null);
  };

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
    dispatch(fetchSequenceById(selectedId)).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        processSequenceData(data);
      }

     
    });


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
              value={sequenceSelected || ""}
              onChange={handleSequenceSelect}
            >
              <option value="">
                {selectedSequenceName || "Select a sequence"}
              </option>
              {sequences?.map((sequence) => (
                <option key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </option>
              ))}
            </select>

            <div
              className="d-flex flex-column w-40 position-relative"
              style={{ width: "30%" }}
            >
              <input
                type="text"
                className="form-control w-100 me-2"
                placeholder="Search"
                value={searchQuery || ""}
                onChange={handleSearchChange}
              />
              
              {searchResults.length > 0 && (
                <div
                  className="position-absolute start-0 w-25"
                  style={{ zIndex: 1000, top: "100%" }}
                >
                  <div className="card shadow">
                    <div className="card-body p-0">
                      <h6 className="p-3 mb-0 border-bottom">Search Results</h6>
                      <div
                        className="list-group list-group-flush"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        {searchResults.map((card) => (
                          <button
                            key={card.id}
                            className="list-group-item list-group-item-action border-0"
                            onClick={() => handleAddCard(card)}
                          >
                            <strong>{card.name}</strong>
                            <br />
                            <small className="text-muted">
                              {card.description}
                            </small>
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
                onClick={() => navigate("/create-card")}
              >
                Create Card +
              </button>
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate("/create-sequence")}
              >
                Create Sequence +
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteSequence}
                disabled={!sequenceSelected}
              >
                Delete Sequence
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>
                Flow Editor{" "}
                {selectedSequenceName && `- ${selectedSequenceName}`}
              </h3>
              <p className="text-muted">
                Create and connect cards in this editor
              </p>
            </div>
            <div className="card-body">
              <div style={{ height: "70vh", width: "100%" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onConnect={onConnect}
                  onNodesChange={onNodesChange} // Add onNodesChange handler
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
