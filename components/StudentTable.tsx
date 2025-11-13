
import React from 'react';
import { Student, RiskLevel, CounselStatus } from '../types';

interface StudentTableProps {
    students: Student[];
    onCounsel: (student: Student) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filter: RiskLevel | 'all';
    setFilter: (filter: RiskLevel | 'all') => void;
}

const riskColorMap: Record<RiskLevel, string> = {
    [RiskLevel.Low]: 'bg-green-500/20 text-green-400 border border-green-500/30',
    [RiskLevel.Medium]: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    [RiskLevel.High]: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

const statusColorMap: Record<CounselStatus, string> = {
    [CounselStatus.Pending]: 'text-yellow-400',
    [CounselStatus.Done]: 'text-cyan-400',
};

const StudentTable: React.FC<StudentTableProps> = ({ students, onCounsel, searchQuery, setSearchQuery, filter, setFilter }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">Student Overview</h3>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/3 bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as RiskLevel | 'all')}
                    className="w-full md:w-1/3 bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="all">All Risk Levels</option>
                    <option value={RiskLevel.High}>High Risk</option>
                    <option value={RiskLevel.Medium}>Medium Risk</option>
                    <option value={RiskLevel.Low}>Low Risk</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-600 text-slate-400">
                        <tr>
                            <th className="p-3">Student ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Attendance %</th>
                            <th className="p-3">Avg Score</th>
                            <th className="p-3">Risk Level</th>
                            <th className="p-3">Counseling Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-3">{student.id}</td>
                                <td className="p-3 font-medium">{student.name}</td>
                                <td className="p-3">{student.attendance}</td>
                                <td className="p-3">{student.avgScore}</td>
                                <td className="p-3">
                                    <span className={`px-3 py-1 text-sm rounded-full font-semibold ${riskColorMap[student.riskLevel]}`}>
                                        {student.riskLevel}
                                    </span>
                                </td>
                                <td className={`p-3 font-semibold ${statusColorMap[student.counselStatus]}`}>
                                    {student.counselStatus}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => onCounsel(student)}
                                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                    >
                                        Counsel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {students.length === 0 && (
                    <p className="text-center text-slate-400 py-8">No students found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default StudentTable;
