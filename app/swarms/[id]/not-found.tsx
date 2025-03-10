import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Swarm Not Found</h2>
      <p className="mb-4">Could not find the requested swarm.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
