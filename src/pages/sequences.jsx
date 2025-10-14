import { useState, useMemo } from 'react';
import SidebarNavigation from '../components/dashboard/SidebarNavigation';

const staticData = [
  {
    id: 1,
    title: 'Berimbolo to Heel Hook',
    difficulty: 'Beginner',
    techniques: 2,
    description: '',
    tags: ['Techniques'],
    date: '2025-07-10',
  },
  {
    id: 2,
    title: 'Basic Guard to Back Take',
    difficulty: 'Beginner',
    techniques: 3,
    description:
      'Fundamental sequence showing progression from closed guard to taking opponent’s back. Perfect for beginners.',
    tags: ['Guard', 'Back Take', 'Fundamental'],
    date: '2025-07-10',
  },
  {
    id: 3,
    title: 'Mount Escape to Counter',
    difficulty: 'Intermediate',
    techniques: 2,
    description:
      'Defensive sequence showing how to escape mount and counter-attack with a sweep or submission.',
    tags: ['Mount', 'Escape', 'Counter'],
    date: '2025-07-10',
  },
  {
    id: 4,
    title: 'Advanced Berimbolo System',
    difficulty: 'Advanced',
    techniques: 4,
    description:
      'Complex sequence utilizing berimbolo entries and variations for advanced practitioners.',
    tags: ['Berimbolo', 'Advanced', 'System'],
    date: '2025-07-10',
  },
];

export default function Sequences() {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered data
  const filtered = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return staticData.filter((item) => {
      return (
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lower))
      );
    });
  }, [searchTerm]);

  return (
    <div className="flex">
      <SidebarNavigation selectedItem="sequences"/>
    
    <div className="min-h-screen bg-gray-100 p-6" style={{marginLeft: "306px", width: "calc(100% - 306px)"}}>
      <h1 className="text-3xl font-semibold mb-4 text-center">
        BJJ Technique Sequences
      </h1>

      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by title, description or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No sequences found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-medium">{item.title}</h2>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    item.difficulty === 'Advanced'
                      ? 'bg-red-200 text-red-800'
                      : item.difficulty === 'Intermediate'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {item.difficulty}
                </span>
              </div>

              {item.description && (
                <p className="text-gray-600 mb-3 flex-grow">
                  {item.description}
                </p>
              )}

              <div className="text-sm text-gray-700 mb-3">
                Techniques: {item.techniques}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-400">
                Published: {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
