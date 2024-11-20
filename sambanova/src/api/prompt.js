const prompt = {
    prompt1: `Given a block of text, extract and output the following information strictly in JSON format:

    **Extract Events and Dates**: Identify events and their dates. Format dates as 'YYYY-MM-DD'. Group events by date as follows:

    {
        "YYYY-MM-DD": {
            "event": [
                {
                    "description": "Event description",
                    "details": "Additional details (if any)"
                }
            ]
        }
    }

    - If multiple events share a date, group them together in the same array under the 'event' key.
    - If no specific date is mentioned, leave the date key blank and do not include it in the final output.
    - Each event should have a 'description' and a 'details' field (if any).
    - Remove all trailing commas after properties or array elements.
    - Ensure all curly braces, commas, and other JSON syntax are correctly formatted with no extra commas at the end of arrays or objects.`,
   
    prompt2: `Given a block of text, extract and output the following information strictly in JSON format:
    
    **Time-Blocking Suggestions**: Analyze the text for tasks. For each task, suggest how to split work into manageable time blocks. Provide a reasonable duration and ideal start time for each block using the following structure:

    {
        "task": {
            "description": "Task description",
            "suggestions": [
                {
                    "time_block": "Duration (e.g., '4 hours')",
                    "start_time": "YYYY-MM-DDTHH:MM:SS",
                    "end_time": "YYYY-MM-DDTHH:MM:SS",
                    "details": "Focus on specific sections."
                }
            ]
        }
    }

    - Ensure that each task has a 'description' and at least one 'suggestion'.
    - The 'time_block' should specify the duration (e.g., '4 hours', '8 hours').
    - The 'start_time' and 'end_time' should be in the format 'YYYY-MM-DDTHH:MM:SS'.
    - Ensure proper commas and braces—especially avoid extra commas after the last suggestion or event.

    **Final Output**: Provide the results strictly in JSON format without any additional explanation or text. Do not include any extra commas at the end of lists or objects.

    Example Structure:
    {
        "2024-01-01": {
            "event": [
                {
                    "description": "New Year's celebration",
                    "details": "Celebrations included fireworks."
                }
            ]
        },
        "2024-01-02": {
            "event": [
                {
                    "description": "Meeting with the project team",
                    "details": "Discussed future milestones."
                }
            ]
        },
        "task": {
            "description": "Complete homework assignments",
            "suggestions": [
                {
                    "time_block": "4 hours",
                    "start_time": "2024-01-02T08:00:00",
                    "end_time": "2024-01-02T12:00:00",
                    "details": "Focus on assignment 1."
                },
                {
                    "time_block": "3 hours",
                    "start_time": "2024-01-02T14:00:00",
                    "end_time": "2024-01-02T17:00:00",
                    "details": "Focus on assignment 2."
                }
            ]
        }
    }


    - Ensure that each task has a 'description' and at least one 'suggestion'.
    - The 'time_block' should specify the duration (e.g., '4 hours', '8 hours').
    - The 'start_time' and 'end_time' should be in the format 'YYYY-MM-DDTHH:MM:SS'.
    - Ensure proper commas and braces—especially avoid extra commas after the last suggestion or event.

    **Final Output**: Provide the results strictly in JSON format without any additional explanation or text. Do not include any extra commas at the end of lists or objects.`,

    prompt3: `Extract events and dates from the text, including any links attached to the event/date. Format dates as 'YYYY-MM-DD'. Group events by date. If multiple events share a date, group them together. If no date is specified, leave the date field blank.
   
    For each event, include a description, any additional details, and analyze the text for tasks and suggest how to split work into manageable time blocks, including a reasonable duration and ideal start date.


    Use the following structured format for the output:


    {
        "date": {
            "event": [
                {
                    "description": "Event description",
                    "details": "Additional details (if any)"
                }
            ],
            "suggestions": [
                {
                    "description": "Task description",
                    "time_block": "Duration",
                    "start_time": "YYYY-MM-DDTHH:MM:SS",
                    "end_time": "YYYY-MM-DDTHH:MM:SS",
                    "details": "Focus on specific sections."
                }
            ]
        }
    }


    Output: Provide the final output strictly in JSON format, including both extracted events and time-blocking suggestions.`
};


export default prompt;
