
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Student, RiskLevel, CounselStatus, Teacher } from '../types';
import { getStudentsForTeacher, updateStudentInStorage } from '../services/studentService';
import SummaryCard from './SummaryCard';
import CounselingChatbot from './CounselingChatbot';
import StudentTable from './StudentTable';

interface DashboardPageProps {
    currentUser: Teacher;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<RiskLevel | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isGeneralChatbotOpen, setIsGeneralChatbotOpen] = useState(false);

    useEffect(() => {
        const loadStudentData = async () => {
            if (!currentUser) return;
            setIsLoading(true);
            const data = await getStudentsForTeacher(currentUser);
            setStudents(data);
            setIsLoading(false);
        };
        loadStudentData();
    }, [currentUser]);

    const summaryData = useMemo(() => {
        const total = students.length;
        const highRisk = students.filter(s => s.riskLevel === RiskLevel.High).length;
        const mediumRisk = students.filter(s => s.riskLevel === RiskLevel.Medium).length;
        const lowRisk = students.filter(s => s.riskLevel === RiskLevel.Low).length;
        return { total, highRisk, mediumRisk, lowRisk };
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students
            .filter(student => filter === 'all' || student.riskLevel === filter)
            .filter(student =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.id.toString().includes(searchQuery)
            );
    }, [students, filter, searchQuery]);

    const chartData = useMemo(() => {
        const riskAttendance = {
            [RiskLevel.Low]: { total: 0, count: 0 },
            [RiskLevel.Medium]: { total: 0, count: 0 },
            [RiskLevel.High]: { total: 0, count: 0 },
        };

        students.forEach(s => {
            riskAttendance[s.riskLevel].total += s.attendance;
            riskAttendance[s.riskLevel].count++;
        });

        return Object.entries(riskAttendance).map(([risk, data]) => ({
            name: risk,
            'Average Attendance': data.count > 0 ? Math.round(data.total / data.count) : 0,
        }));
    }, [students]);

    const gradeDistribution = useMemo(() => {
        const grades = { 'A (90+)': 0, 'B (80-89)': 0, 'C (70-79)': 0, 'D (60-69)': 0, 'F (<60)': 0 };
        students.forEach(s => {
            if (s.avgScore >= 90) grades['A (90+)']++;
            else if (s.avgScore >= 80) grades['B (80-89)']++;
            else if (s.avgScore >= 70) grades['C (70-79)']++;
            else if (s.avgScore >= 60) grades['D (60-69)']++;
            else grades['F (<60)']++;
        });
        return Object.entries(grades).map(([name, value]) => ({ name, value }));
    }, [students]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EF4444'];
    
    const handleCounsel = useCallback((student: Student) => {
        setSelectedStudent(student);
    }, []);

    const handleCloseChatbot = useCallback(() => {
        setSelectedStudent(null);
    }, []);

    const handleOpenGeneralChatbot = useCallback(() => {
        setIsGeneralChatbotOpen(true);
    }, []);

    const handleCloseGeneralChatbot = useCallback(() => {
        setIsGeneralChatbotOpen(false);
    }, []);

    const updateCounselStatus = useCallback(async (studentId: number, status: CounselStatus) => {
        const studentToUpdate = students.find(s => s.id === studentId);
        if (studentToUpdate) {
            const updatedStudent = { ...studentToUpdate, counselStatus: status };
            await updateStudentInStorage(updatedStudent);
            setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
        }
        handleCloseChatbot();
    }, [students, handleCloseChatbot]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="text-xl text-slate-300 mt-4">Loading Student Data for Class {currentUser.class}...</p>
                    <p className="text-slate-400">This may take a moment on the first login.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">{currentUser.name}'s Dashboard</h1>
                <p className="text-slate-400 mt-1">Monitor student risk levels and analytics for Class {currentUser.class}.</p>
            </header>

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard title="Total Students" value={summaryData.total} color="bg-blue-600" />
                    <SummaryCard title="High-Risk Students" value={summaryData.highRisk} color="bg-red-600" />
                    <SummaryCard title="Medium-Risk Students" value={summaryData.mediumRisk} color="bg-orange-500" />
                    <SummaryCard title="Low-Risk Students" value={summaryData.lowRisk} color="bg-green-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-violet-400">Attendance vs Dropout Risk</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}/>
                                <Legend />
                                <Bar dataKey="Average Attendance" fill="#818cf8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-violet-400">Grade Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                           <PieChart>
                                <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {gradeDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}/>
                                <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <StudentTable
                    students={filteredStudents}
                    onCounsel={handleCounsel}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filter={filter}
                    setFilter={setFilter}
                />
            </div>
            
            <button
                onClick={handleOpenGeneralChatbot}
                className="fixed bottom-8 right-8 bg-violet-600 hover:bg-violet-700 text-white rounded-full p-4 shadow-lg transform hover:scale-110 transition-transform duration-300 z-40"
                aria-label="Open AI Counselor"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {selectedStudent && (
                <CounselingChatbot 
                    student={selectedStudent} 
                    onClose={handleCloseChatbot}
                    onStatusUpdate={updateCounselStatus}
                />
            )}

            {isGeneralChatbotOpen && (
                <CounselingChatbot
                    onClose={handleCloseGeneralChatbot}
                />
            )}
        </div>
    );
};

export default DashboardPage;
