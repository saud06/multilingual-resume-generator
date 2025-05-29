# 🌍 Multilingual Resume Generator

> **AI-Powered Resume & Cover Letter Generator** with German/English support, cultural adaptation, and ATS optimization.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Hugging Face](https://img.shields.io/badge/🤗-Hugging%20Face-yellow?style=flat-square)](https://huggingface.co/)

## ✨ Features

### 🎯 **Core Capabilities**
- **AI Resume Generation** in English & German using free Hugging Face models
- **Cover Letter Generator** tailored to job descriptions
- **3 Professional PDF Templates** (Classic, Modern, Creative)
- **Cultural Adaptation** (German Lebenslauf vs International styles)
- **Real-time Language Toggle** with automatic cultural adjustments

### 🔍 **Smart Analysis**
- **Job Posting Parser** with skill matching and compatibility scoring
- **Resume Analytics** with comprehensive ATS scoring (0-100)
- **Keyword Density Analysis** for ATS optimization
- **Readability Scoring** using Flesch Reading Ease algorithm

### 🎨 **Customization**
- **AI Tone Control** (Conservative, Balanced, Dynamic)
- **Multiple PDF Templates** with unique designs
- **Bilingual Interface** (English/German)
- **Responsive Design** for all devices

### 🔐 **User Experience**
- **Demo-First Approach** (2 free generations without signup)
- **JWT Authentication** with secure token management
- **Resume Management** (save, edit, duplicate, delete)
- **Local Storage** for demo users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer 2.0+

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/multilingual-resume-generator.git
cd multilingual-resume-generator
```

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 3. Frontend Setup
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev
```

### 4. Get Free Hugging Face Token
1. Visit [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Create a new token (read access)
3. Add to `backend/.env`: `HUGGINGFACE_API_TOKEN=your_token`

🎉 **Ready!** Visit http://localhost:3000

## 🏗️ Architecture

### **Frontend** (Next.js 14 + TypeScript)
```
src/
├── components/           # React components
│   ├── ResumeForm.tsx   # Main resume builder
│   ├── CoverLetterGenerator.tsx
│   ├── ResumeAnalytics.tsx
│   └── JobPostingParser.tsx
├── contexts/            # React contexts
├── services/            # Business logic
└── lib/                # Utilities & API client
```

### **Backend** (Laravel 11)
```
app/
├── Http/Controllers/Api/
│   ├── AuthController.php    # JWT Authentication
│   └── ResumeController.php  # Resume/Cover Letter APIs
├── Services/
│   ├── LLMService.php        # AI Text Generation
│   └── TranslationService.php # Language Translation
└── Models/                   # Eloquent models
```

## 🤖 AI Models (100% Free)

| Purpose | Model | Provider |
|---------|-------|----------|
| English Text Generation | GPT-2 | Hugging Face |
| German Text Generation | benjamin/gerpt2-large | Hugging Face |
| EN→DE Translation | Helsinki-NLP/opus-mt-en-de | Hugging Face |
| DE→EN Translation | Helsinki-NLP/opus-mt-de-en | Hugging Face |
| Multilingual Fallback | facebook/m2m100_418M | Hugging Face |

## 📊 Analytics Dashboard

### ATS Scoring Breakdown
- **Keywords** (30%): Industry-specific term density
- **Formatting** (20%): ATS-friendly structure
- **Structure** (25%): Essential sections completeness  
- **Length** (15%): Optimal word count (300-800)
- **Readability** (10%): Flesch Reading Ease score

### Smart Recommendations
- Missing sections identification
- Keyword optimization suggestions
- Formatting improvements
- Length optimization tips

## 🎨 PDF Templates

### Classic Template
- Traditional professional layout
- Clean typography
- Perfect for conservative industries

### Modern Template  
- Contemporary sidebar design
- Visual skill progression bars
- Gradient color schemes

### Creative Template
- Vibrant, dynamic design
- Animated visual elements
- Ideal for creative industries

## 🌍 Cultural Adaptation

### German Style (Lebenslauf)
- Photo placeholder
- Personal details section
- Formal, traditional tone
- Chronological work history
- Education emphasis

### International Style
- No photo (ATS-friendly)
- Skills-focused layout
- Dynamic, achievement-oriented tone
- Reverse chronological format
- ATS optimization

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
HUGGINGFACE_API_TOKEN=your_token_here
DB_CONNECTION=mysql
DB_DATABASE=resume_generator
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="Multilingual Resume Generator"
```

## 🚀 Deployment

### Backend (Render - Free Tier)
1. Connect GitHub repository
2. Set build command: `composer install --no-dev`
3. Set start command: `vendor/bin/heroku-php-apache2 public/`
4. Add environment variables in dashboard

### Frontend (Vercel - Free Tier)
1. Import from GitHub
2. Set `NEXT_PUBLIC_API_URL` to production backend URL
3. Deploy automatically on push

## 📱 Screenshots

### Resume Builder Interface
![Resume Builder](docs/screenshots/resume-builder.png)

### Analytics Dashboard  
![Analytics](docs/screenshots/analytics-dashboard.png)

### PDF Templates
![Templates](docs/screenshots/pdf-templates.png)

## 🛣️ Roadmap

- [ ] **Additional Languages** (French, Spanish, Italian)
- [ ] **More PDF Templates** (Academic, Executive, Creative+)
- [ ] **LinkedIn Integration** (import profile data)
- [ ] **ATS Scanner Upload** (test against real ATS systems)
- [ ] **Team Collaboration** (HR dashboard)
- [ ] **API Webhooks** (integrate with job boards)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for free AI models
- **shadcn/ui** for beautiful UI components  
- **Tailwind CSS** for utility-first styling
- **Laravel** for robust backend framework
- **Next.js** for powerful React framework

## 📞 Support

- 📧 **Email**: your.email@example.com
- 💼 **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- 🐙 **GitHub**: [Your GitHub](https://github.com/yourusername)

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ for the developer community

[🚀 Live Demo](https://your-demo-url.com) • [📖 Documentation](./SETUP.md) • [🐛 Report Bug](https://github.com/yourusername/multilingual-resume-generator/issues)

</div>
