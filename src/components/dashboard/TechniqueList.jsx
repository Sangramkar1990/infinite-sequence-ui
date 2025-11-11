import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Target, Search } from 'lucide-react';
import { Card } from 'react-bootstrap';
import { fetchCardsByUser, searchCards, fetchAllCards } from '../../store/sequenceSlice';
import CreateCardModal from './CreateCardModal';

const typeColors = {
  position: "bg-blue-100 text-blue-800",
  submission: "bg-red-100 text-red-800",
  escape: "bg-green-100 text-green-800",
  sweep: "bg-amber-100 text-amber-800",
  guard: "bg-purple-100 text-purple-800"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700"
};

export default function TechniqueList() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { cards, loading } = useSelector((state) => state.sequence);

  useEffect(() => {
    dispatch(fetchAllCards());
  }, [dispatch]);

  useEffect(() => {
    console.log('cards ----- >',cards)  }, [cards]);
   

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  //   if (e.target.value === '') {
  //     dispatch(fetchCardsByUser());
  //   } else {
  //     dispatch(searchCards(e.target.value));
  //   }
  // };

  const onDragStart = (event, card) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(card));
    console.log('Dragging card:', card);
    event.dataTransfer.effectAllowed = 'move';
  };

  const filteredTechniques = useMemo(() => {
    if (!cards || !Array.isArray(cards.data)) return [];
    // The API search might be broad, so we can still filter on the client side for a better experience.
    const lower = searchTerm.toLowerCase();
    if (!lower) return cards.data;
    return cards.data.filter((item) => {
      return (
        item.name.toLowerCase().includes(lower) ||
        (item.description && item.description.toLowerCase().includes(lower)) ||
        item.type.toLowerCase().includes(lower)
      );
    });
  }, [cards, searchTerm]);
  useEffect(()=>{
    console.log('cards in list ----- >',{ cards , filteredTechniques, loading})
  },[cards, filteredTechniques])

  return (
    <div className="flex flex-col bg-gray-50 p-4" style={{ width: "306px" }}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search techniques..."
          value={searchTerm}
          // onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      {loading === 'loading' || loading === 'idle' ? (
        <p className="text-center text-gray-500 text-sm">Loading...</p>
      ) :
      cards.length === 0 
      
       ? 
       (
        <p className="text-center text-gray-500 text-sm">No techniques found.</p>
      ) : (
        <div className="space-y-3 overflow-y-auto">
          {cards.map((technique) => (
            <Card
              draggable
              onDragStart={(event) => onDragStart(event, technique)}
              key={technique.id}
              className="bg-white rounded-xl shadow p-3"
              style={{ cursor: 'grab' }}
            >
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
                <h3 className="text-sm font-medium text-slate-800 truncate">{technique.name}</h3>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {technique.type && <span
                  className={`text-xs px-2 py-0.5 rounded-full ${typeColors[technique.type]}`}
                >
                  {technique.type}
                </span>}
                {technique.difficulty_level && <span
                  className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[technique.difficulty_level]}`}
                >
                  {technique.difficulty_level}
                </span>}
              </div>

              <div className="flex flex-wrap justify-between">
            {technique.difficulty &&(<span
              className={`self-start text-sm font-semibold mb-2 px-2 py-1 rounded ${
                technique.difficulty === 'Advanced'
                  ? 'bg-red-200 text-red-800'
                  : technique.difficulty === 'Intermediate'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {technique.difficulty}
            </span>)}

            <span className="text-xs border border-yellow-500 uppercase bg-yellow-200 text-yellow-800 px-2 py-1 rounded-xl  w-fit mb-2">
                {technique.effect}
              </span>

             <span className="text-xs border border-blue-500 uppercase bg-red-200 text-red-800 px-2 py-1 rounded-xl  w-fit mb-2">
                {technique.type}
              </span>

              </div>

              {technique.description && (
                <p className="text-xs text-gray-600 line-clamp-2">
                  {technique.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}