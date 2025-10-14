import { useState, useMemo } from 'react';
import { Target, Search } from 'lucide-react';
import { Card } from 'react-bootstrap';

const staticData = [
  {
    id: 'tech1',
    name: 'Armbar from Guard',
    type: 'submission',
    difficulty_level: 'beginner',
    description: 'A fundamental submission from the guard position, targeting the elbow joint.',
    created_date: '2025-08-27T10:30:00Z',
  },
  {
    id: 'tech2',
    name: 'Scissor Sweep',
    type: 'sweep',
    difficulty_level: 'intermediate',
    description: 'A sweep from the guard that uses a scissoring motion of the legs to off-balance the opponent.',
    created_date: '2025-08-26T14:15:00Z',
  },
  {
    id: 'tech3',
    name: 'Triangle Choke',
    type: 'submission',
    difficulty_level: 'intermediate',
    description: 'A chokehold that involves using the legs to form a triangle around the opponent\'s head and one arm.',
    created_date: '2025-08-25T11:00:00Z',
  },
  {
    id: 'tech4',
    name: 'Guard Pass to Side Control',
    type: 'position',
    difficulty_level: 'beginner',
    description: 'A basic pass to get from the opponent\'s guard to a dominant side control position.',
    created_date: '2025-08-24T09:00:00Z',
  },
];

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

  const filteredTechniques = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return staticData.filter((item) => {
      return (
        item.name.toLowerCase().includes(lower) ||
        (item.description && item.description.toLowerCase().includes(lower)) ||
        item.type.toLowerCase().includes(lower)
      );
    });
  }, [searchTerm]);

  return (
    <div className="flex flex-col bg-gray-50 p-4" style={{ width: "306px" }}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search techniques..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      {filteredTechniques.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No techniques found.</p>
      ) : (
        <div className="space-y-3 overflow-y-auto">
          {filteredTechniques.map((technique) => (
            <Card
            draggable
              key={technique.id}
              className="bg-white rounded-xl shadow p-3"
            >
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
                <h3 className="text-sm font-medium text-slate-800 truncate">{technique.name}</h3>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${typeColors[technique.type]}`}
                >
                  {technique.type}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[technique.difficulty_level]}`}
                >
                  {technique.difficulty_level}
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