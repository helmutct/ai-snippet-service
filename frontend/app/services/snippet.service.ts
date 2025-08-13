import type { Snippet, CreateSnippetData } from '~/types/snippet';

const API_URL = import.meta.env.VITE_API_URL;

class SnippetService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getAllSnippets(limit = 20, offset = 0): Promise<Snippet[]> {
    return this.request<Snippet[]>(`/snippets?limit=${limit}&offset=${offset}`);
  }

  async getSnippetById(id: string): Promise<Snippet> {
    return this.request<Snippet>(`/snippets/${id}`);
  }

  async createSnippet(data: CreateSnippetData): Promise<Snippet> {
    return this.request<Snippet>('/snippets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSnippet(id: string): Promise<{ message: string; snippet: Snippet }> {
    return this.request<{ message: string; snippet: Snippet }>(`/snippets/${id}`, {
      method: 'DELETE',
    });
  }
}

export const snippetService = new SnippetService();