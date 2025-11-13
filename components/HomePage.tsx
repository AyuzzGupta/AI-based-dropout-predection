
import React from 'react';
import { Page } from '../App';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="text-center">
            <header className="mb-12 pt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">Welcome to the AI Dropout Prediction System</h1>
                <p className="max-w-3xl mx-auto text-lg text-slate-300">
                    This platform leverages AI to provide teachers with powerful tools to identify at-risk students and offer timely, effective counseling. Explore the system's features to enhance student success and retention.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div 
                    onClick={() => onNavigate('dashboard')}
                    className="bg-slate-800 p-8 rounded-lg shadow-lg border-2 border-transparent hover:border-cyan-500 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                >
                    <h2 className="text-2xl font-bold text-violet-400 mb-3">Counseling System</h2>
                    <p className="text-slate-400">
                        Access the full teacher dashboard. View student data, risk levels, and use the AI-powered chatbot to get personalized counseling strategies for each student.
                    </p>
                </div>
                <div 
                    onClick={() => onNavigate('prediction')}
                    className="bg-slate-800 p-8 rounded-lg shadow-lg border-2 border-transparent hover:border-cyan-500 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                >
                    <h2 className="text-2xl font-bold text-violet-400 mb-3">AI Based Dropout Prediction</h2>
                    <p className="text-slate-400">
                        Use our predictive model to get an instant dropout risk assessment. Input a student's key metrics—attendance, marks, and fees—to see their probability of dropping out.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
