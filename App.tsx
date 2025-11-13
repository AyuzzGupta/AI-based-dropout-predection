
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import PredictionPage from './components/PredictionPage';
import Navbar from './components/Navbar';

export type Page = 'home' | 'dashboard' | 'prediction';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} />;
            case 'dashboard':
                return <DashboardPage />;
            case 'prediction':
                return <PredictionPage />;
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200">
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} />
            <div className="p-4 lg:p-8">
                {renderPage()}
            </div>
        </div>
    );
};

export default App;
