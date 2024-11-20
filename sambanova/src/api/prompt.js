const prompt = `Given a block of text, extract and output the following information strictly in JSON format:

1. **Extract Events and Dates**: Identify events and their dates. Format dates as 'YYYY-MM-DD'. Group events by date as follows:

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
- Ensure all curly braces, commas, and other JSON syntax are correctly formatted with no extra commas at the end of arrays or objects.`

export default prompt;
