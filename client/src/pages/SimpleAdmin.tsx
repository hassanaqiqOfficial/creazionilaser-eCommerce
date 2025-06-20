export default function SimpleAdmin() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Admin Panel</h2>
        <p className="text-gray-600 mb-4">You have successfully accessed the admin dashboard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Users</h3>
            <p className="text-2xl font-bold text-blue-600">1</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Products</h3>
            <p className="text-2xl font-bold text-green-600">4</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Orders</h3>
            <p className="text-2xl font-bold text-purple-600">0</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Manage Users
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2">
              Manage Products
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2">
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}