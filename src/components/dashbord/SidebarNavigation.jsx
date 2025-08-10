export default function SidebarNavigation() {
  return (
    <nav className="sidebar">
      <h2>BJJ Flow</h2>
      <ul>
        <li>Dashboard</li>
        <li>Techniques</li>
        <li>Sequences</li>
        <li>Flow Builder</li>
      </ul>
      <div className="quick-links">
        <button>Add Technique</button>
        <button>New Sequence</button>
      </div>
    </nav>
  );
}
