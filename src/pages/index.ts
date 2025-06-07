import { APIRoute } from "astro"
import Grop from "groq-sdk"

// const groq = new Grop({ apiKey: process.env.groq_api_key})
const groq = new Grop({ apiKey: import.meta.env.groq_api_key})

export const POST: APIRoute = async ({request}) => {
  try {
    const body = await request.json();

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return new Response(
      JSON.stringify({
        message: completion.choices[0].message.content,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error); 
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',

    }
  })
}