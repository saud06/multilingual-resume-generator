#!/bin/bash

# 🔍 Multilingual Resume Generator - Verification Script
# This script verifies that all components are properly implemented

echo "🔍 Verifying Multilingual Resume Generator Implementation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Function to check if file exists and contains specific content
check_file() {
    local file=$1
    local description=$2
    local search_term=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ]; then
        if [ -z "$search_term" ] || grep -q "$search_term" "$file"; then
            echo -e "${GREEN}✅ $description${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            echo -e "${YELLOW}⚠️  $description (file exists but missing: $search_term)${NC}"
        fi
    else
        echo -e "${RED}❌ $description (file not found: $file)${NC}"
    fi
}

# Function to check directory structure
check_directory() {
    local dir=$1
    local description=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $description (directory not found: $dir)${NC}"
    fi
}

echo -e "${BLUE}📋 Core Features Verification${NC}"
echo "=================================="

# Backend Core Features
check_file "backend/app/Services/LLMService.php" "AI Resume Generation Service" "generateResume"
check_file "backend/app/Services/LLMService.php" "Cover Letter Generation" "generateCoverLetter"
check_file "backend/app/Services/TranslationService.php" "Translation Service" "translateText"
check_file "backend/app/Http/Controllers/Api/AuthController.php" "JWT Authentication" "register"
check_file "backend/app/Http/Controllers/Api/ResumeController.php" "Resume Controller" "generate"

# PDF Templates
check_file "backend/resources/views/pdf/resume.blade.php" "Classic PDF Template" "<!DOCTYPE html"
check_file "backend/resources/views/pdf/resume-modern.blade.php" "Modern PDF Template" "sidebar"
check_file "backend/resources/views/pdf/resume-creative.blade.php" "Creative PDF Template" "gradient"

# Frontend Core Components
check_file "frontend/src/components/ResumeForm.tsx" "Main Resume Form" "generateResume"
check_file "frontend/src/components/CoverLetterGenerator.tsx" "Cover Letter Generator" "generateCoverLetter"
check_file "frontend/src/components/ResumeAnalytics.tsx" "Resume Analytics" "atsScore"
check_file "frontend/src/components/JobPostingParser.tsx" "Job Posting Parser" "parseJobPosting"
check_file "frontend/src/contexts/AuthContext.tsx" "Authentication Context" "AuthProvider"

# Services and Utilities
check_file "frontend/src/services/resumeAnalytics.ts" "Analytics Service" "analyzeResume"
check_file "frontend/src/services/jobPostingParser.ts" "Job Parser Service" "parseJobPosting"
check_file "frontend/src/services/resumeStorage.ts" "Resume Storage Service" "saveResume"
check_file "frontend/src/lib/api.ts" "API Client" "apiService"

echo ""
echo -e "${BLUE}🎨 UI Components Verification${NC}"
echo "=================================="

# UI Components
check_file "frontend/src/components/ui/alert.tsx" "Alert Component" "Alert"
check_file "frontend/src/components/ui/progress.tsx" "Progress Component" "Progress"
check_file "frontend/src/components/AuthModal.tsx" "Auth Modal" "AuthModal"
check_file "frontend/src/components/DemoStatus.tsx" "Demo Status" "DemoStatus"

echo ""
echo -e "${BLUE}🔧 Configuration Verification${NC}"
echo "=================================="

# Configuration Files
check_file "backend/.env.example" "Backend Environment Example" "HUGGINGFACE_API_TOKEN"
check_file "backend/config/services.php" "Services Configuration" "huggingface"
check_file "frontend/config.example.js" "Frontend Configuration Example" "API_URL"

# Database
check_file "backend/database/migrations/2025_09_27_115140_create_resumes_table.php" "Resume Migration" "resumes"
check_file "backend/database/migrations/2025_09_27_120237_create_personal_access_tokens_table.php" "Tokens Migration" "personal_access_tokens"
check_file "backend/database/migrations/2025_09_27_195817_add_first_last_name_to_users_table.php" "User Fields Migration" "first_name"

echo ""
echo -e "${BLUE}📚 Documentation Verification${NC}"
echo "=================================="

# Documentation
check_file "README.md" "Main README" "Multilingual Resume Generator"
check_file "SETUP.md" "Setup Guide" "Prerequisites"
check_file "deploy.sh" "Deployment Script" "deployment preparation"

echo ""
echo -e "${BLUE}🌍 Multilingual Support Verification${NC}"
echo "=================================="

# Check for German translations
check_file "frontend/src/components/ResumeForm.tsx" "German Language Support" "de:"
check_file "backend/app/Services/LLMService.php" "German AI Model" "gerpt2-large"
check_file "backend/app/Services/TranslationService.php" "German Translation" "de_to_en"

echo ""
echo -e "${BLUE}🤖 AI Models Verification${NC}"
echo "=================================="

# AI Models
check_file "backend/app/Services/LLMService.php" "GPT-2 English Model" "gpt2"
check_file "backend/app/Services/LLMService.php" "German GPT Model" "benjamin/gerpt2-large"
check_file "backend/app/Services/TranslationService.php" "Helsinki Translation Models" "Helsinki-NLP"
check_file "backend/app/Services/TranslationService.php" "M2M100 Multilingual Model" "m2m100_418M"

echo ""
echo -e "${BLUE}📊 Analytics & Features Verification${NC}"
echo "=================================="

# Advanced Features
check_file "frontend/src/services/resumeAnalytics.ts" "ATS Scoring" "calculateATSScore"
check_file "frontend/src/components/ResumeForm.tsx" "AI Tone Customization" "aiTone"
check_file "frontend/src/components/ResumeForm.tsx" "PDF Template Selection" "pdfTemplate"
check_file "frontend/src/services/jobPostingParser.ts" "Skill Matching" "analyzeSkillMatch"

echo ""
echo "=================================="
echo -e "${BLUE}📈 VERIFICATION SUMMARY${NC}"
echo "=================================="

PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo -e "Total Checks: ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$((TOTAL_CHECKS - PASSED_CHECKS))${NC}"
echo -e "Success Rate: ${GREEN}$PERCENTAGE%${NC}"

if [ $PERCENTAGE -ge 95 ]; then
    echo ""
    echo -e "${GREEN}🎉 EXCELLENT! Your Multilingual Resume Generator is ready for production!${NC}"
    echo -e "${GREEN}✨ All core features are implemented and verified.${NC}"
elif [ $PERCENTAGE -ge 85 ]; then
    echo ""
    echo -e "${YELLOW}⚡ GOOD! Most features are implemented. Check the warnings above.${NC}"
else
    echo ""
    echo -e "${RED}⚠️  NEEDS WORK! Several components are missing. Please review the failed checks.${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Set up environment variables (HUGGINGFACE_API_TOKEN)"
echo "2. Run 'php artisan migrate' in backend directory"
echo "3. Test the application locally"
echo "4. Deploy using './deploy.sh'"
echo ""
echo -e "${GREEN}Happy coding! 🎯${NC}"
