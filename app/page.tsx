export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Kinos9</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Swarm Management</h2>
        <p className="mb-4">
          Select a swarm from the sidebar to view and manage its details.
        </p>
        <p className="text-gray-600">
          This dashboard allows you to monitor and control your swarms efficiently.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Browse your swarms in the sidebar</li>
            <li>Click on a swarm to view its details</li>
            <li>Manage swarm settings and configurations</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          <p className="text-gray-600">
            No recent activity to display.
          </p>
        </div>
      </div>
    </div>
  );
}
