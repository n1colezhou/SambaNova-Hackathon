import apiClient from './apiClient';
import prompt from './prompt';

export const generateChatCompletion = async (messages) => {
    console.log("Messages to API:", messages);
    try {
        messages.push( { role: "system", content: prompt } );
        const response = await apiClient.post("/chat/completions", {
            stream: false,
            model: "Meta-Llama-3.1-8B-Instruct",
            messages: messages
        });
        // console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}
