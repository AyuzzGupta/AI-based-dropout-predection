
import React from 'react';
import { Page } from '../App';
import { Teacher } from '../types';

interface NavbarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    currentUser: Teacher;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLogout, currentUser }) => {
    const navItems: { page: Page; label: string }[] = [
        { page: 'home', label: 'Home' },
        { page: 'dashboard', label: 'Counseling System' },
        { page: 'prediction', label: 'Prediction Tool' },
    ];

    return (
        <nav className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="font-bold text-xl text-cyan-400">AI Dashboard</span>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.page}
                                        onClick={() => onNavigate(item.page)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            currentPage === item.page
                                                ? 'bg-slate-700 text-white'
                                                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-sm text-slate-300">
                            Welcome, {currentUser.name}
                        </span>
                        <button
                            onClick={onLogout}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
