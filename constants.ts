
import { Student, RiskLevel, CounselStatus } from './types';

export const mockStudents: Student[] = [
    { id: 101, name: 'Alice Johnson', attendance: 95, avgScore: 88, attempts: 1, feesDue: 0, riskLevel: RiskLevel.Low, counselStatus: CounselStatus.Pending },
    { id: 102, name: 'Bob Williams', attendance: 75, avgScore: 65, attempts: 3, feesDue: 15, riskLevel: RiskLevel.Medium, counselStatus: CounselStatus.Pending },
    { id: 103, name: 'Charlie Brown', attendance: 55, avgScore: 48, attempts: 4, feesDue: 30, riskLevel: RiskLevel.High, counselStatus: CounselStatus.Pending },
    { id: 104, name: 'Diana Miller', attendance: 98, avgScore: 92, attempts: 1, feesDue: 0, riskLevel: RiskLevel.Low, counselStatus: CounselStatus.Done },
    { id: 105, name: 'Ethan Davis', attendance: 68, avgScore: 71, attempts: 2, feesDue: 5, riskLevel: RiskLevel.Medium, counselStatus: CounselStatus.Pending },
    { id: 106, name: 'Fiona Garcia', attendance: 45, avgScore: 52, attempts: 5, feesDue: 60, riskLevel: RiskLevel.High, counselStatus: CounselStatus.Pending },
    { id: 107, name: 'George Rodriguez', attendance: 85, avgScore: 78, attempts: 2, feesDue: 0, riskLevel: RiskLevel.Low, counselStatus: CounselStatus.Pending },
    { id: 108, name: 'Hannah Martinez', attendance: 81, avgScore: 75, attempts: 2, feesDue: 10, riskLevel: RiskLevel.Medium, counselStatus: CounselStatus.Done },
    { id: 109, name: 'Ian Wilson', attendance: 91, avgScore: 85, attempts: 1, feesDue: 0, riskLevel: RiskLevel.Low, counselStatus: CounselStatus.Pending },
    { id: 110, name: 'Jane Anderson', attendance: 62, avgScore: 58, attempts: 3, feesDue: 25, riskLevel: RiskLevel.High, counselStatus: CounselStatus.Pending },
    { id: 111, name: 'Kevin Thomas', attendance: 78, avgScore: 69, attempts: 3, feesDue: 18, riskLevel: RiskLevel.Medium, counselStatus: CounselStatus.Pending },
    { id: 112, name: 'Laura Taylor', attendance: 59, avgScore: 61, attempts: 4, feesDue: 40, riskLevel: RiskLevel.High, counselStatus: CounselStatus.Done },
];
