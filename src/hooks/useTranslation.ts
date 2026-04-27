import { useState, useCallback } from 'react';

// MyMemory is a free translation API — no API key required
// Limit: 5000 chars/day per IP (plenty for an election guide)
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'ur', name: 'اردو (Urdu)' },
];

const translationCache = new Map<string, string>();

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en' || !text.trim()) return text;

  const cacheKey = `${targetLang}:${text.slice(0, 50)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json() as { responseData?: { translatedText?: string } };
    const translated = data.responseData?.translatedText ?? text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text; // Fall back to English on error
  }
}

export function useTranslation() {
  const [translating, setTranslating] = useState(false);

  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') return text;
    setTranslating(true);
    const result = await translateText(text, targetLang);
    setTranslating(false);
    return result;
  }, []);

  return { translate, translating };
}
