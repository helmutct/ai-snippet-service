import { Link, useLoaderData } from 'react-router';
import { snippetService } from '~/services/snippet.service';
import type { Snippet } from '~/types/snippet';
import type { Route } from './+types/snippets.$id';

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const snippet = await snippetService.getSnippetById(params.id);
    return { snippet };
  } catch (error) {
    throw new Response('Snippet not found', { status: 404 });
  }
}

export default function SnippetDetail() {
  const data = useLoaderData<typeof loader>();
  const { snippet } = data as { snippet: Snippet };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/snippets"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Back to Snippets
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Snippet Details
          </h1>
          <div className="text-sm text-gray-500">
            Created: {new Date(snippet.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              AI-Generated Summary
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">
                {snippet.summary}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Original Text
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {snippet.text}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/snippets"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to List
          </Link>
          <Link
            to={`/snippets/${snippet.id}/delete`}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Snippet
          </Link>
        </div>
      </div>
    </div>
  );
}