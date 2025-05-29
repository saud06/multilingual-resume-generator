// Frontend Configuration Example
// Copy this file to config.js and update the values

const config = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  
  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Multilingual Resume Generator',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Feature Flags
  ENABLE_ANALYTICS: true,
  ENABLE_TRANSLATION: true,
  ENABLE_COVER_LETTERS: true,
  
  // Demo Configuration
  DEMO_GENERATIONS_LIMIT: 2,
  
  // PDF Templates
  DEFAULT_TEMPLATE: 'classic', // classic, modern, creative
  
  // Languages
  DEFAULT_LANGUAGE: 'en', // en, de
  SUPPORTED_LANGUAGES: ['en', 'de'],
  
  // AI Configuration
  DEFAULT_TONE: 'balanced', // conservative, balanced, dynamic
  DEFAULT_STYLE: 'international', // german, international
};

export default config;
