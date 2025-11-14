
export enum RiskLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export enum CounselStatus {
    Pending = 'Pending',
    Done = 'Done',
}

export interface Student {
    id: number;
    name: string;
    attendance: number;
    avgScore: number;
    attempts: number;
    feesDue: number;
    riskLevel: RiskLevel;
    counselStatus: CounselStatus;
    teacherId: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Teacher {
    id: string;
    name: string;
    class: string;
    email: string;
}
