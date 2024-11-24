export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">401</h1>
        <p className="mt-4 text-lg">
          You are not authorized to access this page
        </p>
      </div>
    </div>
  );
}
