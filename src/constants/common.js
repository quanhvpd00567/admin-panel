export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  // OPENAI: 'openai',
}
// list of AI models for each provider
export const AI_MODELS = {
  [AI_PROVIDERS.GEMINI]: [
    { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
    { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  ],
  [AI_PROVIDERS.OPENAI]: [
    { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
    { label: 'GPT-4', value: 'gpt-4' },
    { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
  ],
};