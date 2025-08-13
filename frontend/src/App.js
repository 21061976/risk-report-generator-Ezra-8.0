import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import ReportGenerationPage from './pages/ReportGenerationPage';
import ReportViewPage from './pages/ReportViewPage';
import ReportsListPage from './pages/ReportsListPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<DocumentUploadPage />} />
              <Route path="/generate/:documentId" element={<ReportGenerationPage />} />
              <Route path="/report/:reportId" element={<ReportViewPage />} />
              <Route path="/reports" element={<ReportsListPage />} />
            </Routes>
          </main>
          
          <Footer />
          
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                direction: 'rtl'
              }
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
