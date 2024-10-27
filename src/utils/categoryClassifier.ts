import Groq from 'groq-sdk';

class CategoryClassifier {
  private static instance: CategoryClassifier;

  private constructor() {}

  public static getInstance(): CategoryClassifier {
    if (!CategoryClassifier.instance) {
      CategoryClassifier.instance = new CategoryClassifier();
    }
    return CategoryClassifier.instance;
  }

  private async classifyWithGroq(text: string, apiKey: string): Promise<string> {
    if (!apiKey) return this.fallbackClassification(text);

    const groq = new Groq({
      apiKey
    });

    try {
      const prompt = `Analyze this task and categorize it into the most appropriate category. Create a new category if none of the existing ones fit well. Current categories include: work, personal, health, shopping, education, family, social, finance, hobby.
      
      Task: "${text}"
      
      Respond with ONLY the category name in lowercase, no other text.`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.2-3b-preview',
        temperature: 0.3,
        max_tokens: 10,
      });

      const category = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'personal';
      return category;
    } catch (error) {
      console.error('Error classifying with Groq:', error);
      return this.fallbackClassification(text);
    }
  }

  private fallbackClassification(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meeting') || lowerText.includes('presentation') || 
        lowerText.includes('email') || lowerText.includes('work')) {
      return 'work';
    }
    if (lowerText.includes('exercise') || lowerText.includes('gym') || 
        lowerText.includes('health')) {
      return 'health';
    }
    if (lowerText.includes('buy') || lowerText.includes('shop') || 
        lowerText.includes('purchase')) {
      return 'shopping';
    }
    return 'personal';
  }

  public async categorizeTask(text: string, apiKey: string): Promise<string> {
    return this.classifyWithGroq(text, apiKey);
  }
}

export default CategoryClassifier;