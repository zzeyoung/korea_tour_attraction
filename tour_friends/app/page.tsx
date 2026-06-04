import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">관광지 친구들 (테스트)</h1>
      <ul className="space-y-2">
        <li>
          <Link
            href="/chat/126508"
            className="block px-4 py-3 bg-blue-50 rounded hover:bg-blue-100"
          >
            🏯 경복궁과 대화하기
          </Link>
        </li>
        <li>
          <Link
            href="/chat/264341"
            className="block px-4 py-3 bg-blue-50 rounded hover:bg-blue-100"
          >
            🏠 운현궁과 대화하기
          </Link>
        </li>
      </ul>
    </div>
  );
}