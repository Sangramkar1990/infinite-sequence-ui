import { useState, useMemo, useEffect } from 'react';
import SidebarNavigation from '../components/dashboard/SidebarNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceService } from '../services/api';
import { setSequences, fetchCardsByUser, fetchAllCards } from '../store/sequenceSlice';
import { Play , Target, Edit, Trash2} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CreateCardModal from '../components/dashboard/CreateCardModal';
import { cardService } from '../services/api';
// import Button from '../components/ui/button';



export default function TechniquesNew() {
  const [searchParams] = useSearchParams();
  const createTechniques = searchParams.get('createNew') === 'true';
  const newCard = searchParams.get('new') === 'true';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showMyTechniques, setShowMyTechniques] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState(null);


  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { cards, loading } = useSelector((state) => state.sequence);
  const { sequences } = useSelector((state) => state.sequence);

  const hasQuery = searchParams.has('new');
   const handleDeleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this technique? This action cannot be undone.')) {
      cardService.destroyCard(cardId)
      .then(() => {
        // Dispatch action to remove card from state
        dispatch(fetchCardsByUser()); 
      })
      .catch(error => {
        console.error('Failed to delete card:', error);
        // Optionally, show an error message to the user
      });

      // Implement actual delete logic here later
      console.log(`Deleting card with ID: ${cardId}`);
      // For now, you might want to dispatch an action to remove it from the UI optimistically
      // or re-fetch all cards after a successful deletion.
    }
  };

  // useEffect(()=>{
  //   console.log("create techniques", {createTechniques})
  // },[createTechniques]);

   useEffect(() => {
    if(showMyTechniques){
      dispatch(fetchCardsByUser());
    }else{
      dispatch(fetchAllCards());
    }
  }, [dispatch, hasQuery, showMyTechniques]);

  // useEffect(() => {
  //   const fetchSequences = async () => {
  //     try {
  //       const response = await sequenceService.getAllSequences();
  //       dispatch(setSequences(response.data));
  //     } catch (error) {
  //       console.error('Failed to fetch sequences:', error);
  //     }
  //   };
  //   fetchSequences();
  // }, [dispatch]);
  // const filtered = useMemo(() => {
  //   if (!cards) return [];
  //   const lower = searchTerm.toLowerCase();
  //   return cards.data.filter((item) => {
  //     return (
  //       item.name.toLowerCase().includes(lower) ||
  //       (item.description && item.description.toLowerCase().includes(lower)) ||
  //       (item.type && item.tags.toLowerCase().includes(lower)) ||
  //       (item.effect && item.effect.toLowerCase().includes(lower))
  //     );
  //   });
  // }, [searchTerm, cards]);

  useEffect(() => {
   
      console.log('cards ----- >',cards)
  
},[cards])
useEffect(() => {
    console.log('loading ----- >',loading)    }, [loading])

  // Derive unique filter options
  // const types = useMemo(
  //   () => ['All', ...new Set(cards.map((i) => i.type))],
  //   [cards]
  // );

  const types = useMemo(() => { 
   const list = cards.data ?? [];
    const uniqueTypes = [...new Set(list.map(item => item.type))];
    return ['All', ...uniqueTypes]; 
  },[cards.data]
  );
  // const levels = useMemo(
  //   () => ['All', ...new Set(sequences.map((i) => i.level))],
  //   [sequences]
  // );

  // Filtered list
  // const filtered = useMemo(() => {
  //   const term = searchTerm.toLowerCase();
  //   return sequences.filter((item) => {
  //     // text search
  //     const matchesText =
  //       item.name.toLowerCase().includes(term) ||
  //       item.description.toLowerCase().includes(term) 

      

  //     return matchesText ;
  //   });
  // }, [searchTerm, selectedType, selectedLevel, sequences]);

  return (
    <div className="flex">

    <SidebarNavigation selectedItem="techniques" triggerCreateTechniues={createTechniques}/>
    <div className="min-h-screen bg-gray-50 p-6 " style={{marginLeft: "306px", width: "calc(100% - 306px)"}}>
      <h1 className="text-3xl font-semibold text-center mb-6">
        BJJ Techniques Library
      </h1>
       {showMyTechniques ? (
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Techniques created by you
          </h2>
        ) : (
          <h2 className="text-3xl font-semibold mb-4 text-center">
            All techniques
          </h2>
        )}

      {/* Search + Filters */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search techniques..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        {showMyTechniques ?
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
        onClick={() => setShowMyTechniques(false)}>
          show all technique
        </button>
        : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  
        onClick={() => setShowMyTechniques(true)}>
          My Techniques
        </button>}
        

        {/* <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl === 'All'
                ? 'All Levels'
                : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </option>
          ))}
        </select> */}
      </div>

      {/* Count */}
      <p className="max-w-4xl mx-auto text-gray-600 mb-4">
        {loading === 'succeeded' && `${cards.length} techniques found` }
      </p>

      {/* Cards Grid */}
      
         {loading === 'loading' && <p className="text-center text-gray-500">Loading...</p>}
      {loading === 'failed' && <p className="text-center text-red-500">Error loading sequences.</p>}
      {loading === 'succeeded' && cards.length !== 0 ?
       ( 
        <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {
          cards.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex me-auto">

              
               <div
              className="p-2 bg-gray-200 rounded-lg flex items-center justify-center w-10 h-10 me-2"
              
            >
              <Target className="w-4 h-4 inline-block " />
              </div>
              <h5 className="text-xl font-medium">{item.name}</h5>
              </div>
              {/* <a href={item.url} target="_blank" rel="noopener noreferrer"><Play className="w-4 h-4 inline-block mr-1" /></a> */}
              
             
            </div>

            <div className="flex flex-wrap justify-between">
            {item.difficulty &&(<span
              className={`self-start text-sm font-semibold mb-2 px-2 py-1 rounded ${
                item.difficulty === 'Advanced'
                  ? 'bg-red-200 text-red-800'
                  : item.difficulty === 'Intermediate'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {item.difficulty}
            </span>)}

            <span className="text-xs border border-yellow-500 uppercase bg-yellow-200 text-yellow-800 px-2 py-1 rounded-xl  w-fit mb-2">
                {item.effect}
              </span>

             <span className="text-xs border border-blue-500 uppercase bg-red-200 text-red-800 px-2 py-1 rounded-xl  w-fit mb-2">
                {item.type}
              </span>

              </div>

          
            <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
            <div className="text-xs text-gray-400">
                Published: {new Date(item.createdAt).toLocaleDateString()}
              </div>

               <div  className="flex justify-end gap-2 mt-4">
                {/* Play Button */}
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative group">
                  <button className="flex justify-center items-center bg-blue-100 hover:bg-blue-200 text-blue font-bold p-2 rounded-full w-10 h-10">
                    <Play className="w-5 h-5" />
                  </button>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Play</span>
                </a>

                {showMyTechniques && (
                  <>
                    {/* Edit Button */}
                    <button 
                      className="relative group flex justify-center items-center bg-green-100 hover:bg-green-200 text-green font-bold p-2 rounded-full w-10 h-10"
                      onClick={() => {
                        setSelectedCardData(item);
                        setShowCardModal(true);
                      }}
                    >
                      <Edit className="w-5 h-5" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button 
                      className="relative group flex justify-center items-center bg-red-100 hover:bg-red-200 text-red font-bold p-2 rounded-full w-10 h-10"
                      onClick={() => handleDeleteCard(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Delete</span>
                    </button>
                  </>
                )}
              </div>

              {/* {showMyTechniques && (
            <button className="flex justify-center align-center bg-green-100 hover:bg-green-200 text-green font-bold m-2 ms-auto w-10 py-2 px-2 rounded"
             onClick={() => {
              setSelectedCardData(item);
              setShowCardModal(true);
             }}
            >
            <Edit className="w-4 h-4 inline-block mr-1" /> 
            </button>
            )} */}
           

           
            {/* <div className="flex flex-wrap gap-2 mb-4">
              {item.tags && item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))
            }
            </div> */}
            </div>
        ))}
        </div>
          
        )
        : 
        (<p className="col-span-full text-center text-gray-500">
              No techniques match your criteria.
            </p>)
      
      }


        {/* {cards.data.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No techniques match your criteria.
          </p>
        )} */}

      <CreateCardModal
              show={showCardModal}
              onClose={() => {
                setShowCardModal(false); 
                dispatch(fetchCardsByUser());
              }}
              edit={true}
              cardData={selectedCardData}
            />
      
    
    </div>
    </div>
  );
}