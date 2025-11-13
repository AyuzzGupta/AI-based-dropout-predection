
import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

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
