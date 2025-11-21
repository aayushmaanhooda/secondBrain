import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, LogOut, Brain, Moon, Sun } from 'lucide-react';
import BackgroundAnimation from '../components/animations/BackgroundAnimation';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your external memory. What would you like to recall today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const brainName = localStorage.getItem('brainName') || 'User';
  const isNewUser = localStorage.getItem('isNewUser') === 'true';

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: brainName,
          message: input 
        }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to your brain right now.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMemoryClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmClearMemory = () => {
    setMessages([{ id: Date.now(), text: "Memory cleared. Starting fresh.", sender: 'bot' }]);
    setIsDeleteModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('brainName');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)', position: 'relative', overflow: 'hidden' }}>
      <BackgroundAnimation theme={theme} />
      
      {/* Header */}
      <header style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--header-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)', zIndex: 10, flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '8px', borderRadius: '12px' }}>
            <Brain color="var(--secondary-color)" size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{brainName}</h2>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></span>
              Online
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '10px', background: isNewUser ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)', color: isNewUser ? '#60a5fa' : '#c084fc', border: isNewUser ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)', whiteSpace: 'nowrap' }}>
            {isNewUser ? 'New User' : 'Old User'}
          </span>
          <button
            onClick={toggleTheme}
            style={{ height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', transition: 'all 0.2s', cursor: 'pointer' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={handleClearMemoryClick}
            style={{ height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', transition: 'all 0.2s', fontWeight: '500', cursor: 'pointer' }}
            onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={handleLogout}
            style={{ height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid var(--primary-color)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', transition: 'all 0.2s', fontWeight: '500', cursor: 'pointer' }}
            onMouseOver={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.1)'}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 10 }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: window.innerWidth < 640 ? '85%' : '70%',
                padding: '0.875rem 1.25rem',
                borderRadius: '20px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '20px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
                background: msg.sender === 'user' ? 'var(--message-user-bg)' : 'var(--message-bot-bg)',
                color: msg.sender === 'user' ? 'white' : 'var(--text-color)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: msg.sender === 'bot' ? '1px solid var(--glass-border)' : 'none',
                lineHeight: '1.5',
                fontSize: window.innerWidth < 640 ? '0.9rem' : '1rem'
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem', background: 'var(--header-bg)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', marginBottom: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '1rem 1.25rem', paddingRight: '3.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-color)', outline: 'none', fontSize: window.innerWidth < 640 ? '0.9rem' : '1rem', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--secondary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
          <button 
            onClick={handleSend}
            style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', width: window.innerWidth < 640 ? '42px' : '48px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #40ffaa, #4079ff)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, opacity 0.2s' }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            <Send size={window.innerWidth < 640 ? 18 : 20} />
          </button>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-color)', opacity: 0.4, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          © 2025 • Powered by Aayushmaan's AI
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '90%', maxWidth: '400px', background: 'var(--bg-color)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-color)', fontWeight: 'bold' }}>Are you sure?</h2>
              <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '2rem', lineHeight: '1.6' }}>
                This will delete all your memory of your second brain. This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClearMemory}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
