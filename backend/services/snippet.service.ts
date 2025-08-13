import { ValidationResult, CreateSnippetData, GetAllSnippetsOptions, AIClient, ISnippet } from '../types';

class SnippetService {
  private aiClient: AIClient | null = null;

  private async getAIClient(): Promise<AIClient> {
    if (!this.aiClient) {
      try {
        const { HuggingFaceService } = await import('../config/huggingface');
        this.aiClient = new HuggingFaceService();
      } catch (error) {
        console.warn('AI service not available, using fallback');
        this.aiClient = { 
          generateSummary: async (text: string) => `Summary: ${text.slice(0, 100)}...` 
        };
      }
    }
    return this.aiClient;
  }

  async createSnippet(data: CreateSnippetData): Promise<ISnippet> {
    const { text } = data;
    const aiClient = await this.getAIClient();
    
    let summary: string;
    try {
      summary = await aiClient.generateSummary(text);
    } catch (error) {
      console.warn('AI summary failed, using fallback:', (error as Error).message);
      summary = `Summary: ${text.slice(0, 100)}...`;
    }

    const { Snippet } = await import('../models/snippet.model');
    const snippet = new Snippet({
      text: text,
      summary: summary.trim()
    });

    return await snippet.save();
  }

  async getSnippetById(id: string): Promise<ISnippet> {
    const { Snippet } = await import('../models/snippet.model');
    const snippet = await Snippet.findById(id);
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    return snippet;
  }

  async getAllSnippets(options: GetAllSnippetsOptions = {}): Promise<ISnippet[]> {
    const { limit = 20, offset = 0 } = options;
    const { Snippet } = await import('../models/snippet.model');
    
    return await Snippet.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit.toString()))
      .skip(parseInt(offset.toString()));
  }

  async deleteSnippet(id: string): Promise<ISnippet> {
    const { Snippet } = await import('../models/snippet.model');
    const snippet = await Snippet.findByIdAndDelete(id);
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    return snippet;
  }
}

export default new SnippetService();