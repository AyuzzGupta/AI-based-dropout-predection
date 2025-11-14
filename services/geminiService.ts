
import { GoogleGenAI, Type } from "@google/genai";
import { Student, RiskLevel, CounselStatus, Teacher } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getCounselingSuggestion = async (question: string, student?: Student): Promise<string> => {
    try {
        let prompt: string;

        if (student) {
            prompt = `
            You are an expert student counselor integrated into a teacher's dashboard.
            A teacher is asking for advice about a student who is at risk of dropping out.
            Your goal is to provide actionable, empathetic, and specific advice.

            Student Details:
            - Name: ${student.name}
            - Risk Level: ${student.riskLevel}
            - Attendance: ${student.attendance}%
            - Average Score: ${student.avgScore}/100
            - Exam Attempts: ${student.attempts}
            - Days Fees are Due: ${student.feesDue} days

            The teacher's question is: "${question}"

            Based on the student's data and the teacher's question, provide a helpful and constructive response.
            Format your response in clear, easy-to-read markdown. If you suggest steps, use a numbered or bulleted list.
            `;
        } else {
            prompt = `
            You are an expert student counselor integrated into a teacher's dashboard.
            A teacher is asking a general question about student counseling.
            Your goal is to provide actionable, empathetic, and expert advice on student well-being and academic success.

            The teacher's question is: "${question}"

            Provide a helpful and constructive response.
            Format your response in clear, easy-to-read markdown. If you suggest steps, use a numbered or bulleted list.
            `;
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting counseling suggestion:", error);
        return "Sorry, I encountered an error while generating a suggestion. Please check the API key and try again.";
    }
};

export const generateStudentData = async (teacher: Teacher): Promise<Student[]> => {
    try {
        const prompt = `
            Generate a list of 15 fictional students for ${teacher.name}'s Class ${teacher.class} dashboard.
            Each student must have the following properties: id, name, attendance (0-100), avgScore (0-100), attempts (1-5), feesDue (0-90 days), riskLevel ('Low', 'Medium', 'High'), and counselStatus ('Pending', 'Done').
            Ensure a realistic distribution of data and risk levels. For example, lower attendance and scores should correlate with higher risk.
            The 'id' should be a unique 3-digit number starting from 101.
            The 'name' should be a common-sounding Indian name.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            name: { type: Type.STRING },
                            attendance: { type: Type.NUMBER },
                            avgScore: { type: Type.NUMBER },
                            attempts: { type: Type.NUMBER },
                            feesDue: { type: Type.NUMBER },
                            riskLevel: { type: Type.STRING },
                            counselStatus: { type: Type.STRING },
                        },
                        required: ['id', 'name', 'attendance', 'avgScore', 'attempts', 'feesDue', 'riskLevel', 'counselStatus'],
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const studentsData = JSON.parse(jsonString);
        // Add teacherId to each student
        const students = studentsData.map((s: Omit<Student, 'teacherId'>) => ({
            ...s,
            teacherId: teacher.id,
        }));
        return students;

    } catch (error) {
        console.error("Error generating student data:", error);
        return []; 
    }
};

export const getPrediction = async (attendance: number, avgScore: number, feesDue: number): Promise<{ chance: number, riskLevel: RiskLevel }> => {
    try {
        const prompt = `
            Act as an educational data scientist. Based on the following student metrics, predict the dropout probability.
            - Attendance: ${attendance}%
            - Average Score: ${avgScore}/100
            - Fees Due: ${feesDue} days overdue
            
            Provide a numerical 'chance' (0-100) of dropping out and a corresponding 'riskLevel' ('Low', 'Medium', 'High').
            - High risk: > 65% chance
            - Medium risk: 35-65% chance
            - Low risk: < 35% chance
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        chance: { type: Type.NUMBER },
                        riskLevel: { type: Type.STRING },
                    },
                    required: ['chance', 'riskLevel'],
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error getting prediction:", error);
        // Return a default high-risk prediction on error
        return { chance: 70, riskLevel: RiskLevel.High };
    }
};
