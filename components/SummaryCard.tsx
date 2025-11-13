
import React from 'react';

interface SummaryCardProps {
    title: string;
    value: number | string;
    color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color }) => {
    return (
        <div className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ${color}`}>
            <h3 className="text-lg font-medium text-white opacity-90">{title}</h3>
            <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
    );
};

export default SummaryCard;
