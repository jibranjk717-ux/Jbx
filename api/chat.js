const SYSTEM_PROMPT = `You are Apex.bot.ai.com, a helpful, intelligent assistant. Answer the user's actual question directly and sensibly. Be concise but useful, explain your reasoning when it helps, ask one clarifying question only when necessary, and never claim to have seen an image unless image input is provided. For medical, legal, and financial topics, give general information and recommend a qualified professional for decisions or emergencies.`;

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'OpenRouter is not configured yet.' });

  const { messages } = request.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: 'A message is required.' });
  }

  const safeMessages = messages.slice(-12).filter(message => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string').map(message => ({
    role: message.role,
    content: message.content.slice(0, 6000)
  }));

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.PUBLIC_SITE_URL || 'https://jibranjk717-ux.github.io/Jbx/',
        'X-Title': 'Apex.bot.ai.com'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages],
        temperature: 0.7,
        max_tokens: 700
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return response.status(upstream.status).json({ error: data.error?.message || 'OpenRouter request failed.' });
    return response.status(200).json({ reply: data.choices?.[0]?.message?.content || 'I could not generate a response.' });
  } catch (error) {
    return response.status(500).json({ error: 'The AI service could not be reached.' });
  }
}
