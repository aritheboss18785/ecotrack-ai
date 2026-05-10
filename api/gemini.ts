type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  send: (body: string) => void;
  end: () => void;
};

declare const process: {
  env: {
    GEMINI_API_KEY?: string;
  };
};

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(500).json({ error: 'GEMINI_API_KEY is not set' });
    return;
  }

  try {
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body ?? {}),
    });

    const body = await geminiResponse.text();
    response.setHeader(
      'Content-Type',
      geminiResponse.headers.get('Content-Type') ?? 'application/json'
    );
    response.status(geminiResponse.status).send(body);
  } catch {
    response.status(502).json({ error: 'Failed to reach Gemini API' });
  }
}
