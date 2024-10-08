import OpenAI from "openai";
import * as dotenv from 'dotenv';

dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


export default async function getRecipe(req, res) {
    if( req.method == 'POST') {
        const ingredients = req.body;
    
    if (! ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Please select ingredients' });
    }

    try { const response = await openai.chat.completions({
        model: 'gpt-3.5-turbo',
        prompt: `I need a recipe for a meal with ${ingredients.join(', ')}.\n\nOutput:`,
        maxTokens: 500,
    })
    const recipe = response.data.choices[0].text.trim();
    res.status(200).json({ recipe });
}
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get recipe' });
    }
}else {
    res.status(200).json({error: 'Invalid request method. Use POST.' });
}
    };