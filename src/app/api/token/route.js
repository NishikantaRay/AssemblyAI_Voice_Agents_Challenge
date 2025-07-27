import axios from 'axios';
import 'dotenv/config';

export async function GET() {
  const expiresInSeconds = 60;
  const url = `${process.env.ASSEMBLYAI_TOKEN_URL}?expires_in_seconds=${expiresInSeconds}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: process.env.ASSEMBLYAI_API_KEY || 'your_assemblyai_api_key_here',
      },
    });

    return new Response(JSON.stringify({ token: response.data.token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating temp token:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch token" }), { status: 500 });
  }
}
