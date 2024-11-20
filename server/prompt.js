const prompt = `Given a block of text, output results in JSON format:

Extract Events and Dates: Identify events and their dates. Format dates as 'YYYY-MM-DD'. Group events by date as follows:
{
    "date": {
        "event": [
            {
                "description": "Event description",
                "details": "Additional details (if any)"
            }
        ]
    }
}
If multiple events share a date, group them together. If no date is specified, leave the date field blank.

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
    "2023": {
        "event": [
            {
                "description": "Major scientific discovery announced",
                "details": "Details revealed in June."
            }
        ]
    }
}
Time-Blocking Suggestions: Analyze the text for tasks. For each task, suggest how to split work into manageable time blocks, including a reasonable duration and ideal start date. Use the following structure:
{
    "task": {
        "description": "Task description",
        "suggestions": [
            {
                "time_block": "Duration",
                "start_time": "YYYY-MM-DDTHH:MM:SS",
                "end_time": "YYYY-MM-DDTHH:MM:SS",
                "details": "Focus on specific sections."
            }
        ]
    }
}
Output: Provide the final output strictly in JSON format, including both extracted events and time-blocking suggestions. No other format or explanation is allowed outside the JSON.`;

export default prompt;