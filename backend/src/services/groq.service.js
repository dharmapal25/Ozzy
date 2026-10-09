import { groq } from "../config/groq.config.js";


const GroqResponse = async (prompt) => {

    const response = await groq.chat.completions.create({

        model: 'openai/gpt-oss-120b',

        messages: [
            {
                role: 'user',
                content: prompt,
            },
            {
                role: 'system',
                content: 'string',
            },
        ],
    },)


    console.log(response.choices[0].message.content)

}


export default GroqResponse