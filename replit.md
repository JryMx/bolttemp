# PrepLounge - Study Abroad Platform

## Overview
PrepLounge is an AI-powered study abroad platform designed to assist students in their application journey to U.S. universities. It offers tools for university comparisons, detailed profile analysis, and personalized consulting recommendations, aiming to simplify the complex admissions process and provide a comprehensive resource for prospective students.

## User Preferences
- N/A (to be added as user specifies preferences)

## System Architecture

### UI/UX Decisions
- **Bilingual Support**: Comprehensive internationalization for Korean and English, with language preferences persisted. All 1,234 universities use official Korean translations from IPEDS data rather than AI-generated names.
- **Responsive Design**: Layouts are optimized for both desktop and mobile, with dynamic adjustments for content length (e.g., hero sections).
- **Streamlined User Experience**: The Student Profile page is simplified for efficient data input, and forms/content areas are centered with `max-width` for readability.
- **Compact Layouts**: Profile Calculator page optimized for reduced scrolling with tighter spacing (48px section padding, 24px container gap, 12px form fields), horizontal form-results layout, and flex-start alignment to prevent unnecessary vertical stretching.
- **Navigation**: Utilizes both scroll-based navigation for quick access to homepage sections and dedicated page navigation for deeper content.

### Technical Implementations
- **Frontend Stack**: React 18, TypeScript, Vite, Tailwind CSS, and Lucide React.
- **State Management**: React Context API (`LanguageProvider`, `AuthProvider`, `StudentProfileProvider`) for global state.
- **Routing**: React Router for client-side navigation.
- **Location Search**: Integration with OpenStreetMap's Nominatim API for geocoding and standardizing location inputs.
- **Internationalization**: Custom `LanguageContext` for managing and applying translations across the application.
- **Data Handling**: Integration of real university data from CSV sources, including institution types, GPA, tuition, and acceptance rates, stored in `universities.json`.
- **Infinite Scroll**: Implemented on the Universities page using IntersectionObserver API for seamless browsing, loading 12 universities at a time with smooth loading indicators and auto-reset on filter changes.

### Feature Specifications
- **AI-Powered Profile Analysis**: 
  - Available in TWO locations: Dedicated page (`/profile-calculator`) AND HomePage calculator section
  - Connects to PrepLounge AI API (`https://dev.preplounge.ai/`) for real admission predictions
  - Supports both SAT (Math + EBRW) and ACT scoring systems with toggle
  - Returns comprehensive university recommendations categorized as Safety/Target/Reach/Prestige
  - **HomePage**: Displays top 3 highest-quality schools per category with "More Detailed Analysis" button linking to full page
  - **Profile Calculator Page**: Displays top 12 highest-quality schools per category for comprehensive analysis
  - All schools sorted by quality score for optimal recommendations
  - Full bilingual support for all results (Korean/English)
  - Real-time analysis with loading states and error handling
  - Clickable school cards navigate to detailed university profiles
- **University Profile Pages**: 
  - Detailed profiles for 1,234 unique U.S. universities
  - Quick stats: Acceptance rate, tuition, SAT/ACT ranges, GPA
  - **Application Requirements section**: Displays accurate, school-specific requirements from IPEDS data (2023)
    - 11 requirement categories: GPA, rank, transcript, prep program, recommendations, competencies, work experience, essay, legacy status, test scores, English proficiency
    - Three status types: Required (red badge), Optional/Considered if submitted (yellow badge), Not Considered (gray badge)
    - Fully data-driven from Excel source, showing only applicable requirements per school
  - **Academic Information section**: Displays real data from IPEDS 2023
    - Graduation rates: Actual 4-year completion rates for each institution (e.g., 84% for University of Miami)
    - Degree types: Shows which programs the school offers (Bachelor's, Master's, Doctoral)
    - Available programs: Scrollable list of all actual programs offered by each university
      - 26,145 total program entries mapped across all 1,234 universities
      - Programs organized by 26 major categories from IPEDS data
      - Full Korean translations for all program categories
    - Custom scrollbar styling for improved UX
  - **Action Buttons**: Two interactive buttons for future functionality
    - "Check Admission Probability" (primary button) - Links to Profile Calculator
    - "Add to Comparison List" (secondary button) - For university comparison feature
  - Full bilingual support with complete language separation
- **University Browsing & Detail**: 
  - Displays 1,234 curated U.S. universities (filtered from verified list with duplicates removed)
  - Infinite scroll loading 12 universities at a time for seamless browsing
  - Official university seals: Top 100 universities display official institutional seals from Wikipedia and verified sources
  - Single dual-handle range sliders for tuition ($0-$70k) and SAT scores (800-1600) with automatic handle collision prevention
  - "Recommended" sort (default) prioritizes schools with official seals and verified data
  - Additional sorting: Alphabetical (A-Z, Z-A), SAT Range (ascending/descending)
  - Full bilingual support with complete language separation
- **Housing Support**: Provides real estate listings, currently restricted to California and Georgia, with clear messaging and validation for state-specific searches.
- **Core Pages**: Includes HomePage, UniversitiesPage, UniversityProfilePage, StudentProfilePage, ProfileCalculatorPage, DashboardPage, ConsultingPage, ComparePage, HousingPage, LoginPage, and SignupPage.

## External Dependencies
- **PrepLounge AI API**: For real-time admission probability analysis and university recommendations (`https://dev.preplounge.ai/`). No authentication required.
- **OpenStreetMap Nominatim API**: For geocoding locations in the housing search (rate limit: 1 request/second).
- **Cozying Production API**: For real estate listings (`https://cozying.ai/cozying-api/v1/home/list`).
- **HomeJunction CDN**: For displaying property images in housing listings (`https://listing-images.homejunction.com`).