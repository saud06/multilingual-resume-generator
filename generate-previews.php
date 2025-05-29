<?php
/**
 * PDF Preview Generator Script
 * 
 * This script generates all the static PDF preview files for templates.
 * Run this script from your Laravel backend to create preview PDFs.
 * 
 * Usage: php generate-previews.php
 */

require_once 'vendor/autoload.php';

use App\Http\Controllers\Api\ResumeController;
use Illuminate\Http\Request;

// Sample data for German style
$germanSampleData = [
    'personal_info' => [
        'firstName' => 'Max',
        'lastName' => 'Mustermann',
        'email' => 'max.mustermann@email.com',
        'phone' => '+49 123 456789',
        'location' => 'Berlin, Deutschland',
        'title' => 'Software Entwickler',
        'summary' => 'Erfahrener Software-Entwickler mit 6+ Jahren Erfahrung in der Entwicklung von Web-Anwendungen und Backend-Systemen.'
    ],
    'experiences' => [
        [
            'id' => '1',
            'company' => 'TechFirma GmbH',
            'position' => 'Senior Entwickler',
            'startDate' => '2020',
            'endDate' => '2024',
            'current' => false,
            'description' => 'Entwicklung und Wartung von Enterprise-Web-Anwendungen mit React, Node.js und PostgreSQL.',
            'location' => 'Berlin'
        ]
    ],
    'education' => [
        [
            'id' => '1',
            'institution' => 'Technische Universität Berlin',
            'degree' => 'Bachelor of Science',
            'field' => 'Informatik',
            'startDate' => '2016',
            'endDate' => '2020',
            'gpa' => '1.8'
        ]
    ],
    'skills' => ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    'languages' => ['Deutsch (Muttersprache)', 'Englisch (Fließend)'],
    'projects' => ['E-Commerce Plattform', 'Task Management System'],
    'content' => 'Erfahrener Software-Entwickler mit nachgewiesener Erfolgsbilanz in der Entwicklung skalierbarer Web-Anwendungen. Spezialisiert auf moderne JavaScript-Technologien und Cloud-Infrastruktur.'
];

// Sample data for International style
$internationalSampleData = [
    'personal_info' => [
        'firstName' => 'John',
        'lastName' => 'Smith',
        'email' => 'john.smith@email.com',
        'phone' => '+1-555-0123',
        'location' => 'New York, NY',
        'title' => 'Software Engineer',
        'summary' => 'Experienced software engineer with 6+ years of expertise in developing scalable web applications and backend systems.'
    ],
    'experiences' => [
        [
            'id' => '1',
            'company' => 'TechCorp Inc',
            'position' => 'Senior Developer',
            'startDate' => '2020',
            'endDate' => '2024',
            'current' => false,
            'description' => 'Development and maintenance of enterprise web applications using React, Node.js, and PostgreSQL.',
            'location' => 'New York'
        ]
    ],
    'education' => [
        [
            'id' => '1',
            'institution' => 'University of Technology',
            'degree' => 'Bachelor of Science',
            'field' => 'Computer Science',
            'startDate' => '2016',
            'endDate' => '2020',
            'gpa' => '3.8'
        ]
    ],
    'skills' => ['JavaScript', 'React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    'languages' => ['English (Native)', 'Spanish (Conversational)'],
    'projects' => ['E-Commerce Platform', 'Real-time Chat Application'],
    'content' => 'Results-driven software engineer with proven track record of delivering high-quality, scalable web applications. Expertise in modern JavaScript technologies and cloud infrastructure with focus on performance optimization.'
];

// Templates to generate
$templates = ['classic', 'modern', 'creative'];
$styles = ['german', 'international'];
$languages = ['en', 'de'];

echo "🚀 Starting PDF Preview Generation...\n\n";

foreach ($templates as $template) {
    foreach ($styles as $style) {
        foreach ($languages as $language) {
            $filename = "{$template}-{$style}-{$language}.pdf";
            $outputPath = "frontend/public/previews/templates/{$filename}";
            
            // Choose sample data based on style
            $sampleData = $style === 'german' ? $germanSampleData : $internationalSampleData;
            
            // Add template and language info
            $sampleData['template'] = $template;
            $sampleData['style'] = $style;
            $sampleData['language'] = $language;
            
            echo "📄 Generating: {$filename}\n";
            
            try {
                // Create a mock request
                $request = new Request();
                $request->merge($sampleData);
                
                // Generate PDF using your existing controller
                $controller = new ResumeController();
                $response = $controller->exportPdf($request);
                
                // Save the PDF file
                file_put_contents($outputPath, $response->getContent());
                
                echo "✅ Generated: {$filename}\n";
                
            } catch (Exception $e) {
                echo "❌ Failed to generate {$filename}: " . $e->getMessage() . "\n";
            }
            
            echo "\n";
        }
    }
}

echo "🎉 PDF Preview Generation Complete!\n";
echo "📁 Files saved to: frontend/public/previews/templates/\n";
echo "\n";
echo "📋 Generated Files:\n";

// List all generated files
$previewDir = 'frontend/public/previews/templates/';
if (is_dir($previewDir)) {
    $files = scandir($previewDir);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'pdf') {
            echo "   • {$file}\n";
        }
    }
}

echo "\n🔗 Usage: Files will be served at /previews/templates/{filename}\n";
