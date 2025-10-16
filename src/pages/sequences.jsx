import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarNavigation from '../components/dashboard/SidebarNavigation';
import { fetchAllSequences } from '../store/sequenceSlice';
import { Orbit, Target, BookOpen, Workflow} from 'lucide-react';

export default function Sequences() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
    const { sequences, loading } = useSelector((state) => state.sequence);
  // const { cards, loading } = useSelector((state) => state.sequence);

  useEffect(() => {
   
      console.log('sequences ----- >',sequences.data)
  
},[sequences])

  // useEffect(()=>{
  //   console.log("cards --------- >", cards)
  // }, [cards])

  useEffect(() => {
    dispatch(fetchAllSequences());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchCardsByUser());
  // }, [dispatch]);

  // Memoize filtered data
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
const types = useMemo(() => { 
   const list = sequences.data ?? [];
    const uniqueTypes = [...new Set(list.map(item => item.type))];
    return ['All', ...uniqueTypes]; 
  },[sequences.data]
  );
  const filtered = useMemo(() => {
  const term = searchTerm.toLowerCase();
  // fall back to empty array if data is undefined
  const list = sequences.data ?? [];

  return list.filter((item) => {
    // defend against missing strings
    const name = item.name?.toLowerCase() ?? '';
    const desc = item.description?.toLowerCase() ?? '';

    const matchesText =
      name.includes(term) ||
      desc.includes(term);

    // optional: filter by type and level if you need
    const matchesType =
      selectedType === 'All' ||
      item.type === selectedType;
    const matchesLevel =
      selectedLevel === 'All' ||
      item.level === selectedLevel;

    return matchesText && matchesType && matchesLevel;
  });
}, [searchTerm, selectedType, selectedLevel, sequences.data]);

  return (
    <div className="flex">
      <SidebarNavigation selectedItem="sequences"/>
    
    <div className="min-h-screen bg-gray-100 p-6" style={{marginLeft: "306px", width: "calc(100% - 306px)"}}>
      <h1 className="text-3xl font-semibold mb-4 text-center">
        BJJ Technique Sequences
      </h1>

      {/* <div className="max-w-md mx-auto mb-6"> */}
      <div className='max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8'>

        <input
          type="text"
          placeholder="Search by title, description or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select> */}
      </div>

      {loading === 'loading' && <p className="text-center text-gray-500">Loading...</p>}
      {loading === 'failed' && <p className="text-center text-red-500">Error loading sequences.</p>}
      {loading === 'succeeded' && filtered.length === 0 ? (
        <p className="text-center text-gray-500">No sequences found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex">
                  <div
              className="p-2 bg-amber-100 rounded-lg mr-2"
              
            >
              <BookOpen className="w-6 h-6" style={{ color: "orange" }} />
            </div>
                <h2 className="text-xl font-medium">{item.name}</h2>

                </div>
                 <a href={`/flow-builder/?sequenceSelected=${item.id}`} target="_self" rel="noopener noreferrer"><Workflow className="w-4 h-4 inline-block mr-1" /></a>
                
                {/* <span
                  className={`px-2 py-1 text-sm rounded ${
                    item.difficulty === 'Advanced'
                      ? 'bg-red-200 text-red-800'
                      : item.difficulty === 'Intermediate'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {item.difficulty}
                </span> */}
              </div>

              {item.description && (
                <p className="text-gray-600 mb-3 flex-grow">
                  {item.description}
                </p>
              )}

              <div className="text-sm text-gray-700 mb-3">
                Techniques: {item.cards ? item.cards.length : 0}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.cards.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    <Target className="w-4 h-4 inline-block mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-400">
                Published: {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}