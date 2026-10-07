import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import LandingPage from './components/LandingPage.js';
import Converter from './pages/Converter.js';
import History from './pages/History.js';
import { checkHealth } from './services/api.js';

type Page = 'home' | 'converter' | 'history';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [backendHealth, setBackendHealth] = useState<{
    status: string;
    services: Record<string, string>;
  } | null>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await checkHealth();
        setBackendHealth(health);

        // Warn if Claude API is not configured
        if (health.services.claude_api === 'not_configured') {
          console.warn(
            'Claude API is not configured. Set CLAUDE_API_KEY environment variable to enable AI features.'
          );
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        onNavigate={(page) => setCurrentPage(page)}
        currentPage={currentPage}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <LandingPage onStartClick={() => setCurrentPage('converter')} />
        )}
        {currentPage === 'converter' && (
          <Converter onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'history' && (
          <History onBack={() => setCurrentPage('home')} />
        )}
      </main>

      <Footer />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
