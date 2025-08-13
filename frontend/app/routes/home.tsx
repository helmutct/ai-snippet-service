import type { Route } from "./+types/home";
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Snippet Service" },
    { name: "description", content: "Create text snippets and get AI-powered summaries" },
  ];
}

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Snippet Service
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create text snippets and get AI-powered summaries
        </p>
        <Link
          to="/snippets"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
