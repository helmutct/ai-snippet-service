import { InferenceClient } from '@huggingface/inference';

export function getHuggingFaceClient(): InferenceClient {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is required');
  }
  return new InferenceClient(apiKey);
}

export class HuggingFaceService {
  private client = getHuggingFaceClient();
  
  async generateSummary(text: string): Promise<string> {
    try {
      const model = process.env.HUGGINGFACE_MODEL!;
      const maxLength = 30000;
      const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      
      console.log(`🔄 Generating summary with ${model}...`);
      
      const response = await this.client.chatCompletion({
        model: model,
        messages: [{
          role: "user",
          content: `Summarize this text in exactly 30 words or less:\n\n${truncatedText}`
        }],
        max_tokens: 60,
        temperature: 0.7,
        top_p: 0.8
      });

      const summary = response.choices?.[0]?.message?.content?.trim();
      if (!summary) {
        throw new Error('No summary generated from AI model');
      }
      console.log(`✅ Summary generated successfully`);
      return summary;
    } catch (error) {
      console.error('HuggingFace error:', error);
      return `Summary: ${text.slice(0, 100)}...`;
    }
  }
}