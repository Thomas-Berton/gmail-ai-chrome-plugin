export const generateCompletion = async (fullContext: { senderName: string, originalEmail: string, newContent: string }): Promise<string> => {

    try {
        const result = await chrome.storage.local.get(['promptTemplate', 'openaiApiKey', 'selectedLanguage']);

        const { promptTemplate, openaiApiKey, selectedLanguage } = result;
console.log('promptTemplate, openaiApiKey, selectedLanguage', promptTemplate, openaiApiKey, selectedLanguage);
        const prompt1 = `
ACTION: Help me to write my email quickly and professionally on HTML format. I will give you an unformatted response and you task is to make it sound clean and professional using the information provided in the "USER INFORMATION" section.

STEPS:
Analyse the draft of my email.
Draft the email based on my input, ensuring all details align with the information provided in the "USER INFORMATION" section, including links, contact details, style, signature and tone.
Include the links in the  "USER INFORMATION" section in the corresponding placeholder in the signature.
Write the email on HTML format.

PERSONA: Act as a proficient email assistant who embodies a professional but approachable demeanor. Your responses should be clear, supportive, and aligned with the user's preferred style as outlined in the "USER INFORMATION" section.

CONSTRAINTS:
The email should reflect my preferred tone and style, as detailed in the "USER INFORMATION" section.
Keep subject lines concise and relevant to the email content.
Ensure all links and contact details are correctly formatted as provided.
Use simple, clear language to maintain readability and accessibility.
Speak ${selectedLanguage}
Return only the final result in your response in one single block without any addition text.


TEMPLATE:
Subject: [Clear and concise subject line as per "USER INFORMATION"]
Body:
Greeting (e.g., "Dear [Recipient's Name],")
Main content structured with concise paragraphs.
Use bullet points for clarity on key points or actions.
Bold important terms as per emphasis guidelines.
Footer: [Standardized footer including, the contact email and links as found in the "USER INFORMATION" section]

YOUR RESPONSE:
You will reply with a json object, the json will have two keys 'object' and 'body', in the body key you will put the html of the email and in the object you will add the object of the email as text.
Return only the json without any additional text or formatting
Do not add "\`\`\`json" in your response
Your response should start with {

USER INFORMATION :  ${promptTemplate}
`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt1
                    },
                    {
                        role: 'assistant',
                        content: "D'accord ! Veuillez copier et coller l'email auquel vous souhaitez répondre."
                    },
                    {
                        role: 'user',
                        content: fullContext.originalEmail !== "" ? `Email from ${fullContext.senderName} : ${fullContext.originalEmail}` : 'pas d\'email auquel répondre'
                    },
                    {
                        role: 'assistant',
                        content: 'Parfait ! Quels points souhaitez-vous inclure dans votre message ?'
                    },
                    {
                        role: 'user',
                        content: `Voici ce que tu vas lui dire : "${fullContext.newContent}"`
                    },
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return 'Error generating response';
    }
};