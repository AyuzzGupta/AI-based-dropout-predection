
import { Teacher } from '../types';

interface TeacherLogin {
    email: string;
    password_hash: string; // In a real app, never store plain text passwords
    teacherId: string;
}

// 1. Teacher Info Table
const teachers: Teacher[] = [
    { id: 'T101', name: 'Mr. Sharma', class: '10A', email: 'sharma@example.com' },
    { id: 'T102', name: 'Mrs. Iyer', class: '12C', email: 'iyer@example.com' },
];

// 2. Teacher Login Table
const teacherLogins: TeacherLogin[] = [
    { email: 'sharma@example.com', password_hash: 'password123', teacherId: 'T101' },
    { email: 'iyer@example.com', password_hash: 'password123', teacherId: 'T102' },
];


export const authenticateUser = (email: string, password_plaintext: string): Teacher | null => {
    const loginInfo = teacherLogins.find(t => t.email.toLowerCase() === email.toLowerCase());

    // In a real app, you would compare password hashes
    if (loginInfo && loginInfo.password_hash === password_plaintext) {
        const teacherInfo = teachers.find(t => t.id === loginInfo.teacherId);
        return teacherInfo || null;
    }

    return null;
};
