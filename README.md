# Smart Tasks 🚀

A modern, AI-powered task management application built with React, TypeScript, and Tailwind CSS. Smart Tasks automatically categorizes your todos using the Groq AI API and provides a beautiful, personalized experience.

![Smart Tasks Screenshot](screenshot.png)

## ✨ Features

- **AI-Powered Task Management**:
  - Automatic task categorization using Groq's LLaMA model
  - Smart task text cleaning to remove scheduling information
  - Intelligent priority assignment (High/Medium/Low)
  - Automatic schedule suggestions based on task context
  - Task analysis considering existing schedules

- **Smart Categories**: 
  - All Tasks
  - Work/School (adapts to your occupation)
  - Personal
  - Health
  - Shopping
  - Custom categories with preset suggestions
  - Category-specific icons and colors

- **Task Organization**:
  - Priority levels with visual indicators
  - Due dates and times
  - Overdue task highlighting
  - Relative date display (Today/Tomorrow/Yesterday)

- **User Experience**:
  - Personalized onboarding flow
  - Work/Student mode adaptation
  - Beautiful dark mode with smooth transitions
  - Responsive design for all devices
  - Local storage persistence
  - Clean, modern UI with glass-morphism effects

- **Security**:
  - Secure API key storage
  - Protected sensitive information display

## 🛠️ Technologies

- React 18
- TypeScript
- Tailwind CSS
- Groq AI API (LLaMA 3.1)
- Lucide Icons
- Local Storage API
- Vite

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/daniel-inderos/ai-todo-list.git
cd ai-todo-list
```
2. Install dependencies:

```bash
npm install
```
3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Setup

You'll need to provide your Groq API key during the onboarding process. The key will be securely stored in your browser's local storage.

1. Get your API key from [console.groq.com](https://console.groq.com/keys)
2. Enter it during the onboarding process or later in Settings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack Details

- **Frontend Framework**: React with TypeScript
- **Styling**: 
  - Tailwind CSS with custom configurations
  - Dark mode support
  - Glass-morphism effects
  - Responsive design
- **AI Integration**: 
  - Groq API with LLaMA 3.1 model
  - Smart task categorization
  - Priority detection (High/Medium/Low)
  - Schedule suggestions
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: Browser Local Storage
