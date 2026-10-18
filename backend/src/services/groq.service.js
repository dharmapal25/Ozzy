import { groq } from "../config/groq.config.js";


const GroqResponse = async (prompt) => {

    const response = await groq.chat.completions.create({

        model: 'openai/gpt-oss-120b',

        messages: [
            {
                role: 'system',
                content: 'Answer the user clearly and accurately using the supplied context.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content;
}


export default GroqResponse