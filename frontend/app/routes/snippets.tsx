import { redirect } from 'react-router';
import { Link, useLoaderData, useActionData } from 'react-router';
import { snippetService } from '~/services/snippet.service';
import type { Snippet } from '~/types/snippet';
import type { Route } from './+types/snippets';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit')) || 20;
  const offset = Number(url.searchParams.get('offset')) || 0;
  
  try {
    const snippets = await snippetService.getAllSnippets(limit, offset);
    return { snippets, limit, offset };
  } catch (error) {
    throw new Response('Failed to load snippets', { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const text = formData.get('text') as string;

  if (!text || text.trim().length < 10) {
    return new Response(JSON.stringify({ error: 'Text must be at least 10 characters long' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    await snippetService.createSnippet({ text: text.trim() });
    return redirect('/snippets');
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create snippet' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default function Snippets() {
  const { snippets } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as { error?: string } | undefined;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">AI Snippets</h1>
        
        <form method="post" className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="mb-4">
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Enter your text (minimum 10 characters):
            </label>
            <textarea
              id="text"
              name="text"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text to be summarized by AI..."
              required
            />
          </div>
          
          {actionData?.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {actionData.error}
            </div>
          )}
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Snippet
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {snippets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No snippets found. Create your first snippet above!</p>
        ) : (
          snippets.map((snippet: Snippet) => (
            <div key={snippet.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Summary
                </h3>
                <div className="flex gap-2">
                  <Link
                    to={`/snippets/${snippet.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to={`/snippets/${snippet.id}/delete`}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </Link>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 font-medium">
                {snippet.summary}
              </p>
              
              <p className="text-gray-600 text-sm line-clamp-3">
                {snippet.text}
              </p>
              
              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}