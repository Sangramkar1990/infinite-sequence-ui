const activities = [
  { name: 'Kimura', type: 'submission', level: 'beginner', date: 'Jul 10' },
  { name: 'Berimbolo to Heel Hook', type: 'sequence', level: 'beginner', date: 'Jul 10' },
  // ...more
];

export default function RecentActivityList() {
  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <ul>
        {activities.map((a, i) => (
          <li key={i}>
            {a.name} ({a.type}, {a.level}, {a.date})
          </li>
        ))}
      </ul>
    </div>
  );
}
