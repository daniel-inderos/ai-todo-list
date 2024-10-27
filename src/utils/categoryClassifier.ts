import Groq from 'groq-sdk';

interface TaskSuggestion {
  priority: 'high' | 'medium' | 'low';
  suggestedDate: string;
  suggestedTime: string;
}

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
    if (!apiKey) return this.fallbackClassification(text, occupationType);

    try {
      const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const workOrSchool = occupationType === 'work' ? 'work' : 'school';
      const customCategories = JSON.parse(localStorage.getItem('customCategories') || '[]');
      const allCategories = ['health', 'shopping', workOrSchool, 'personal', ...customCategories];
      
      const prompt = `Analyze this task and categorize it. The task can be about:

      Default categories:
      - health (exercise, fitness, wellness activities)
      - shopping (buying items, groceries)
      - ${workOrSchool} (${workOrSchool}-related activities)
      - personal (general tasks)

      Custom categories:
      ${customCategories.map(cat => `- ${cat.toLowerCase()}`).join('\n')}

      Task: "${text}"
      
      Consider custom categories first, then default categories.
      Respond with ONLY the exact category name in lowercase.`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        max_tokens: 10,
      });

      const suggestedCategory = completion.choices[0]?.message?.content?.trim().toLowerCase();
      
      // First check if it matches a custom category (case-insensitive)
      const matchingCustomCategory = customCategories.find(
        cat => cat.toLowerCase() === suggestedCategory
      );
      if (matchingCustomCategory) {
        return matchingCustomCategory; // Return with original casing
      }
      
      // Then check if it's a default category
      if (allCategories.includes(suggestedCategory)) {
        return suggestedCategory;
      }
      
      return this.fallbackClassification(text, occupationType);
    } catch (error) {
      console.error('Classification error:', error);
      return this.fallbackClassification(text, occupationType);
    }
  }

  private fallbackClassification(text: string, occupationType: 'work' | 'school'): string {
    const lowerText = text.toLowerCase();
    const customCategories = JSON.parse(localStorage.getItem('customCategories') || '[]');
    
    // First check custom categories (case-insensitive)
    for (const category of customCategories) {
      if (lowerText.includes(category.toLowerCase())) {
        return category; // Return with original casing
      }
    }
    
    // Then check default categories
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
        lowerText.includes('walk') ||
        lowerText.includes('jog') ||
        lowerText.includes('swim') ||
        lowerText.includes('fitness') ||
        lowerText.includes('training') ||
        /\b(walk|run|jog)\b/.test(lowerText)) {  // Match whole words only
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

  public async cleanTaskText(text: string, apiKey: string): Promise<string> {
    if (!apiKey) return text;

    try {
      const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Remove time-related phrases and scheduling information from this task, keeping only the core task description:
      
      Original task: "${text}"
      
      For example:
      "do math homework tomorrow at 3pm" → "do math homework"
      "buy groceries tonight" → "buy groceries"
      "finish report by next week" → "finish report"
      
      Respond with ONLY the cleaned text, no other text or explanation.`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 50,
      });

      const cleanedText = completion.choices[0]?.message?.content?.trim() || text;
      return cleanedText;
    } catch (error) {
      console.error('Error cleaning task text:', error);
      return text;
    }
  }

  public async suggestTaskSchedule(
    text: string, 
    apiKey: string,
    currentDateTime: string,
    existingTasks: { text: string; dueDate: string; dueTime: string }[]
  ): Promise<TaskSuggestion> {
    if (!apiKey) return this.fallbackScheduleSuggestion(text, currentDateTime);

    try {
      const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Analyze this task and determine its priority level and timing.
      Current time: ${currentDateTime}

      Consider for priority:
      - High: urgent tasks, deadlines, important meetings, time-sensitive items
      - Medium: regular tasks, homework, routine activities
      - Low: flexible tasks, optional activities, "whenever" tasks

      Task: "${text}"

      Respond in JSON format:
      {
        "priority": "high|medium|low",
        "suggestedDate": "YYYY-MM-DD",
        "suggestedTime": "HH:00"
      }`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        max_tokens: 100,
      });

      const suggestion = JSON.parse(completion.choices[0]?.message?.content || '{}');
      
      return {
        priority: suggestion.priority || 'medium',
        suggestedDate: suggestion.suggestedDate || this.getTodayDate(),
        suggestedTime: suggestion.suggestedTime || '12:00'
      };
    } catch (error) {
      console.error('Schedule suggestion error:', error);
      return this.fallbackScheduleSuggestion(text, currentDateTime);
    }
  }

  private fallbackScheduleSuggestion(text: string, currentDateTime: string): TaskSuggestion {
    const lowerText = text.toLowerCase();
    const currentDate = new Date(currentDateTime);
    
    // Handle relative time mentions
    const inHoursMatch = lowerText.match(/in (\d+) hours?/);
    if (inHoursMatch) {
      const hoursToAdd = parseInt(inHoursMatch[1], 10);
      const suggestedTime = new Date(currentDate.getTime() + hoursToAdd * 60 * 60 * 1000);
      // Round to nearest hour
      suggestedTime.setMinutes(0);
      return {
        priority: this.determinePriority(text),
        suggestedDate: suggestedTime.toISOString().split('T')[0],
        suggestedTime: `${String(suggestedTime.getHours()).padStart(2, '0')}:00`
      };
    }

    // Default to next hour for urgent tasks, or noon
    const isUrgent = this.isUrgentTask(text);
    if (isUrgent) {
      const nextHour = new Date(currentDate.getTime() + 60 * 60 * 1000);
      nextHour.setMinutes(0);
      return {
        priority: 'high',
        suggestedDate: this.getTodayDate(),
        suggestedTime: `${String(nextHour.getHours()).padStart(2, '0')}:00`
      };
    }

    return {
      priority: this.determinePriority(text),
      suggestedDate: this.getTodayDate(),
      suggestedTime: '12:00'
    };
  }

  private determinePriority(text: string): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase();
    
    // High priority indicators
    if (
      lowerText.includes('urgent') ||
      lowerText.includes('asap') ||
      lowerText.includes('emergency') ||
      lowerText.includes('important') ||
      lowerText.includes('critical')
    ) {
      return 'high';
    }

    // Low priority indicators
    if (
      lowerText.includes('whenever') ||
      lowerText.includes('someday') ||
      lowerText.includes('if possible') ||
      lowerText.includes('maybe')
    ) {
      return 'low';
    }

    return 'medium';
  }

  private isUrgentTask(text: string): boolean {
    const lowerText = text.toLowerCase();
    return (
      lowerText.includes('urgent') ||
      lowerText.includes('asap') ||
      lowerText.includes('emergency') ||
      lowerText.includes('now') ||
      lowerText.includes('immediately')
    );
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  private getNextHour(): string {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return `${String(now.getHours()).padStart(2, '0')}:00`;
  }
}

export default CategoryClassifier;
