<!DOCTYPE html>
<html lang="{{ $language }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $personalInfo['firstName'] }} {{ $personalInfo['lastName'] }} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', 'Helvetica', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #2d3748;
            background: white;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
        }
        
        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%);
            color: white;
            padding: 30px 40px;
            margin-bottom: 0;
        }
        
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-left {
            flex: 1;
        }
        
        .name {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .title {
            font-size: 18px;
            font-weight: 300;
            color: #bee3f8;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 12px;
            color: #e2e8f0;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .contact-icon {
            width: 12px;
            height: 12px;
            opacity: 0.8;
        }
        
        /* Photo placeholder for German style */
        .photo-placeholder {
            width: 120px;
            height: 150px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px dashed rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            margin-left: 20px;
        }
        
        /* Main Content */
        .main-content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            padding-bottom: 8px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, #3182ce, #63b3ed);
        }
        
        .summary-content {
            font-size: 12px;
            line-height: 1.7;
            color: #4a5568;
            text-align: justify;
            margin-bottom: 0;
        }
        
        /* Experience Items */
        .experience-item, .education-item {
            margin-bottom: 25px;
            position: relative;
            padding-left: 25px;
        }
        
        .experience-item::before, .education-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 6px;
            width: 8px;
            height: 8px;
            background: #3182ce;
            border-radius: 50%;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .item-left {
            flex: 1;
        }
        
        .item-title {
            font-size: 14px;
            font-weight: 600;
            color: #1a365d;
            margin-bottom: 4px;
        }
        
        .item-company {
            font-size: 12px;
            color: #3182ce;
            font-weight: 500;
            margin-bottom: 2px;
        }
        
        .item-location {
            font-size: 10px;
            color: #718096;
            font-style: italic;
        }
        
        .item-duration {
            font-size: 11px;
            color: #718096;
            font-weight: 500;
            text-align: right;
            background: #f7fafc;
            padding: 4px 12px;
            border-radius: 12px;
            white-space: nowrap;
        }
        
        .item-description {
            color: #4a5568;
            line-height: 1.6;
            font-size: 11px;
            margin-top: 8px;
        }
        
        /* Skills Section */
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-item {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            color: #234e52;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            border: 1px solid #81e6d9;
        }
        
        /* Languages Section */
        .languages-list {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .language-item {
            background: #f7fafc;
            padding: 10px 16px;
            border-radius: 8px;
            border-left: 4px solid #3182ce;
            font-size: 11px;
            color: #2d3748;
        }
        
        /* Projects Section */
        .projects-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .project-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-top: 3px solid #3182ce;
            font-size: 11px;
            color: #4a5568;
        }
        
        /* German Style Modifications */
        .german-style .header {
            background: #f8f9fa;
            color: #2d3748;
            border-bottom: 3px solid #3182ce;
        }
        
        .german-style .header-content {
            align-items: flex-start;
        }
        
        .german-style .name {
            color: #1a365d;
        }
        
        .german-style .title {
            color: #4a5568;
        }
        
        .german-style .contact-info {
            color: #718096;
        }
        
        .german-style .photo-placeholder {
            background: white;
            border: 2px solid #e2e8f0;
            color: #a0aec0;
        }
        
        /* Two Column Layout for German Style */
        .german-style .main-content {
            display: flex;
            gap: 30px;
        }
        
        .german-style .left-column {
            flex: 2;
        }
        
        .german-style .right-column {
            flex: 1;
            background: #f8f9fa;
            padding: 30px 25px;
            margin: -40px -40px -40px 0;
        }
        
        .german-style .right-column .section-title {
            color: #2d3748;
            font-size: 14px;
        }
        
        .german-style .right-column .section-title::after {
            background: #3182ce;
            width: 30px;
            height: 2px;
        }
        
        @page {
            margin: 0;
            size: A4;
        }
        
        /* Print Optimizations */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container {{ $style }}-style">
        <!-- Header Section -->
        <div class="header">
            <div class="header-content">
                <div class="header-left">
                    <div class="name">{{ $personalInfo['firstName'] }} {{ $personalInfo['lastName'] }}</div>
                    <div class="title">{{ $personalInfo['title'] ?? 'Professional' }}</div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span>📧</span>
                            <span>{{ $personalInfo['email'] }}</span>
                        </div>
                        <div class="contact-item">
                            <span>📱</span>
                            <span>{{ $personalInfo['phone'] }}</span>
                        </div>
                        <div class="contact-item">
                            <span>📍</span>
                            <span>{{ $personalInfo['location'] }}</span>
                        </div>
                    </div>
                </div>
                @if($style === 'german')
                <div class="photo-placeholder">
                    @if($language === 'de')
                        Foto<br>Platzhalter
                    @else
                        Photo<br>Placeholder
                    @endif
                </div>
                @endif
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            @if($style === 'german')
                <!-- German Two-Column Layout -->
                <div class="left-column">
                    <!-- Professional Summary -->
                    <div class="section">
                        <div class="section-title">
                            @if($language === 'de')
                                Berufliche Zusammenfassung
                            @else
                                Professional Summary
                            @endif
                        </div>
                        <div class="summary-content">
                            {!! nl2br(e($content)) !!}
                        </div>
                    </div>

                    <!-- Experience Section -->
                    @if(!empty($experiences))
                    <div class="section">
                        <div class="section-title">
                            @if($language === 'de')
                                Berufserfahrung
                            @else
                                Professional Experience
                            @endif
                        </div>
                        @foreach($experiences as $experience)
                        <div class="experience-item">
                            <div class="item-header">
                                <div class="item-left">
                                    <div class="item-title">{{ $experience['position'] ?? 'Position' }}</div>
                                    <div class="item-company">{{ $experience['company'] ?? 'Company' }}</div>
                                    @if(!empty($experience['location']))
                                    <div class="item-location">{{ $experience['location'] }}</div>
                                    @endif
                                </div>
                                <div class="item-duration">
                                    {{ $experience['startDate'] ?? 'Start' }} - {{ $experience['current'] ? ($language === 'de' ? 'Heute' : 'Present') : ($experience['endDate'] ?? 'End') }}
                                </div>
                            </div>
                            @if(!empty($experience['description']))
                            <div class="item-description">{{ $experience['description'] }}</div>
                            @endif
                        </div>
                        @endforeach
                    </div>
                    @endif

                    <!-- Education Section -->
                    @if(!empty($education))
                    <div class="section">
                        <div class="section-title">
                            @if($language === 'de')
                                Ausbildung
                            @else
                                Education
                            @endif
                        </div>
                        @foreach($education as $edu)
                        <div class="education-item">
                            <div class="item-header">
                                <div class="item-left">
                                    <div class="item-title">{{ $edu['degree'] ?? 'Degree' }}</div>
                                    <div class="item-company">{{ $edu['institution'] ?? 'Institution' }}</div>
                                    @if(!empty($edu['field']))
                                    <div class="item-location">{{ $edu['field'] }}</div>
                                    @endif
                                </div>
                                <div class="item-duration">
                                    {{ $edu['startDate'] ?? 'Start' }} - {{ $edu['endDate'] ?? 'End' }}
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                    @endif
                </div>

                <div class="right-column">
                    <!-- Skills Section -->
                    @if(!empty($skills))
                    <div class="section">
                        <div class="section-title">
                            @if($language === 'de')
                                Fähigkeiten
                            @else
                                Skills
                            @endif
                        </div>
                        <div class="skills-grid">
                            @foreach($skills as $skill)
                            <div class="skill-item">{{ $skill }}</div>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- Languages Section -->
                    @if(!empty($languages))
                    <div class="section">
                        <div class="section-title">
                            @if($language === 'de')
                                Sprachen
                            @else
                                Languages
                            @endif
                        </div>
                        <div class="languages-list">
                            @foreach($languages as $lang)
                            <div class="language-item">{{ $lang }}</div>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- Projects Section -->
                    @if(!empty($projects))
                    <div class="section">
                        <div class="section-title">
                            @if($language === 'de')
                                Projekte
                            @else
                                Projects
                            @endif
                        </div>
                        <div class="projects-list">
                            @foreach($projects as $project)
                            <div class="project-item">{{ $project }}</div>
                            @endforeach
                        </div>
                    </div>
                    @endif
                </div>
            @else
                <!-- International Single-Column Layout -->
                <!-- Professional Summary -->
                <div class="section">
                    <div class="section-title">
                        @if($language === 'de')
                            Berufliche Zusammenfassung
                        @else
                            Professional Summary
                        @endif
                    </div>
                    <div class="summary-content">
                        {!! nl2br(e($content)) !!}
                    </div>
                </div>

                <!-- Experience Section -->
                @if(!empty($experiences))
                <div class="section">
                    <div class="section-title">
                        @if($language === 'de')
                            Berufserfahrung
                        @else
                            Professional Experience
                        @endif
                    </div>
                    @foreach($experiences as $experience)
                    <div class="experience-item">
                        <div class="item-header">
                            <div class="item-left">
                                <div class="item-title">{{ $experience['position'] ?? 'Position' }}</div>
                                <div class="item-company">{{ $experience['company'] ?? 'Company' }}</div>
                                @if(!empty($experience['location']))
                                <div class="item-location">{{ $experience['location'] }}</div>
                                @endif
                            </div>
                            <div class="item-duration">
                                {{ $experience['startDate'] ?? 'Start' }} - {{ $experience['current'] ? ($language === 'de' ? 'Heute' : 'Present') : ($experience['endDate'] ?? 'End') }}
                            </div>
                        </div>
                        @if(!empty($experience['description']))
                        <div class="item-description">{{ $experience['description'] }}</div>
                        @endif
                    </div>
                    @endforeach
                </div>
                @endif

                <!-- Education Section -->
                @if(!empty($education))
                <div class="section">
                    <div class="section-title">
                        @if($language === 'de')
                            Ausbildung
                        @else
                            Education
                        @endif
                    </div>
                    @foreach($education as $edu)
                    <div class="education-item">
                        <div class="item-header">
                            <div class="item-left">
                                <div class="item-title">{{ $edu['degree'] ?? 'Degree' }}</div>
                                <div class="item-company">{{ $edu['institution'] ?? 'Institution' }}</div>
                                @if(!empty($edu['field']))
                                <div class="item-location">{{ $edu['field'] }}</div>
                                @endif
                            </div>
                            <div class="item-duration">
                                {{ $edu['startDate'] ?? 'Start' }} - {{ $edu['endDate'] ?? 'End' }}
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                @endif

                <!-- Skills Section -->
                @if(!empty($skills))
                <div class="section">
                    <div class="section-title">
                        @if($language === 'de')
                            Fähigkeiten
                        @else
                            Skills
                        @endif
                    </div>
                    <div class="skills-grid">
                        @foreach($skills as $skill)
                        <div class="skill-item">{{ $skill }}</div>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Languages Section -->
                @if(!empty($languages))
                <div class="section">
                    <div class="section-title">
                        @if($language === 'de')
                            Sprachen
                        @else
                            Languages
                        @endif
                    </div>
                    <div class="languages-list">
                        @foreach($languages as $lang)
                        <div class="language-item">{{ $lang }}</div>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Projects Section -->
                @if(!empty($projects))
                <div class="section">
                    <div class="section-title">
                        @if($language === 'de')
                            Projekte
                        @else
                            Projects
                        @endif
                    </div>
                    <div class="projects-list">
                        @foreach($projects as $project)
                        <div class="project-item">{{ $project }}</div>
                        @endforeach
                    </div>
                </div>
                @endif
            @endif
        </div>
    </div>
</body>
</html>
