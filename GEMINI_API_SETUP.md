# Gemini API Integration Guide

This guide explains how to set up and use Google's Generative AI API (Gemini) with your On-Chain Message Board app.

## What is Gemini API?

Gemini is Google's advanced AI model that can:
- Analyze message content for safety
- Generate smart suggestions
- Summarize conversations
- Detect sentiment
- Extract topics from messages
- Translate content
- Generate professional responses

## Step 1: Get Your Gemini API Key

### Create a Google Cloud Project

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"**
3. Select **"Create API key in new Google Cloud project"**
4. A new tab opens to Google Cloud Console
5. An API key is generated automatically
6. Copy the API key (you'll need it later)

### Alternative: Use Existing Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Enable the **"Generative Language API"**
4. Go to **"APIs & Services"** → **"Credentials"**
5. Create an **"API Key"** credential
6. Copy the API key

## Step 2: Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# .env.local

# Gemini API Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here

# Optional: Customize Gemini model (default is gemini-pro)
EXPO_PUBLIC_GEMINI_MODEL=gemini-pro

# RPC Configuration for blockchain
EXPO_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### For Expo Development

Expo uses environment variables prefixed with `EXPO_PUBLIC_` for frontend access.

**Important:** Never commit `.env.local` to git!

Add to `.gitignore`:
```
.env.local
.env
```

## Step 3: Initialize Gemini in Your App

Update your `App.tsx`:

```typescript
import React, { useEffect } from 'react';
import { geminiService } from './src/services/geminiService';

export default function App() {
  useEffect(() => {
    // Initialize Gemini with API key
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      geminiService.initializeGemini(apiKey);
      console.log('Gemini AI initialized ✓');
    } else {
      console.warn('Gemini API key not configured');
    }
  }, []);

  // ... rest of your app
}
```

## Step 4: Use Gemini Features

### Example 1: Analyze Message Safety

```typescript
import { geminiService } from './src/services/geminiService';

const checkMessageSafety = async (message: string) => {
  const result = await geminiService.analyzeMessageSafety(message);
  
  if (result.isSafe) {
    console.log('✓ Message is safe to post');
  } else {
    console.log(`⚠️ Warning: ${result.category}`);
    console.log(`Recommendation: ${result.recommendation}`);
  }
};
```

### Example 2: Get Smart Suggestions

```typescript
const getSuggestions = async (currentMessage: string, context: string) => {
  const suggestions = await geminiService.generateSmartSuggestions(
    currentMessage,
    context
  );
  
  console.log('Suggestions:', suggestions);
  // suggestions = [
  //   "Could you clarify what you mean?",
  //   "This sounds great! Let's implement it.",
  //   "Thanks for the update!"
  // ]
};
```

### Example 3: Summarize Messages

```typescript
const summaryMessages = await geminiService.summarizeMessages([
  {
    sender: '0x742d...0bEb',
    content: 'Project deadline is next Friday',
    timestamp: '2h ago'
  },
  {
    sender: '0x1234...5678',
    content: 'I can have it done by Thursday',
    timestamp: '1h ago'
  },
  {
    sender: '0x742d...0bEb',
    content: 'Perfect! Thanks for the quick turnaround',
    timestamp: 'now'
  }
]);

console.log('Summary:', summaryMessages);
// "Team discussed project deadline, agreed to Thursday completion"
```

### Example 4: Analyze Sentiment

```typescript
const sentiment = await geminiService.analyzeSentiment(
  "This is amazing! I love working with this team!"
);

console.log(sentiment);
// {
//   sentiment: 'positive',
//   score: 0.95,
//   explanation: 'Message expresses strong positive emotions and enthusiasm'
// }
```

### Example 5: Extract Topics

```typescript
const topics = await geminiService.extractTopics(
  "We need to schedule a meeting for Q4 planning and budget review"
);

console.log(topics);
// ['Q4 planning', 'Budget review', 'Meeting scheduling']
```

## Step 5: Integrate into Chat Components

### Example: Enhanced Chat Room Screen

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { geminiService } from '../services/geminiService';

export const ChatRoomScreen = () => {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onMessageChange = async (text: string) => {
    setMessage(text);

    // Get suggestions as user types
    if (text.length > 10) {
      const sugg = await geminiService.generateSmartSuggestions(
        text,
        'Professional team communication'
      );
      setSuggestions(sugg);
    }
  };

  const sendMessage = async () => {
    // Check message safety first
    const safety = await geminiService.analyzeMessageSafety(message);
    
    if (!safety.isSafe) {
      alert(`Message flagged: ${safety.recommendation}`);
      return;
    }

    // Extract topics for organization
    const topics = await geminiService.extractTopics(message);
    
    // Send message with metadata
    await postMessageToBlockchain({
      content: message,
      topics,
      timestamp: new Date()
    });

    setMessage('');
    setSuggestions([]);
  };

  return (
    <View>
      <TextInput
        value={message}
        onChangeText={onMessageChange}
        placeholder="Type your message..."
      />
      
      {/* Show suggestions */}
      {suggestions.map((sugg, idx) => (
        <Button
          key={idx}
          title={sugg}
          onPress={() => setMessage(sugg)}
        />
      ))}

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};
```

## Available Gemini Functions

### Message Analysis

```typescript
// Check if message is safe and appropriate
analyzeMessageSafety(message: string): Promise<{
  isSafe: boolean;
  category?: string;
  recommendation: string;
}>

// Analyze emotional tone
analyzeSentiment(message: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  explanation: string;
}>

// Extract topics and keywords
extractTopics(message: string): Promise<string[]>
```

### Message Enhancement

```typescript
// Get better ways to phrase message
generateSmartSuggestions(
  message: string,
  context: string
): Promise<string[]>

// Generate response to a message
generateResponseSuggestion(
  message: string,
  topic: string
): Promise<string>

// Translate to another language
translateMessage(
  message: string,
  language: string
): Promise<string>
```

### Conversation Management

```typescript
// Get summary of conversation
summarizeMessages(
  messages: Array<{sender, content, timestamp}>
): Promise<string>
```

## Cost & Limits

### Gemini API Pricing (as of 2024)

**Free Tier:**
- 60 requests per minute
- Generous free quota
- Pay-as-you-go after free credits

**Pricing:**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

### Rate Limits

```typescript
// Default: 60 requests/minute (free tier)
// Upgrade project for higher limits

// Best practices:
// - Batch requests when possible
// - Cache responses
// - Debounce real-time analysis
```

## Error Handling

```typescript
import { geminiService } from './src/services/geminiService';

const safeAnalyze = async (message: string) => {
  try {
    // Check if initialized
    if (!geminiService.isGeminiReady()) {
      console.log('Gemini not available, using fallback');
      return defaultBehavior();
    }

    const result = await geminiService.analyzeMessageSafety(message);
    return result;
  } catch (error) {
    console.error('Gemini error:', error);
    // Fallback behavior
    return {
      isSafe: true,
      recommendation: 'Analysis unavailable'
    };
  }
};
```

## Troubleshooting

### API Key Not Working

1. Check `.env.local` has correct key
2. Verify key is enabled in Google Cloud Console
3. Restart development server: `npm start`
4. Check key hasn't exceeded quota

### "Gemini API not initialized"

```typescript
// Make sure to initialize in App.tsx
useEffect(() => {
  geminiService.initializeGemini(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
}, []);
```

### Slow Responses

1. Implement debouncing for real-time analysis
2. Cache common requests
3. Use shorter prompts
4. Batch multiple requests

### "Quota exceeded"

1. Check free tier limits
2. Wait for quota reset
3. Upgrade to paid plan
4. Optimize request frequency

## Best Practices

### 1. Debounce Real-Time Analysis

```typescript
import { useCallback } from 'react';

const debounce = (fn: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const onMessageChange = useCallback(
  debounce(async (text: string) => {
    const result = await geminiService.analyzeMessageSafety(text);
  }, 500),
  []
);
```

### 2. Cache Responses

```typescript
const cache = new Map<string, any>();

const analyzeWithCache = async (message: string) => {
  if (cache.has(message)) {
    return cache.get(message);
  }

  const result = await geminiService.analyzeMessageSafety(message);
  cache.set(message, result);
  return result;
};
```

### 3. Graceful Degradation

Always have fallbacks if Gemini is unavailable:

```typescript
const getAnalysis = async (message: string) => {
  if (!geminiService.isGeminiReady()) {
    return { isSafe: true, category: null };
  }

  try {
    return await geminiService.analyzeMessageSafety(message);
  } catch (error) {
    return { isSafe: true, category: null };
  }
};
```

## Security & Privacy

⚠️ **Important:** Never:
- Commit your API key to git
- Share API key in public code
- Send sensitive PII to Gemini without user consent
- Store API key in app bundle

✅ **Do:**
- Use environment variables
- Rotate keys regularly
- Monitor usage in Google Cloud Console
- Inform users about AI analysis

## Testing

### Test Without API Key

```typescript
// In test/dev mode without API key
const mockGeminiService = {
  analyzeMessageSafety: async () => ({
    isSafe: true,
    recommendation: 'Test mode'
  }),
  generateSmartSuggestions: async () => [
    'Mock suggestion 1',
    'Mock suggestion 2'
  ]
};
```

## Next Steps

1. ✅ Get Gemini API key from Google AI Studio
2. ✅ Add `EXPO_PUBLIC_GEMINI_API_KEY` to `.env.local`
3. ✅ Initialize Gemini in App.tsx
4. ✅ Import geminiService in components
5. ✅ Add safety checks before posting
6. ✅ Implement smart suggestions
7. ✅ Test with real messages

## Resources

- **Google AI Studio**: https://aistudio.google.com/app/apikey
- **Gemini API Docs**: https://ai.google.dev/tutorials/get_started_web
- **Pricing**: https://ai.google.dev/pricing
- **Models**: https://ai.google.dev/models

---

**Ready to add AI features?** Start by getting your API key from Google AI Studio!
