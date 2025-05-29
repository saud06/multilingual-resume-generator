# 🌍 Multilingual Resume Generator

AI-powered resume and cover letter generator with German/English support and cultural adaptation.

## ✨ Features

- **AI Resume Generation** in English & German using free Hugging Face models
- **Cover Letter Generator** tailored to job descriptions  
- **3 Professional PDF Templates** (Classic, Modern, Creative)
- **Cultural Adaptation** (German Lebenslauf vs International styles)
- **Real-time Language Toggle** with automatic cultural adjustments
- **Resume Analytics** with ATS scoring and optimization suggestions
- **Job Posting Parser** with skill matching
- **Demo Mode** (2 free generations without signup)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer

### Setup
```bash
# Clone repository
git clone https://github.com/saud06/multilingual-resume-generator.git
cd multilingual-resume-generator

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend setup (new terminal)
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev
```

### Get Hugging Face Token
1. Visit [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Create a new token (read access)
3. Add to `backend/.env`: `HUGGINGFACE_API_TOKEN=your_token`

🎉 **Ready!** Visit http://localhost:3000

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Laravel 11, JWT Authentication
- **Database**: MySQL
- **AI**: Hugging Face (GPT-2, benjamin/gerpt2-large)
- **PDF**: Laravel DomPDF

## 🤖 AI Models (100% Free)

| Purpose | Model |
|---------|-------|
| English Generation | GPT-2 |
| German Generation | benjamin/gerpt2-large |
| Translation | Helsinki-NLP/opus-mt-* |

## 📄 License

MIT License
