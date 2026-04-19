import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { productName } = await request.json();
        if (!productName) {
            return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
        }

        const prompt = `Given the product name "${productName}", generate a list of its key specifications (specs) in Uzbek. The response must be ONLY a valid JSON array of objects, with each object having exactly 'key' and 'value' fields in Uzbek. Do not include markdown formatting or backticks around the JSON. Example: [{"key": "Ekran", "value": "6.7 dyuym"}]`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch from Gemini API');
        }

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) {
            throw new Error('Empty response from AI');
        }

        let parsedText = textResponse.trim();
        if (parsedText.startsWith('```json')) {
            parsedText = parsedText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (parsedText.startsWith('```')) {
            parsedText = parsedText.replace(/```/g, '').trim();
        }

        const specs = JSON.parse(parsedText);
        return NextResponse.json({ specs });

    } catch (error: any) {
        console.error('Error generating specs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
