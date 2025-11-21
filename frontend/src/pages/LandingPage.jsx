import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X } from 'lucide-react';
import Galaxy from '../components/react-bits/Galaxy';
import GradientText from '../components/react-bits/GradientText';

const LandingPage = () => {
  const [brainName, setBrainName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAccess = async () => {
    if (brainName.trim()) {
      try {
        const response = await fetch('http://localhost:8000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: brainName }),
        });
        
        const data = await response.json();
        localStorage.setItem('brainName', brainName);
        localStorage.setItem('isNewUser', data.is_new_user);
        navigate('/chat');
      } catch (error) {
        console.error('Error accessing brain:', error);
        // Fallback to local storage if API fails
        localStorage.setItem('brainName', brainName);
        localStorage.setItem('isNewUser', 'true');
        navigate('/chat');
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: '#0f0f13' }}>
      {/* Background Galaxy */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.5}
          saturation={0.8}
          hueShift={200} // Blue/Cyan shift
        />
      </div>

      {/* Glass Navbar */}
      <nav style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: window.innerWidth < 640 ? '1rem' : '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Brain size={window.innerWidth < 640 ? 24 : 32} color="#40ffaa" />
          <span style={{ fontSize: window.innerWidth < 640 ? '1.1rem' : '1.5rem', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>MyBrain</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            padding: window.innerWidth < 640 ? '0.6rem 1rem' : '0.8rem 1.5rem', 
            borderRadius: '30px', 
            border: '1px solid rgba(255, 255, 255, 0.2)', 
            background: 'rgba(255, 255, 255, 0.1)', 
            color: 'white', 
            fontSize: window.innerWidth < 640 ? '0.9rem' : '1rem', 
            fontWeight: '500', 
            cursor: 'pointer', 
            transition: 'all 0.3s',
            backdropFilter: 'blur(5px)'
          }}
          onMouseOver={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; e.target.style.borderColor = '#40ffaa'; }}
          onMouseOut={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
        >
          Get Started
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', pointerEvents: 'none', padding: '0 1rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ pointerEvents: 'auto' }}
        >
          <h1 style={{ fontSize: window.innerWidth < 640 ? '2.5rem' : window.innerWidth < 1024 ? '3.5rem' : '5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.1 }}>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
              className="hero-title"
            >
              Unlock Your<br />Second Brain
            </GradientText>
          </h1>
          <p style={{ fontSize: window.innerWidth < 640 ? '1rem' : '1.2rem', color: '#a0a0a0', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6', padding: '0 1rem' }}>
            Seamlessly store, recall, and organize your thoughts with our advanced AI memory assistant.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              padding: window.innerWidth < 640 ? '0.875rem 2rem' : '1rem 3rem', 
              borderRadius: '50px', 
              border: 'none', 
              background: 'linear-gradient(90deg, #40ffaa, #4079ff)', 
              color: '#000', 
              fontSize: window.innerWidth < 640 ? '1rem' : '1.2rem', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              boxShadow: '0 0 20px rgba(64, 121, 255, 0.5)',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            Access My Memory
          </button>
        </motion.div>

        <div style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: window.innerWidth < 640 ? '0.75rem' : '0.9rem', letterSpacing: '0.5px' }}>
          © 2025 • Powered by Aayushmaan's AI
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '90%', maxWidth: '400px', background: '#1a1a2e', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(64, 121, 255, 0.3)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'white', textAlign: 'center' }}>Identify Yourself</h2>
              <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>Enter your Brain Name to sync your memories.</p>

              <div style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  value={brainName}
                  onChange={(e) => setBrainName(e.target.value)}
                  placeholder="e.g. aayush"
                  autoFocus
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1.1rem', transition: 'all 0.3s' }}
                  onFocus={(e) => { e.target.style.borderColor = '#4079ff'; e.target.style.boxShadow = '0 0 0 2px rgba(64, 121, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#333'; e.target.style.boxShadow = 'none'; }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                />
              </div>

              <button 
                onClick={handleAccess}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #40ffaa, #4079ff)', color: '#000', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Enter Brain
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

