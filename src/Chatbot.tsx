import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chatbot.css';

// Initialize API
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `You are a helpful and friendly chatbot assistant for Valley High Academy, a senior high school.
Your goal is to answer questions from students, parents, and visitors about the school.

Here is some general information about Valley High Academy to help you answer questions:
- **Name:** Valley High Academy
- **Motto:** "Excellence in Every Step"
- **Location:** 123 Education Lane, Valley City
- **Principal:** Dr. Sarah Mitchell
- **Established:** 1985
- **Tracks Offered:**
  - **Academic Track:** STEM (Science, Technology, Engineering, Mathematics), ABM (Accountancy, Business, and Management), HUMSS (Humanities and Social Sciences), GAS (General Academic Strand)
  - **TVL Track:** ICT (Information and Communications Technology), Home Economics
- **Facilities:** Modern Library, Science Labs, Computer Labs, Gymnasium, Cafeteria, Football Field.
- **School Hours:** Monday to Friday, 7:30 AM - 4:00 PM.
- **Contact:** (555) 123-4567 | info@valleyhigh.edu

If a user asks a question you don't have the specific answer to based on this context, politely explain that you are a demo bot and might not have real-time data, but suggest they contact the school office.
Always be polite, encouraging, and school-appropriate.`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! Welcome to Valley High Academy's virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !API_KEY) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      // The API expects history in specific format
      // Note: We filter out the very first welcome message if it's purely UI-based and not part of conversation flow, 
      // but keeping it simple here.
      const history = messages.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const chat = model.startChat({
        history: history as any, // Type assertion for compatibility
      });

      const result = await chat.sendMessage(userMessage.text);
      const response = await result.response;
      const botResponseText = response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please simulate checking your API key or try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="avatar">VH</div>
        <div className="header-info">
          <h2>Valley High Assistant</h2>
          <span className="status">Online</span>
        </div>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}
          >
            <div className="message-content">
              {msg.text}
            </div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about Valley High..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </form>
      {!API_KEY && (
        <div className="api-key-warning">
          Warning: VITE_GOOGLE_API_KEY is missing in .env file
        </div>
      )}
    </div>
  );
};

export default Chatbot;
