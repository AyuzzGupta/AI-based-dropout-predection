
import { Student, Teacher } from '../types';
import { generateStudentData } from './geminiService';

const getStorageKey = (teacherId: string) => `students_${teacherId}`;

/**
 * Fetches the list of students for a given teacher.
 * First, it checks localStorage. If data exists, it returns it.
 * If not, it calls the Gemini API to generate new data, saves it to localStorage,
 * and then returns it.
 */
export const getStudentsForTeacher = async (teacher: Teacher): Promise<Student[]> => {
    const storageKey = getStorageKey(teacher.id);
    try {
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            const newStudents = await generateStudentData(teacher);
            localStorage.setItem(storageKey, JSON.stringify(newStudents));
            return newStudents;
        }
    } catch (error) {
        console.error("Error accessing student data from storage or API:", error);
        // Fallback to generating data without storing if localStorage fails
        return generateStudentData(teacher);
    }
};

/**
 * Updates a single student's information in localStorage.
 */
export const updateStudentInStorage = async (updatedStudent: Student): Promise<void> => {
    const storageKey = getStorageKey(updatedStudent.teacherId);
    try {
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            const students: Student[] = JSON.parse(storedData);
            const updatedStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
            localStorage.setItem(storageKey, JSON.stringify(updatedStudents));
        }
    } catch (error) {
        console.error("Error updating student data in storage:", error);
    }
};
