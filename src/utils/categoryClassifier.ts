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

  private async classifyWithGroq(text: string, apiKey: string, occupationType: 'work' | 'school'): Promise<string> {
    if (!apiKey) {
      console.log('No API key provided, using fallback classification');
      return this.fallbackClassification(text, occupationType);
    }

    try {
      console.log('Initializing Groq with API key length:', apiKey.length);
      const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const workOrSchool = occupationType === 'work' ? 'work' : 'school';
      console.log('Creating prompt for classification');
      const prompt = `Analyze this task and categorize it into one of these exact categories only: ${workOrSchool}, personal, health, shopping. 
      Consider tasks related to homework, studying, classes, assignments, or education as "${workOrSchool}".
      Respond with ONLY the category name in lowercase, no other text.
      
      Task: "${text}"`;

      console.log('Sending request to Groq API...');
      const completion = await groq.chat.completions.create({
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        model: 'llama-3.1-8b-instant',  // Changed to faster model
        temperature: 0.3,
        max_tokens: 10,
      }).catch(error => {
        console.error('Error during Groq API call:', error.message);
        throw error;
      });

      console.log('Raw API response:', completion);
      
      if (!completion?.choices?.[0]?.message?.content) {
        console.error('Unexpected API response structure:', completion);
        throw new Error('Invalid API response structure');
      }

      const category = completion.choices[0].message.content.trim().toLowerCase();
      console.log('Processed category:', category);
      
      const validCategories = [workOrSchool, 'personal', 'health', 'shopping'];
      if (!validCategories.includes(category)) {
        console.log(`Category "${category}" not in valid categories, defaulting to ${workOrSchool}`);
        return workOrSchool;
      }

      return category;
    } catch (error) {
      console.error('Detailed classification error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: apiKey ? 'Present' : 'Missing',
        text
      });
      return this.fallbackClassification(text, occupationType);
    }
  }

  private fallbackClassification(text: string, occupationType: 'work' | 'school'): string {
    const lowerText = text.toLowerCase();
    
    // School-related keywords
    if (occupationType === 'school' && (
      lowerText.includes('homework') || 
      lowerText.includes('study') || 
      lowerText.includes('assignment') || 
      lowerText.includes('class') || 
      lowerText.includes('exam') || 
      lowerText.includes('test') ||
      lowerText.includes('math') ||
      lowerText.includes('science') ||
      lowerText.includes('essay')
    )) {
      return 'school';
    }
    
    // Work-related keywords
    if (occupationType === 'work' && (
      lowerText.includes('meeting') || 
      lowerText.includes('presentation') || 
      lowerText.includes('email') || 
      lowerText.includes('work') ||
      lowerText.includes('client') ||
      lowerText.includes('project')
    )) {
      return 'work';
    }

    if (lowerText.includes('exercise') || 
        lowerText.includes('gym') || 
        lowerText.includes('health') ||
        lowerText.includes('workout') ||
        lowerText.includes('run') ||
        lowerText.includes('walk')) {
      return 'health';
    }

    if (lowerText.includes('buy') || 
        lowerText.includes('shop') || 
        lowerText.includes('purchase') ||
        lowerText.includes('store') ||
        lowerText.includes('groceries')) {
      return 'shopping';
    }

    return 'personal';
  }

  public async categorizeTask(text: string, apiKey: string, occupationType: 'work' | 'school'): Promise<string> {
    console.log('Starting task categorization');
    console.log('Input text:', text);
    console.log('API key status:', apiKey ? 'Present' : 'Missing');
    console.log('Occupation type:', occupationType);
    
    try {
      const result = await this.classifyWithGroq(text, apiKey, occupationType);
      console.log('Categorization completed:', result);
      return result;
    } catch (error) {
      console.error('Top-level categorization error:', error);
      return this.fallbackClassification(text, occupationType);
    }
  }
}

export default CategoryClassifier;
