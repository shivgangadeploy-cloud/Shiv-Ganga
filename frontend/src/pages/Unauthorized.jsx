export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">403</h1>
        <p className="mt-4 text-xl font-semibold">Access Denied</p>
        <p className="text-gray-600 mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
