// // components/ChatInterface.js
// 'use client'; // This must be a Client Component to use hooks like useState and handle form submissions

// import { useState } from 'react';

// export default function ChatInterface() {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([
//     { role: 'ai', content: 'Hello! I am a fast language model powered by Groq. How can I help you today?' }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userMessage = input.trim();
//     if (!userMessage || isLoading) return;

//     // 1. Add user message to the display immediately
//     const newMessages = [...messages, { role: 'user', content: userMessage }];
//     setMessages(newMessages);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // 2. Call the Next.js API Route
//       const res = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // We only send the latest user message to the API
//         body: JSON.stringify({ message: userMessage }), 
//       });

//       const data = await res.json();

//       // 3. Update the messages with the AI's response
//       if (res.ok) {
//         setMessages((prev) => [
//           ...prev, 
//           { role: 'ai', content: data.response }
//         ]);
//       } else {
//         setMessages((prev) => [
//           ...prev, 
//           { role: 'ai', content: `Error: ${data.error || 'Failed to get response from API.'}` }
//         ]);
//       }

//     } catch (error) {
//       console.error("Fetch Error:", error);
//       setMessages((prev) => [
//         ...prev, 
//         { role: 'ai', content: 'An unexpected connection error occurred.' }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Basic inline styling for presentation
//   const styles = {
//     chatBox: { height: '400px', overflowY: 'auto', border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' },
//     messageContainer: { marginBottom: '10px', display: 'flex' },
//     userMessage: { marginLeft: 'auto', backgroundColor: '#0070f3', color: 'white', padding: '8px 12px', borderRadius: '15px 15px 0 15px' },
//     aiMessage: { marginRight: 'auto', backgroundColor: '#e9ecef', padding: '8px 12px', borderRadius: '15px 15px 15px 0' },
//     inputForm: { display: 'flex' }
//   };

//   return (
//     <div>
//       <h3>Groq AI Chat</h3>
//       <div style={styles.chatBox}>
//         {messages.map((msg, index) => (
//           <div key={index} style={styles.messageContainer}>
//             <div style={msg.role === 'user' ? styles.userMessage : styles.aiMessage}>
//               {msg.content}
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//             <div style={{ ...styles.messageContainer, justifyContent: 'flex-start' }}>
//                 <div style={styles.aiMessage}>...Groq is thinking...</div>
//             </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} style={styles.inputForm}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//           disabled={isLoading}
//           style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px' }}
//         />
//         <button 
//           type="submit" 
//           disabled={isLoading} 
//           style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: isLoading ? 'not-allowed' : 'pointer' }}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }





// 'use client'; 

// import { useState, useEffect, useRef } from 'react';
// import { Send, Loader2, Bot, User } from 'lucide-react'; // Using Lucide icons for a modern look

// // Color constants based on your theme
// const ACCENT_COLOR_TAILWIND = 'bg-[#EFA765]';
// const ACCENT_COLOR_HOVER = 'hover:bg-[#d89759]';
// const BORDER_COLOR = 'border-slate-700';

// export default function ChatInterface() {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([
//     { role: 'ai', content: 'Hello! I am an AI support assistant. I can help with questions about your orders, bookings, and general inquiries. How can I assist you today?' }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Ref for auto-scrolling the chat container
//   const messagesEndRef = useRef(null);

//   // Auto-scroll function
//   // const scrollToBottom = () => {
//   //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   // };

//   // Scroll to bottom whenever messages or loading state changes
//   // useEffect(() => {
//   //   scrollToBottom();
//   // }, [messages, isLoading]);


//   // Function to handle exponential backoff for retries
//   const withRetry = async (fn, retries = 3) => {
//     for (let i = 0; i < retries; i++) {
//         try {
//             return await fn();
//         } catch (error) {
//             if (i < retries - 1) {
//                 const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s delay
//                 await new Promise(resolve => setTimeout(resolve, delay));
//             } else {
//                 throw error;
//             }
//         }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userMessage = input.trim();
//     if (!userMessage || isLoading) return;

//     // 1. Add user message to the display immediately
//     const newMessages = [...messages, { role: 'user', content: userMessage }];
//     setMessages(newMessages);
//     setInput('');
//     setIsLoading(true);

//     try {
//       await withRetry(async () => {
//         // 2. Call the Next.js API Route (Ensure you have /api/chat/route.js set up securely)
//         const res = await fetch('/api/chat', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ message: userMessage }), 
//         });
  
//         const data = await res.json();
  
//         // 3. Update the messages with the AI's response
//         if (res.ok) {
//           setMessages((prev) => [
//             ...prev, 
//             { role: 'ai', content: data.response }
//           ]);
//         } else {
//           // Error handling
//           setMessages((prev) => [
//             ...prev, 
//             { 
//                 role: 'ai', 
//                 content: `Error: ${data.error || 'Failed to get response from API. Check the server logs.'}` 
//             }
//           ]);
//           throw new Error("API call failed"); // Throw to trigger retry logic if needed
//         }
//       });

//     } catch (error) {
//       console.error("Fetch/Retry Error:", error);
//       // Fallback message if all retries fail
//       setMessages((prev) => {
//         const lastMessage = prev[prev.length - 1];
//         if (lastMessage.role !== 'ai' || !lastMessage.content.startsWith('Error:')) {
//              return [...prev, { role: 'ai', content: 'An unexpected connection error occurred after multiple attempts. Please try again later.' }];
//         }
//         return prev;
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     // Card component look and feel
//     <div className={`bg-slate-800 p-6 rounded-xl shadow-2xl border ${BORDER_COLOR} flex flex-col h-[550px] transition-all`}>
      
//       {/* Card Header (Title) */}
//       <div className="flex items-center mb-4 pb-4 border-b border-slate-700">
//         <Bot className="w-6 h-6 mr-3 text-[#EFA765]" />
//         <div>
//           <h3 className="text-xl font-bold text-white">AI Support Chat</h3>
//           <span className="text-sm text-slate-400">Instant answers powered by Groq</span>
//         </div>
//       </div>

//       {/* Card Content (Chat History Container - Scroll Area) */}
//       <div className="flex-grow overflow-y-auto space-y-5 py-2 pr-2 custom-scrollbar">
//         {messages.map((msg, index) => (
//           <div 
//             key={index} 
//             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
//           >
//             {/* AI Avatar */}
//             {msg.role === 'ai' && (
//                 <div className="w-8 h-8 rounded-full bg-slate-700 p-1 mr-3 flex-shrink-0 flex items-center justify-center">
//                     <Bot className="w-4 h-4 text-[#EFA765]" />
//                 </div>
//             )}
            
//             {/* Message Bubble */}
//             <div 
//               className={`max-w-[75%] p-3 text-sm rounded-xl transition-all duration-300 shadow-md 
//                 ${msg.role === 'user' 
//                   ? `${ACCENT_COLOR_TAILWIND} text-slate-900 rounded-br-sm group-hover:shadow-lg` 
//                   : 'bg-slate-700 text-white rounded-tl-sm border border-slate-600 group-hover:shadow-lg'
//                 }`}
//             >
//               <p className="whitespace-pre-wrap">{msg.content}</p>
//             </div>
            
//             {/* User Avatar */}
//             {msg.role === 'user' && (
//                 <div className="w-8 h-8 rounded-full bg-slate-700 p-1 ml-3 flex-shrink-0 flex items-center justify-center">
//                     <User className="w-4 h-4 text-white" />
//                 </div>
//             )}
//           </div>
//         ))}

//         {/* Loading Indicator */}
//         {isLoading && (
//             <div className="flex justify-start">
//                  <div className="w-8 h-8 rounded-full bg-slate-700 p-1 mr-3 flex-shrink-0 flex items-center justify-center">
//                     <Bot className="w-4 h-4 text-[#EFA765]" />
//                 </div>
//                 <div className="bg-slate-700 text-white p-3 text-sm rounded-xl rounded-tl-sm">
//                     <Loader2 className="w-4 h-4 mr-2 inline-block animate-spin text-[#EFA765]" />
//                     <span className="text-slate-400">AI is composing a response...</span>
//                 </div>
//             </div>
//         )}
//         <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
//       </div>
      
//       {/* Card Footer (Input Form) */}
//       <form onSubmit={handleSubmit} className="flex mt-4 pt-4 border-t border-slate-700">
//         {/* Replicating shadcn Input style */}
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask your support question..."
//           disabled={isLoading}
//           className={`flex-grow h-12 p-4 rounded-l-lg bg-slate-700 text-white text-sm border ${BORDER_COLOR} 
//           focus:border-[#EFA765] focus:ring-1 focus:ring-[#EFA765] transition-colors duration-150 outline-none 
//           placeholder:text-slate-500 disabled:opacity-50`}
//         />
//         {/* Replicating shadcn Button style (variant: primary) */}
//         <button 
//           type="submit" 
//           disabled={isLoading || !input.trim()} 
//           className={`h-12 flex items-center justify-center px-4 rounded-r-lg ${ACCENT_COLOR_TAILWIND} text-slate-900 font-semibold 
//           ${ACCENT_COLOR_HOVER} transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md`}
//           aria-label="Send message"
//         >
//             {isLoading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//             ) : (
//                 <Send className="w-5 h-5" />
//             )}
//         </button>
//       </form>
//     </div>
//   );
// }






'use client'; 

import { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react'; // Using Lucide icons for a modern look
import { toast } from 'sonner';

// Color constants based on your theme
const ACCENT_COLOR_TAILWIND = 'bg-[#EFA765]';
const ACCENT_COLOR_HOVER = 'hover:bg-[#d89759]';
const BORDER_COLOR = 'border-slate-700';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  
  // Use useMemo for the initial message with the Jarvis persona
  const initialMessage = useMemo(() => ([
    { 
      role: 'ai', 
      content: "Hello! I am Jarvis, the dedicated virtual assistant for Luminous Bistro. I'm here to guide you through our menu, assist with ordering, and help with general inquiries. How can I assist you today?" 
    }
  ]), []);
  
  const [messages, setMessages] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 🟢 NEW: Ref for the scrollable container itself
  const chatContainerRef = useRef(null);

  // 2. 🟢 MODIFIED: Auto-scroll function now targets the specific chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
        // Set the scroll position of the chat container to its maximum height
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 3. 🟢 UNCOMMENTED: Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);


  // Function to handle exponential backoff for retries
  const withRetry = async (fn, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i < retries - 1) {
          const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s delay
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    // 1. Add user message to the display immediately
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      await withRetry(async () => {
        // 2. Call the Next.js API Route
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 🟢 CRITICAL: Send the full message history to maintain conversation context
          body: JSON.stringify({ message: userMessage, history: newMessages }), 
        });

        const data = await res.json();

        // 3. Update the messages with the AI's response
        if (res.ok) {
          setMessages((prev) => [
            ...prev, 
            { role: 'ai', content: data.response }
          ]);
        } else {
          // Error handling
          setMessages((prev) => [
            ...prev, 
            { 
              role: 'ai', 
              content: `Error: ${data.error || 'Failed to get response from API. Check the server logs.'}` 
            }
          ]);
          throw new Error("API call failed"); // Throw to trigger retry logic if needed
        }
      });

    } catch (error) {
      console.error("Fetch/Retry Error:", error);
      // Fallback message if all retries fail
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role !== 'ai' || !lastMessage.content.startsWith('Error:')) {
              return [...prev, { role: 'ai', content: 'An unexpected connection error occurred after multiple attempts. Please try again later.' }];
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    // Card component look and feel
    <div className={`bg-slate-800  p-6 rounded-xl shadow-2xl border ${BORDER_COLOR} flex flex-col h-[550px] transition-all`}>
      
      {/* Card Header (Title) */}
      <div className="flex items-center mb-4 pb-4 border-b border-slate-700">
        <Bot className="w-6 h-6 mr-3 text-[#EFA765]" />
        <div>
          <h3 className="text-xl font-bold text-white">Jarvis - Luminous Bistro Support</h3>
          <span className="text-sm text-slate-400">Instant answers powered by Groq</span>
        </div>
      </div>

      {/* Card Content (Chat History Container - Scroll Area) */}
      <div 
        ref={chatContainerRef} // 4. 🟢 APPLIED: Attach the ref to the scrollable div
        className="flex-grow overflow-y-auto space-y-5 py-2 pr-2 custom-scrollbar"
      >
        {messages.map((msg, index) => (
          <div 
            // 🟢 Improved keying using role and index
            key={`${msg.role}-${index}`} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            {/* AI Avatar */}
            {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 p-1 mr-3 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#EFA765]" />
                </div>
            )}
            
            {/* Message Bubble */}
            <div 
              className={`max-w-[75%] p-3 text-sm rounded-xl transition-all duration-300 shadow-md 
                ${msg.role === 'user' 
                  ? `${ACCENT_COLOR_TAILWIND} text-slate-900 rounded-br-sm group-hover:shadow-lg` 
                  : 'bg-slate-700 text-white rounded-tl-sm border border-slate-600 group-hover:shadow-lg'
                }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
            
            {/* User Avatar */}
            {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 p-1 ml-3 flex-shrink-0 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
            <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-slate-700 p-1 mr-3 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#EFA765]" />
                  </div>
                  <div className="bg-slate-700 text-white p-3 text-sm rounded-xl rounded-tl-sm">
                      <Loader2 className="w-4 h-4 mr-2 inline-block animate-spin text-[#EFA765]" />
                      <span className="text-slate-400">Jarvis is composing a response...</span>
                  </div>
            </div>
        )}
        {/* Removed redundant messagesEndRef element */}
      </div>
      
      {/* Card Footer (Input Form) */}
      <form onSubmit={handleSubmit} className="flex mt-4 pt-4 border-t border-slate-700">
        {/* Replicating shadcn Input style */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your support question..."
          disabled={isLoading}
          className={`flex-grow h-12 p-4 rounded-l-lg bg-slate-700 text-white text-sm border ${BORDER_COLOR} 
          focus:border-[#EFA765] focus:ring-1 focus:ring-[#EFA765] transition-colors duration-150 outline-none 
          placeholder:text-slate-500 disabled:opacity-50`}
        />
        {/* Replicating shadcn Button style (variant: primary) */}
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()} 
          className={`h-12 flex items-center justify-center px-4 rounded-r-lg ${ACCENT_COLOR_TAILWIND} text-slate-900 font-semibold 
          ${ACCENT_COLOR_HOVER} transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md`}
          aria-label="Send message"
        >
          {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
              <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}