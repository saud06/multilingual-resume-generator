<!DOCTYPE html>
<html lang="{{ $language }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $personalInfo['firstName'] }} {{ $personalInfo['lastName'] }} - Creative Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', 'Helvetica', Arial, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: white;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            min-height: 297mm;
            position: relative;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            color: white;
            padding: 50px 40px;
            position: relative;
            overflow: hidden;
            clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -30px;
            left: -30px;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            animation: float 4s ease-in-out infinite reverse;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .header-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-left {
            flex: 1;
        }
        
        .name {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -1px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .title {
            font-size: 20px;
            font-weight: 300;
            color: #f7fafc;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 25px;
            font-size: 13px;
            color: #e2e8f0;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.15);
            padding: 8px 12px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        
        .photo-placeholder {
            width: 150px;
            height: 180px;
            background: rgba(255, 255, 255, 0.2);
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            margin-left: 30px;
            backdrop-filter: blur(10px);
        }
        
        .main-content {
            padding: 60px 40px 40px;
            margin-top: -30px;
            position: relative;
            z-index: 1;
        }
        
        .content-grid {
            display: flex;
            gap: 40px;
        }
        
        .left-column {
            flex: 2;
        }
        
        .right-column {
            flex: 1;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px 25px;
            border-radius: 15px;
            height: fit-content;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            padding-bottom: 10px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
        }
        
        .right-column .section-title {
            font-size: 16px;
            color: #4a5568;
        }
        
        .right-column .section-title::after {
            width: 30px;
            height: 3px;
        }
        
        .summary-content {
            font-size: 13px;
            line-height: 1.8;
            color: #4a5568;
            text-align: justify;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            padding: 25px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .experience-item, .education-item {
            margin-bottom: 30px;
            position: relative;
            padding: 25px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-left: 4px solid #667eea;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .item-left {
            flex: 1;
        }
        
        .item-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 6px;
        }
        
        .item-company {
            font-size: 14px;
            color: #667eea;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .item-location {
            font-size: 11px;
            color: #718096;
            font-style: italic;
        }
        
        .item-duration {
            font-size: 12px;
            color: white;
            font-weight: 500;
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 8px 16px;
            border-radius: 20px;
            white-space: nowrap;
        }
        
        .item-description {
            color: #4a5568;
            line-height: 1.7;
            font-size: 12px;
            margin-top: 12px;
        }
        
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .skill-item {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 10px 18px;
            border-radius: 25px;
            font-size: 11px;
            font-weight: 500;
            box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .skill-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .skill-item:hover::before {
            left: 100%;
        }
        
        .languages-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .language-item {
            background: white;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            font-size: 12px;
            color: #2d3748;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .projects-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .project-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-top: 3px solid #667eea;
            font-size: 12px;
            color: #4a5568;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        /* German Style Modifications */
        .german-style .header {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #718096 100%);
        }
        
        .german-style .photo-placeholder {
            background: rgba(255, 255, 255, 0.25);
            border: 3px solid rgba(255, 255, 255, 0.4);
        }
        
        @page {
            margin: 0;
            size: A4;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .header::before, .header::after {
                animation: none;
            }
        }
            content: '';
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .name-section {
            flex: 1;
        }
        
        .name {
            font-size: 36px;
            font-weight: 900;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            letter-spacing: -1px;
        }
        
        .title {
            font-size: 18px;
            font-weight: 300;
            opacity: 0.95;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .contact-section {
            text-align: right;
            font-size: 14px;
            line-height: 1.8;
        }
        
        .contact-item {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        
        .contact-icon {
            margin-left: 8px;
            font-size: 16px;
        }
        
        .main-content {
            padding: 35px;
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
        }
        
        .left-column {
            
        }
        
        .right-column {
            
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #ff6b6b;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            padding-left: 25px;
        }
        
        .section-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 15px;
            height: 15px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            border-radius: 50%;
        }
        
        .summary-text {
            font-size: 15px;
            line-height: 1.7;
            color: #34495e;
            text-align: justify;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #ff6b6b;
            position: relative;
        }
        
        .experience-item, .education-item {
            margin-bottom: 25px;
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-left: 4px solid #feca57;
            position: relative;
        }
        
        .item-header {
            margin-bottom: 12px;
        }
        
        .item-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .item-company {
            font-size: 15px;
            color: #ff6b6b;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .item-date {
            font-size: 12px;
            color: #7f8c8d;
            background: #ecf0f1;
            padding: 5px 10px;
            border-radius: 15px;
            display: inline-block;
        }
        
        .item-description {
            font-size: 14px;
            color: #34495e;
            line-height: 1.6;
            margin-top: 10px;
        }
        
        .skills-container {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
        }
        
        .skill-item {
            margin-bottom: 15px;
        }
        
        .skill-name {
            font-size: 14px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .skill-bar {
            height: 8px;
            background: #ecf0f1;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        
        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, #ff6b6b, #feca57);
            border-radius: 4px;
            position: relative;
            animation: skillLoad 1.5s ease-in-out;
        }
        
        @keyframes skillLoad {
            from { width: 0; }
        }
        
        .languages-list, .projects-list {
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .language-item, .project-item {
            padding: 10px 15px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            display: inline-block;
            margin-right: 8px;
        }
        
        .ai-generated {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .ai-generated::before {
            content: '✨';
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 24px;
            opacity: 0.7;
        }
        
        .ai-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        
        .ai-content {
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-line;
        }
        
        .decorative-element {
            position: absolute;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            border-radius: 50%;
            opacity: 0.05;
            right: -50px;
            bottom: -50px;
        }
        
        .quote-section {
            background: #f8f9fa;
            border-left: 5px solid #feca57;
            padding: 20px;
            margin: 20px 0;
            font-style: italic;
            position: relative;
        }
        
        .quote-section::before {
            content: '"';
            font-size: 60px;
            color: #feca57;
            position: absolute;
            top: -10px;
            left: 15px;
            font-family: serif;
        }
        
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
            .skill-progress { animation: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="name-section">
                    <div class="name">{{ $personalInfo['firstName'] }} {{ $personalInfo['lastName'] }}</div>
                    @if(isset($personalInfo['title']) && $personalInfo['title'])
                        <div class="title">{{ $personalInfo['title'] }}</div>
                    @endif
                </div>
                <div class="contact-section">
                    <div class="contact-item">
                        {{ $personalInfo['email'] }}
                        <span class="contact-icon">📧</span>
                    </div>
                    @if(isset($personalInfo['phone']) && $personalInfo['phone'])
                        <div class="contact-item">
                            {{ $personalInfo['phone'] }}
                            <span class="contact-icon">📱</span>
                        </div>
                    @endif
                    @if(isset($personalInfo['location']) && $personalInfo['location'])
                        <div class="contact-item">
                            {{ $personalInfo['location'] }}
                            <span class="contact-icon">📍</span>
                        </div>
                    @endif
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <div class="left-column">
                @if(isset($personalInfo['summary']) && $personalInfo['summary'])
                    <div class="section">
                        <div class="section-title">{{ $language === 'de' ? 'Über Mich' : 'About Me' }}</div>
                        <div class="summary-text">{{ $personalInfo['summary'] }}</div>
                    </div>
                @endif
                
                @if(isset($content) && $content)
                    <div class="ai-generated">
                        <div class="ai-badge">{{ $language === 'de' ? 'KI-Generiert' : 'AI Generated' }}</div>
                        <div class="ai-content">{{ $content }}</div>
                    </div>
                @endif
                
                @if(isset($experiences) && count($experiences) > 0)
                    <div class="section">
                        <div class="section-title">{{ $language === 'de' ? 'Berufserfahrung' : 'Experience' }}</div>
                        @foreach($experiences as $experience)
                            <div class="experience-item">
                                <div class="item-header">
                                    <div class="item-title">{{ $experience['position'] }}</div>
                                    <div class="item-company">{{ $experience['company'] }}</div>
                                    <div class="item-date">
                                        {{ $experience['startDate'] }} - {{ $experience['current'] ? ($language === 'de' ? 'Heute' : 'Present') : $experience['endDate'] }}
                                    </div>
                                </div>
                                @if(isset($experience['description']) && $experience['description'])
                                    <div class="item-description">{{ $experience['description'] }}</div>
                                @endif
                            </div>
                        @endforeach
                    </div>
                @endif
                
                @if(isset($education) && count($education) > 0)
                    <div class="section">
                        <div class="section-title">{{ $language === 'de' ? 'Bildung' : 'Education' }}</div>
                        @foreach($education as $edu)
                            <div class="education-item">
                                <div class="item-header">
                                    <div class="item-title">{{ $edu['degree'] }}</div>
                                    <div class="item-company">{{ $edu['institution'] }}</div>
                                    <div class="item-date">
                                        {{ $edu['startDate'] }} - {{ $edu['endDate'] }}
                                    </div>
                                </div>
                                @if(isset($edu['field']) && $edu['field'])
                                    <div class="item-description">{{ $language === 'de' ? 'Fachrichtung' : 'Field of Study' }}: {{ $edu['field'] }}</div>
                                @endif
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
            
            <div class="right-column">
                @if(isset($skills) && count($skills) > 0)
                    <div class="section">
                        <div class="section-title">{{ $language === 'de' ? 'Fähigkeiten' : 'Skills' }}</div>
                        <div class="skills-container">
                            @foreach($skills as $skill)
                                <div class="skill-item">
                                    <div class="skill-name">{{ $skill }}</div>
                                    <div class="skill-bar">
                                        <div class="skill-progress" style="width: {{ rand(70, 95) }}%"></div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
                
                @if(isset($languages) && count($languages) > 0)
                    <div class="section">
                        <div class="section-title">{{ $language === 'de' ? 'Sprachen' : 'Languages' }}</div>
                        <div class="languages-list">
                            @foreach($languages as $lang)
                                <div class="language-item">{{ $lang }}</div>
                            @endforeach
                        </div>
                    </div>
                @endif
                
                @if(isset($projects) && count($projects) > 0)
                    <div class="section">
                        <div class="section-title">{{ $language === 'de' ? 'Projekte' : 'Projects' }}</div>
                        <div class="projects-list">
                            @foreach($projects as $project)
                                <div class="project-item">{{ $project }}</div>
                            @endforeach
                        </div>
                    </div>
                @endif
                
                <div class="quote-section">
                    <p>{{ $language === 'de' ? 'Innovation unterscheidet zwischen einem Anführer und einem Nachfolger.' : 'Innovation distinguishes between a leader and a follower.' }}</p>
                </div>
            </div>
        </div>
        
        <div class="decorative-element"></div>
    </div>
</body>
</html>
