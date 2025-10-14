import { useState, useMemo } from 'react';
import SidebarNavigation from '../components/dashboard/SidebarNavigation';

const staticData = [
  {
    id: 1,
    title: 'Kimura',
    type: 'submission',
    level: 'beginner',
    description:
      'This is a fundamental technique that can be used from a multitude of positions. It is a strong lock that...',
    tags: ['fundamental', 'closed guard'],
    date: '2025-07-10',
  },
  {
    id: 2,
    title: 'Heel Hook',
    type: 'submission',
    level: 'advanced',
    description:
      'Attack the opponent’s heel by isolating the leg and twisting for a powerful lock.',
    tags: ['leg lock', 'heel hook'],
    date: '2025-07-10',
  },
  {
    id: 3,
    title: 'Rear Naked Choke',
    type: 'submission',
    level: 'beginner',
    description:
      'Classic submission from back control. Secure the hooks, get your arm under the chin, and squeeze with the...',
    tags: ['back control', 'choke', 'fundamental'],
    date: '2025-07-10',
  },
  {
    id: 4,
    title: 'Guard Pull',
    type: 'position',
    level: 'beginner',
    description:
      'Technique to take the fight to the ground from standing and establish closed guard.',
    tags: ['closed guard', 'fundamental'],
    date: '2025-07-10',
  },
  {
    id: 5,
    title: 'Scissor Sweep',
    type: 'sweep',
    level: 'beginner',
    description:
      'Fundamental sweep from closed guard using hip movement and leg positioning to off-balance opponent.',
    tags: ['closed guard', 'fundamental'],
    date: '2025-07-10',
  },
  {
    id: 6,
    title: 'Hip Escape',
    type: 'escape',
    level: 'beginner',
    description:
      'Essential movement to create space and escape from bottom positions like side control or mount.',
    tags: ['escape', 'movement'],
    date: '2025-07-10',
  },
  {
    id: 7,
    title: 'Triangle Choke',
    type: 'submission',
    level: 'intermediate',
    description:
      'Use the legs to isolate one arm and apply pressure on the neck for a choke.',
    tags: ['choke', 'leg'],
    date: '2025-07-10',
  },
  {
    id: 8,
    title: 'Armbar from Guard',
    type: 'submission',
    level: 'intermediate',
    description:
      'Classic armbar from closed guard isolating the arm and extending the hips.',
    tags: ['armbar', 'guard'],
    date: '2025-07-10',
  },
];

export default function TechniquesNew() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Derive unique filter options
  const types = useMemo(
    () => ['All', ...new Set(staticData.map((i) => i.type))],
    []
  );
  const levels = useMemo(
    () => ['All', ...new Set(staticData.map((i) => i.level))],
    []
  );

  // Filtered list
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return staticData.filter((item) => {
      // text search
      const matchesText =
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.tags.some((t) => t.toLowerCase().includes(term));

      // type filter
      const matchesType = selectedType === 'All' || item.type === selectedType;

      // level filter
      const matchesLevel =
        selectedLevel === 'All' || item.level === selectedLevel;

      return matchesText && matchesType && matchesLevel;
    });
  }, [searchTerm, selectedType, selectedLevel]);

  return (
    <div className="flex">

    <SidebarNavigation selectedItem="techniques"/>
    <div className="min-h-screen bg-gray-50 p-6 " style={{marginLeft: "306px", width: "calc(100% - 306px)"}}>
      <h1 className="text-3xl font-semibold text-center mb-6">
        BJJ Techniques Library
      </h1>

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

        <select
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
        </select>
      </div>

      {/* Count */}
      <p className="max-w-4xl mx-auto text-gray-600 mb-4">
        {filtered.length} techniques found
      </p>

      {/* Cards Grid */}
      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-medium">{item.title}</h2>
              <span className="text-xs uppercase bg-gray-200 text-gray-800 px-2 py-1 rounded">
                {item.type}
              </span>
            </div>

            {/* Level Badge */}
            <span
              className={`self-start text-sm font-semibold mb-2 px-2 py-1 rounded ${
                item.level === 'advanced'
                  ? 'bg-red-200 text-red-800'
                  : item.level === 'intermediate'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {item.level}
            </span>

            {/* Description */}
            <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>

            {/* Tags */}
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

            {/* Footer */}
            <div className="text-xs text-gray-400">
              Published: {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No techniques match your criteria.
          </p>
        )}
      </div>
    </div>
    </div>
  );
}
