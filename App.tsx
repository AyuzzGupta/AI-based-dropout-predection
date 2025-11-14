
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import PredictionPage from './components/PredictionPage';
import Navbar from './components/Navbar';
import { Teacher } from './types';

export type Page = 'home' | 'dashboard' | 'prediction';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<Teacher | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const handleLogin = (teacher: Teacher) => {
        setCurrentUser(teacher);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} currentUser={currentUser} />;
            case 'dashboard':
                return <DashboardPage currentUser={currentUser} />;
            case 'prediction':
                return <PredictionPage />;
            default:
                return <HomePage onNavigate={handleNavigate} currentUser={currentUser} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200">
            <Navbar 
                currentPage={currentPage} 
                onNavigate={handleNavigate} 
                onLogout={handleLogout} 
                currentUser={currentUser}
            />
            <div className="p-4 lg:p-8">
                {renderPage()}
            </div>
        </div>
    );
};

export default App;
