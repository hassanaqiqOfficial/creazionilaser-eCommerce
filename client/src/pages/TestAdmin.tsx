import { useAuth } from "@/hooks/useAuth";

export default function TestAdmin() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {(user as any)?.firstName}!</p>
      <p>User Type: {(user as any)?.userType}</p>
      <p>Email: {(user as any)?.email}</p>
      <div className="mt-8 bg-blue-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Admin Features</h2>
        <ul className="list-disc ml-6">
          <li>User Management</li>
          <li>Product Management</li>
          <li>Order Processing</li>
          <li>Analytics Dashboard</li>
        </ul>
      </div>
    </div>
  );
}