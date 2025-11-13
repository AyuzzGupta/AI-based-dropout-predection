
import React, { useState, useRef, useEffect } from 'react';
import { Student, ChatMessage, CounselStatus } from '../types';
import { getCounselingSuggestion } from '../services/geminiService';

interface CounselingChatbotProps {
    student?: Student;
    onClose: () => void;
    onStatusUpdate?: (studentId: number, status: CounselStatus) => void;
}

const riskColorMap: Record<string, string> = {
    'Low': 'text-green-400',
    'Medium': 'text-orange-400',
    'High': 'text-red-400',
};

const CounselingChatbot: React.FC<CounselingChatbotProps> = ({ student, onClose, onStatusUpdate }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{
            role: 'model',
            text: student 
                ? `Hello! I'm here to help you with counseling for **${student.name}**. You can ask for conversation starters, intervention strategies, or specific advice based on their data. What would you like to know?`
                : `Hello! I'm your general AI counselor. You can ask me about intervention strategies, communication techniques, or any other student counseling topics.`
        }]);
    }, [student]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await getCounselingSuggestion(input, student);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };

        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    // A simple markdown to HTML converter
    const formatMessage = (text: string) => {
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 p-2 rounded-md my-2 text-sm"><code>$1</code></pre>');
        html = html.replace(/`(.*?)`/g, '<code class="bg-slate-900 px-1 rounded">$1</code>');
        html = html.replace(/\n/g, '<br />');
        return { __html: html };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col text-gray-200 relative">
                <header className="p-4 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-cyan-400">
                                {student ? `AI Counseling for ${student.name}` : 'General AI Counselor'}
                            </h2>
                             {student && (
                                <p className={`text-sm font-semibold ${riskColorMap[student.riskLevel]}`}>
                                    Risk Level: {student.riskLevel}
                                </p>
                            )}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                </header>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-violet-600 flex-shrink-0 flex items-center justify-center font-bold">AI</div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={formatMessage(msg.text)}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-600 flex-shrink-0 flex items-center justify-center font-bold">AI</div>
                            <div className="max-w-md p-3 rounded-lg bg-slate-700 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask for counseling advice..."
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                     {student && onStatusUpdate && (
                        <div className="flex justify-end gap-2 text-sm">
                            <button 
                                onClick={() => onStatusUpdate(student.id, CounselStatus.Done)}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                            >
                                Mark as Counseled
                            </button>
                        </div>
                     )}
                </footer>
            </div>
        </div>
    );
};

export default CounselingChatbot;
