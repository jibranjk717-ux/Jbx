# Apex.bot.ai.com

## OpenRouter AI

The browser calls `/api/chat`, and the serverless endpoint forwards requests to OpenRouter without exposing the API key.

1. Import this repository into Vercel.
2. Add `OPENROUTER_API_KEY` in Vercel Project Settings > Environment Variables.
3. Optionally add `OPENROUTER_MODEL` (default: `openai/gpt-4o-mini`).
4. Redeploy.

The GitHub Pages site remains available with its local fallback. To use the real model, open the Vercel deployment URL, where `/api/chat` and the frontend share the same origin.