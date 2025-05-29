# 🚀 Multilingual Resume Generator - Setup Guide

## 📋 Prerequisites

- **Node.js** 18+ 
- **PHP** 8.2+
- **Composer** 2.0+
- **MySQL** 8.0+ (or SQLite for development)

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configure Environment Variables
Edit `.env` file with your settings:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=resume_generator
DB_USERNAME=root
DB_PASSWORD=

# Hugging Face API Configuration (Optional - for AI features)
# Get your FREE token from: https://huggingface.co/settings/tokens
HUGGINGFACE_API_TOKEN=your_huggingface_token_here

# App Configuration
APP_NAME="Multilingual Resume Generator"
APP_URL=http://localhost:8000
```

### 4. AI Service Setup (Optional)

**For AI-powered resume generation:**

1. **Get FREE Hugging Face Token:**
   - Visit: https://huggingface.co/settings/tokens
   - Create a new token (read access is sufficient)
   - Add to your `.env` file: `HUGGINGFACE_API_TOKEN=your_token_here`

2. **Without AI Token:**
   - System automatically uses intelligent template generation
   - Still creates professional, personalized resumes
   - No AI features, but fully functional

### 5. Database Setup
```bash
php artisan migrate
```

### 5. Start Backend Server
```bash
php artisan serve
```
Backend will run on: http://localhost:8000

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="Multilingual Resume Generator"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Frontend Server
```bash
npm run dev
```
Frontend will run on: http://localhost:3000

## 🔑 API Keys Setup

### Hugging Face Token (FREE)
1. Go to https://huggingface.co/settings/tokens
2. Create a new token (read access is sufficient)
3. Add to backend `.env` file: `HUGGINGFACE_API_TOKEN=your_token`

**Note**: The app works without API tokens using fallback templates, but AI features require the token.

## 🌟 Features Overview

### ✅ Implemented Features
- **AI Resume Generation** (English & German)
- **Cover Letter Generation** 
- **3 PDF Templates** (Classic, Modern, Creative)
- **Job Posting Parser** with skill matching
- **Resume Analytics** with ATS scoring
- **AI Tone Customization** (Conservative, Balanced, Dynamic)
- **Translation Service** (EN ↔ DE)
- **Authentication System** with JWT
- **Demo Mode** (2 free generations)
- **Cultural Adaptation** (German vs International styles)

### 🎯 Free Models Used
- **English**: GPT-2 (text generation)
- **German**: benjamin/gerpt2-large
- **Translation**: Helsinki-NLP/opus-mt-en-de, facebook/m2m100_418M
- **Fallback**: Template-based generation

## 🚀 Production Deployment

### Backend (Laravel)
- Deploy to **Render** (free tier)
- Set environment variables in dashboard
- Configure database connection
- Run migrations: `php artisan migrate --force`

### Frontend (Next.js)
- Deploy to **Vercel** or **Netlify** (free tier)
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Build command: `npm run build`

## 📱 Usage Flow

1. **Landing Page** - Demo capabilities available
2. **Resume Builder** - Fill in personal info, experience, education, skills
3. **AI Generation** - Choose style, tone, and template
4. **Results** - View generated resume with analytics
5. **Export** - Download as PDF in chosen template
6. **Cover Letters** - Generate tailored cover letters
7. **Job Analysis** - Parse job postings for skill matching
8. **Authentication** - Sign up to save unlimited resumes

## 🛠️ Development

### Backend Structure
```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php      # JWT Authentication
│   │   └── ResumeController.php    # Resume & Cover Letter APIs
│   ├── Services/
│   │   ├── LLMService.php          # AI Text Generation
│   │   └── TranslationService.php  # Language Translation
│   └── Models/
│       ├── User.php                # User Model with Sanctum
│       └── Resume.php              # Resume Storage
└── resources/views/pdf/            # PDF Templates
    ├── resume.blade.php            # Classic Template
    ├── resume-modern.blade.php     # Modern Template
    └── resume-creative.blade.php   # Creative Template
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ResumeForm.tsx          # Main Resume Builder
│   │   ├── CoverLetterGenerator.tsx # Cover Letter Tool
│   │   ├── ResumeAnalytics.tsx     # ATS Analytics
│   │   ├── JobPostingParser.tsx    # Job Analysis
│   │   └── AuthModal.tsx           # Authentication
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication State
│   ├── services/
│   │   ├── resumeAnalytics.ts      # Analytics Engine
│   │   ├── jobPostingParser.ts     # Job Parser Logic
│   │   └── resumeStorage.ts        # Local Storage
│   └── lib/
│       └── api.ts                  # API Client
```

## 🎨 Templates

### Classic Template
- Traditional professional layout
- Clean typography
- ATS-friendly structure

### Modern Template
- Contemporary sidebar design
- Visual skill bars
- Gradient elements

### Creative Template
- Colorful, dynamic design
- Animated elements
- Eye-catching layout

## 🌍 Internationalization

- **English**: Full support
- **German**: Complete localization
- **Cultural Adaptation**: 
  - German: Formal, photo-friendly, chronological
  - International: Skills-focused, ATS-optimized

## 🔒 Security

- **JWT Authentication** with Laravel Sanctum
- **Rate Limiting** on API endpoints
- **Input Validation** on all forms
- **CORS** configuration for cross-origin requests
- **Environment Variables** for sensitive data

## 📊 Analytics

- **ATS Compatibility Score** (0-100)
- **Keyword Density Analysis**
- **Readability Scoring** (Flesch Reading Ease)
- **Section Completeness Check**
- **Improvement Recommendations**

## 🆘 Troubleshooting

### Common Issues

1. **"Model Loading" Error**
   - Hugging Face models need warm-up time
   - Wait 30-60 seconds and retry
   - Check API token validity

2. **PDF Generation Fails**
   - Ensure DomPDF is installed: `composer require barryvdh/laravel-dompdf`
   - Check file permissions in storage directory

3. **Database Connection Error**
   - Verify database credentials in `.env`
   - Run `php artisan migrate` to create tables

4. **CORS Issues**
   - Check `config/cors.php` settings
   - Ensure frontend URL is in allowed origins

## 📞 Support

This is a portfolio project demonstrating:
- **Full-stack development** (Laravel + Next.js)
- **AI integration** with free models
- **Multilingual support** 
- **Modern UI/UX** design
- **Production-ready** architecture

**Cost**: 100% FREE - No paid APIs required!
