import NotionConnect from '../components/NotionConnect';
import apiClient from './apiClient';
import prompt from './prompt';



export const generateChatCompletion = async (messages, promptKey = 'prompt1') => {
    console.log("Messages to API:", messages);
    console.log("Prompt: ", prompt[promptKey])
    try {
        const chosenPrompt = prompt[promptKey];
        messages.push({ role: "system", content: chosenPrompt });

        const response = await apiClient.post("/chat/completions", {
            stream: false,
            model: "Meta-Llama-3.1-8B-Instruct",
            messages: messages
        });
        console.log("API Response:", response.data);

        return response.data;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
};
