
import React, { useState } from 'react';
import { RiskLevel } from '../types';

interface PredictionResult {
    chance: number;
    riskLevel: RiskLevel;
}

const riskDisplayConfig: Record<RiskLevel, { color: string, message: string }> = {
    [RiskLevel.Low]: { color: 'text-green-400', message: "The student has a low probability of dropping out. Continue to monitor and encourage them." },
    [RiskLevel.Medium]: { color: 'text-orange-400', message: "The student is at a medium risk of dropping out. Proactive engagement and support are recommended." },
    [RiskLevel.High]: { color: 'text-red-400', message: "The student has a high probability of dropping out. Immediate intervention and counseling are strongly advised." },
};

const PredictionPage: React.FC = () => {
    const [attendance, setAttendance] = useState(85);
    const [avgScore, setAvgScore] = useState(75);
    const [feesDue, setFeesDue] = useState(10);
    const [result, setResult] = useState<PredictionResult | null>(null);

    const handlePredict = () => {
        // Simple heuristic model to simulate prediction
        // Weights: Attendance: 50%, Score: 30%, Fees: 20%
        const attendanceScore = (100 - attendance) * 0.5;
        const scorePenalty = (100 - avgScore) * 0.3;
        const feesPenalty = Math.min(feesDue / 60, 1) * 20; // Cap fees penalty contribution

        let dropoutChance = attendanceScore + scorePenalty + feesPenalty;
        dropoutChance = Math.max(0, Math.min(100, dropoutChance)); // Clamp between 0 and 100

        let riskLevel: RiskLevel;
        if (dropoutChance > 65) {
            riskLevel = RiskLevel.High;
        } else if (dropoutChance > 35) {
            riskLevel = RiskLevel.Medium;
        } else {
            riskLevel = RiskLevel.Low;
        }

        setResult({ chance: Math.round(dropoutChance), riskLevel });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">AI Dropout Prediction Model</h1>
                <p className="text-slate-400 mt-1">Enter student metrics to calculate dropout risk.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6">
                    <div>
                        <label htmlFor="attendance" className="block text-sm font-medium text-slate-300 mb-2">
                            Attendance Percentage ({attendance}%)
                        </label>
                        <input
                            type="range"
                            id="attendance"
                            min="0"
                            max="100"
                            value={attendance}
                            onChange={(e) => setAttendance(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                     <div>
                        <label htmlFor="avgScore" className="block text-sm font-medium text-slate-300 mb-2">
                            Average Score ({avgScore}/100)
                        </label>
                        <input
                            type="range"
                            id="avgScore"
                            min="0"
                            max="100"
                            value={avgScore}
                            onChange={(e) => setAvgScore(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                     <div>
                        <label htmlFor="feesDue" className="block text-sm font-medium text-slate-300 mb-2">
                            Fees Due (days: {feesDue})
                        </label>
                        <input
                            type="range"
                            id="feesDue"
                            min="0"
                            max="90"
                            value={feesDue}
                            onChange={(e) => setFeesDue(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <button
                        onClick={handlePredict}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-md transition-colors text-lg"
                    >
                        Predict Risk
                    </button>
                </div>
                
                <div className="bg-slate-800 p-8 rounded-lg shadow-lg h-full flex flex-col justify-center items-center min-h-[280px]">
                    {result ? (
                        <div className="text-center">
                            <p className="text-slate-400 text-lg">Predicted Dropout Chance</p>
                            <p className={`text-7xl font-bold my-2 ${riskDisplayConfig[result.riskLevel].color}`}>
                                {result.chance}%
                            </p>
                             <p className={`text-2xl font-semibold mb-4 ${riskDisplayConfig[result.riskLevel].color}`}>
                                Risk Level: {result.riskLevel}
                            </p>
                            <p className="text-slate-300 max-w-sm">
                                {riskDisplayConfig[result.riskLevel].message}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">
                            <p className="text-lg">Your prediction result will appear here.</p>
                            <p>Adjust the sliders and click "Predict Risk".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictionPage;
