import { redirect } from 'react-router';
import { Link, useLoaderData, Form } from 'react-router';
import { snippetService } from '~/services/snippet.service';
import type { Snippet } from '~/types/snippet';
import type { Route } from './+types/snippets.$id.delete';

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const snippet = await snippetService.getSnippetById(params.id);
    return { snippet };
  } catch (error) {
    throw new Response('Snippet not found', { status: 404 });
  }
}

export async function action({ params }: Route.ActionArgs) {
  try {
    await snippetService.deleteSnippet(params.id);
    return redirect('/snippets');
  } catch (error) {
    throw new Response('Failed to delete snippet', { status: 500 });
  }
}

export default function DeleteSnippet() {
  const data = useLoaderData<typeof loader>();
  const { snippet } = data as { snippet: Snippet };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          to={`/snippets/${snippet.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Back to Snippet
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Delete Snippet
        </h1>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this snippet? This action cannot be undone.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Summary:</h3>
            <p className="text-gray-700 text-sm mb-3">{snippet.summary}</p>
            
            <h3 className="font-semibold text-gray-900 mb-2">Text Preview:</h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {snippet.text}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Form method="post">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes, Delete Snippet
            </button>
          </Form>
          
          <Link
            to={`/snippets/${snippet.id}`}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}