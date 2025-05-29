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
            line-height: 1.4;
            color: #000000;
            background: white;
            font-size: 11px;
            padding: 30px;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
        }
        
        /* Header Section - exactly like reference */
        .header {
            margin-bottom: 25px;
        }
        
        .name {
            font-size: 24px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 2px;
            text-align: left;
        }
        
        .contact-info {
            font-size: 11px;
            color: #000000;
            margin-bottom: 0;
            text-align: left;
        }
        
        .contact-line {
            margin: 0;
            line-height: 1.2;
        }
        
        /* Section Styles - matching reference exactly */
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 2px;
        }
        
        .summary-text {
            font-size: 11px;
            line-height: 1.4;
            color: #000000;
            margin-bottom: 0;
            text-align: justify;
        }
        
        /* Experience Items - exactly like reference */
        .experience-item {
            margin-bottom: 15px;
        }
        
        .experience-item:last-child {
            margin-bottom: 0;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3px;
        }
        
        .item-left {
            flex: 1;
        }
        
        .item-title {
            font-size: 12px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 1px;
        }
        
        .item-company {
            font-size: 11px;
            color: #000000;
            font-weight: 400;
            margin-bottom: 1px;
        }
        
        .item-location {
            font-size: 11px;
            color: #000000;
            font-weight: 400;
        }
        
        .item-duration {
            font-size: 11px;
            color: #000000;
            font-weight: 400;
            white-space: nowrap;
            text-align: right;
        }
        
        .item-description {
            color: #000000;
            line-height: 1.3;
            font-size: 10px;
            margin-top: 3px;
            margin-left: 0;
        }
        
        .item-description ul {
            margin: 0;
            padding-left: 15px;
        }
        
        .item-description li {
            margin-bottom: 2px;
            line-height: 1.3;
        }
        
        /* Education Items */
        .education-item {
            margin-bottom: 12px;
        }
        
        .education-item:last-child {
            margin-bottom: 0;
        }
        
        /* Other Section */
        .other-section {
            margin-bottom: 15px;
        }
        
        .other-item {
            margin-bottom: 8px;
            font-size: 10px;
            line-height: 1.3;
        }
        
        .other-label {
            font-weight: 700;
            display: inline;
        }
        
        .other-content {
            font-weight: 400;
            display: inline;
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
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section - exactly like reference -->
        <div class="header">
            <div class="name">{{ $personalInfo['firstName'] }} {{ $personalInfo['lastName'] }}</div>
            <div class="contact-info">
                <div class="contact-line">{{ $personalInfo['email'] }} | {{ $personalInfo['phone'] }} | {{ $personalInfo['location'] }}</div>
            </div>
        </div>

        <!-- Professional Summary Section -->
        @if(!empty($content))
        <div class="section">
            <div class="section-title">PROFESSIONAL SUMMARY</div>
            <div class="summary-text">
                {!! nl2br(e($content)) !!}
            </div>
        </div>
        @endif

        <!-- Experience Section -->
        <div class="section">
            <div class="section-title">EXPERIENCE</div>
            @if(isset($experiences) && is_array($experiences) && count($experiences) > 0)
                @foreach($experiences as $experience)
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-left">
                            <div class="item-title">{{ $experience['company'] ?? 'Company' }}</div>
                            <div class="item-company">{{ $experience['position'] ?? 'Position' }}</div>
                        </div>
                        <div class="item-duration">
                            {{ $experience['startDate'] ?? 'Start' }} – {{ ($experience['current'] ?? false) ? 'Present' : ($experience['endDate'] ?? 'End') }}<br>
                            {{ $experience['location'] ?? '' }}
                        </div>
                    </div>
                    @if(!empty($experience['description']))
                    <div class="item-description">
                        <ul>
                            @php
                                $descriptions = explode("\n", $experience['description']);
                            @endphp
                            @foreach($descriptions as $desc)
                                @if(trim($desc))
                                    <li>{{ trim($desc) }}</li>
                                @endif
                            @endforeach
                        </ul>
                    </div>
                    @endif
                </div>
                @endforeach
            @else
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-left">
                            <div class="item-title">Resume Worded & Co.</div>
                            <div class="item-company">Financial Data Analyst, Business Development & Operations</div>
                        </div>
                        <div class="item-duration">
                            Oct 2017 – Present<br>
                            San Francisco, CA
                        </div>
                    </div>
                    <div class="item-description">
                        <ul>
                            <li>Managed cross-functional team of 10 in 3 locations (Palo Alto, Austin and New York), ranging from entry-level analysts to vice presidents, and collaborated with business development, data analysis, operations and marketing</li>
                            <li>Launched Miami office and recruited and managed new team of 10 employees; grew Miami office revenue by 200% in first nine months (representing 20% of company revenue)</li>
                            <li>Designed training and peer-mentoring programs for the incoming class of 25 analysts in 2017; reduced onboarding time for new hires by 50%</li>
                            <li>Achieved $200K reduction in department overspend by establishing ROI metrics and budget controls to improve prioritisation of the $4MM department budget</li>
                        </ul>
                    </div>
                </div>
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-left">
                            <div class="item-title">Instamake</div>
                            <div class="item-company">Associate Product Manager</div>
                        </div>
                        <div class="item-duration">
                            Jun 2015 – Oct 2017<br>
                            San Francisco, CA
                        </div>
                    </div>
                    <div class="item-description">
                        <ul>
                            <li>Spearheaded a major pricing restructure by redirecting focus on consumer willingness to pay instead of product cost; implemented a three-tiered pricing model which increased average sale 35% and margin 12%</li>
                            <li>Promoted within 12 months due to strong performance and organizational impact (1 year ahead of schedule)</li>
                            <li>Identified steps to reduce return rates by 10% resulting in an eventual $75k cost savings</li>
                        </ul>
                    </div>
                </div>
            @endif
        </div>

        <!-- Education Section -->
        <div class="section">
            <div class="section-title">EDUCATION</div>
            @if(isset($education) && is_array($education) && count($education) > 0)
                @foreach($education as $edu)
                <div class="education-item">
                    <div class="item-header">
                        <div class="item-left">
                            <div class="item-title">{{ $edu['institution'] ?? 'Institution' }}</div>
                            <div class="item-company">{{ $edu['degree'] ?? 'Degree' }}@if(!empty($edu['field'])); Major in {{ $edu['field'] }}@endif</div>
                        </div>
                        <div class="item-duration">
                            {{ $edu['endDate'] ?? 'Year' }}<br>
                            {{ $edu['location'] ?? '' }}
                        </div>
                    </div>
                </div>
                @endforeach
            @else
                <div class="education-item">
                    <div class="item-header">
                        <div class="item-left">
                            <div class="item-title">Resume Worded Business School</div>
                            <div class="item-company">Master of Business Administration Candidate; Major in Business Analytics</div>
                        </div>
                        <div class="item-duration">
                            May 2015<br>
                            Austin, TX
                        </div>
                    </div>
                </div>
                <div class="education-item">
                    <div class="item-header">
                        <div class="item-left">
                            <div class="item-title">Resume Worded University</div>
                            <div class="item-company">Master of Business Administration Candidate; Major in Business Analytics</div>
                        </div>
                        <div class="item-duration">
                            May 2011<br>
                            San Francisco, CA
                        </div>
                    </div>
                </div>
            @endif
        </div>

        <!-- Other Section (Skills, Languages, etc.) -->
        <div class="section">
            <div class="section-title">OTHER</div>
            
            @if(!empty($skills))
            <div class="other-item">
                <span class="other-label">Technical Skills:</span>
                <span class="other-content">{{ implode(', ', $skills) }}</span>
            </div>
            @endif
            
            @if(!empty($languages))
            <div class="other-item">
                <span class="other-label">Languages:</span>
                <span class="other-content">{{ implode(', ', $languages) }}</span>
            </div>
            @endif
            
            @if(!empty($projects))
            <div class="other-item">
                <span class="other-label">Projects:</span>
                <span class="other-content">{{ implode(', ', $projects) }}</span>
            </div>
            @endif
        </div>
    </div>
</body>
</html>
