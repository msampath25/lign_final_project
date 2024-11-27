import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

dotenv.config();

const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a conversation storage mechanism
class ConversationManager {
  constructor(maxMessages = 5) {
    this.conversations = {};
    this.maxMessages = maxMessages;
  }

  addMessage(conversationId, message) {
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = [];
    }

    this.conversations[conversationId].push(message);

    // Trim conversation history if it exceeds max messages
    if (this.conversations[conversationId].length > this.maxMessages) {
      this.conversations[conversationId].shift();
    }
  }

  getConversation(conversationId) {
    return this.conversations[conversationId] || [];
  }

  clearConversation(conversationId) {
    this.conversations[conversationId] = [];
  }
}

// Initialize conversation manager
const conversationManager = new ConversationManager();

app.post('/chat', async (req, res) => {
  const { messages, conversationId = 'default' } = req.body;

  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid messages format',
      });
    }

    // Get existing conversation history
    const conversationHistory = conversationManager.getConversation(conversationId);

    // Combine existing history with new messages
    const fullMessageContext = [
      ...conversationHistory,
      ...messages
    ];

    // Send messages to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: fullMessageContext,
    });

    const completion = response.choices[0].message;

    // Add user messages and AI response to conversation history
    messages.forEach(msg => conversationManager.addMessage(conversationId, msg));
    conversationManager.addMessage(conversationId, completion);

    // Return OpenAI response to frontend
    return res.status(200).json({
      success: true,
      message: completion,
      conversationId: conversationId
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

// Clear conversation endpoint
app.post('/clear-conversation', (req, res) => {
  const { conversationId = 'default' } = req.body;
  conversationManager.clearConversation(conversationId);
  
  res.status(200).json({
    success: true,
    message: 'Conversation cleared',
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));


// The following code tries to use LlamaIndex but is not yet functional:


// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { 
//   Settings, 
//   OpenAI as LlamaOpenAI, 
//   ContextChatEngine, 
//   VectorStoreIndex,
//   Document
// } from 'llamaindex';

// dotenv.config();

// const port = 3000;
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Configure LlamaIndex settings with explicit OpenAI configuration
// Settings.llm = new LlamaOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   model: 'gpt-4o-mini',
//   temperature: 0.1,
// });

// // Conversation storage and management
// class ConversationManager {
//   constructor() {
//     this.conversations = {};
//   }

//   async initializeConversation(conversationId = 'default') {
//     // If conversation doesn't exist, create a new one
//     if (!this.conversations[conversationId]) {
//       // Create a document to store conversation context
//       const contextDocument = new Document({
//         text: 'You are an academic advisor for UCSD. Provide course recommendations based on the user input.',
//         metadata: {
//           conversationId: conversationId,
//           type: 'system_context'
//         }
//       });

//       // Create a vector store index with the context document
//       const index = await VectorStoreIndex.fromDocuments([contextDocument]);

//       // Create a query engine from the index
//       const queryEngine = index.asQueryEngine();

//       this.conversations[conversationId] = {
//         index,
//         queryEngine,
//         messages: [
//           {
//             role: 'system',
//             content: 'You are an academic advisor for UCSD. Provide course recommendations based on the user input.'
//           }
//         ]
//       };
//     }

//     return this.conversations[conversationId];
//   }

//   async getChatEngine(conversationId = 'default') {
//     const conversation = await this.initializeConversation(conversationId);
    
//     // Create a new context chat engine with the current conversation context
//     return new ContextChatEngine({
//       chatModel: Settings.llm,
//       contextTemplate: conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n')
//     });
//   }

//   async addMessageToMemory(conversationId, message) {
//     const conversation = this.conversations[conversationId];
//     if (conversation) {
//       // Add the message to the conversation history
//       conversation.messages.push(message);

//       // Optional: If messages grow too large, you might want to implement a truncation strategy
//       if (conversation.messages.length > 20) {
//         conversation.messages.splice(1, 1); // Remove the oldest message, keeping system message
//       }
//     }
//   }

//   async clearConversation(conversationId = 'default') {
//     if (this.conversations[conversationId]) {
//       // Reset to initial system message
//       this.conversations[conversationId].messages = [
//         {
//           role: 'system',
//           content: 'You are an academic advisor for UCSD. Provide course recommendations based on the user input.'
//         }
//       ];
//     }
//   }
// }

// // Initialize conversation manager
// const conversationManager = new ConversationManager();

// app.post('/chat', async (req, res) => {
//   const { messages, conversationId = 'default' } = req.body;

//   try {
//     if (!messages || !Array.isArray(messages)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid messages format',
//       });
//     }

//     // Add messages to memory
//     for (const message of messages) {
//       await conversationManager.addMessageToMemory(conversationId, message);
//     }

//     // Get the chat engine for this conversation
//     const chatEngine = await conversationManager.getChatEngine(conversationId);

//     // Extract the last user message
//     const lastUserMessage = messages[messages.length - 1].content;

//     // Generate response using chat engine
//     const response = await chatEngine.chat(lastUserMessage);

//     // Return response to frontend
//     return res.status(200).json({
//       success: true,
//       message: {
//         role: 'assistant',
//         content: response.response
//       },
//       conversationId: conversationId
//     });
//   } catch (error) {
//     console.error('Chat Error:', error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || 'Internal server error',
//     });
//   }
// });

// // Clear conversation endpoint
// app.post('/clear-conversation', async (req, res) => {
//   const { conversationId = 'default' } = req.body;
  
//   try {
//     await conversationManager.clearConversation(conversationId);
    
//     res.status(200).json({
//       success: true,
//       message: 'Conversation cleared',
//     });
//   } catch (error) {
//     console.error('Clear Conversation Error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Error clearing conversation',
//     });
//   }
// });

// app.listen(port, () => console.log(`Server listening on port ${port}!`));