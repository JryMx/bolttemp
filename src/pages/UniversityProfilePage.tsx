import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, DollarSign, BookOpen, ArrowLeft, Plus, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import universitiesData from '../data/universities.json';
import './university-profile-page.css';

interface ApplicationRequirements {
  gpa?: string;
  rank?: string;
  record?: string;
  prepProgram?: string;
  recommendations?: string;
  competencies?: string;
  workExperience?: string;
  essay?: string;
  legacyStatus?: string;
  testScores?: string;
  englishProficiency?: string;
}

interface AcademicInfo {
  graduationRate?: number;
  degreeTypes?: {
    bachelors: boolean;
    masters: boolean;
    doctoral: boolean;
  };
}

interface University {
  id: string;
  name: string;
  englishName: string;
  location: string;
  tuition: number;
  acceptanceRate: number;
  satRange: string;
  actRange: string;
  image: string;
  type: string;
  size: string;
  estimatedGPA?: number | null;
  applicationRequirements?: ApplicationRequirements;
  academicInfo?: AcademicInfo;
  programs?: string[];
}

const universities: University[] = universitiesData as University[];

const getUniversityData = (id: string) => {
  return universities.find(uni => uni.id === id);
};

const translateSize = (size: string, language: 'ko' | 'en'): string => {
  if (language === 'ko') return size;
  
  if (size === '큼 (15,000+)') return 'Large (15,000+)';
  if (size === '중간 (5,000-15,000)') return 'Medium (5,000-15,000)';
  if (size === '작음 (<5,000)') return 'Small (<5,000)';
  
  return size;
};

const getRequirementBadgeType = (status?: string): 'required' | 'optional' | 'not-considered' => {
  if (!status) return 'not-considered';
  if (status.includes('Required')) return 'required';
  if (status.includes('Not required') || status.includes('considered if submitted')) return 'optional';
  return 'not-considered';
};

const translateRequirementStatus = (language: 'ko' | 'en', status?: string): string => {
  if (!status) return language === 'ko' ? '고려 안 됨' : 'Not Considered';
  
  if (status.includes('Required')) {
    return language === 'ko' ? '필수' : 'Required';
  }
  if (status.includes('Not required') || status.includes('considered if submitted')) {
    return language === 'ko' ? '선택 (제출 시 고려)' : 'Optional (Considered if submitted)';
  }
  if (status.includes('Not considered')) {
    return language === 'ko' ? '고려 안 됨' : 'Not Considered';
  }
  
  return status;
};

// Simplified program name translations (key categories)
const translateProgramName = (program: string, language: 'ko' | 'en'): string => {
  if (language === 'en') return program;
  
  const translations: Record<string, string> = {
    'Agricultural/Animal/Plant/Veterinary Science and Related Fields': '농업/동물/식물/수의학',
    'Natural Resources and Conservation': '자연자원 및 보존',
    'Architecture and Related Services': '건축학',
    'Area, Ethnic, Cultural, Gender, and Group Studies': '지역/민족/문화/젠더 연구',
    'Communication, Journalism, and Related Programs': '커뮤니케이션 및 저널리즘',
    'Communications Technologies/Technicians and Support Services': '통신 기술',
    'Computer and Information Sciences and Support Services': '컴퓨터 및 정보과학',
    'Personal and Culinary Services': '요리 및 개인 서비스',
    'Education': '교육학',
    'Engineering': '공학',
    'Engineering/Engineering-related Technologies/Technicians': '공학 기술',
    'Foreign Languages, Literatures, and Linguistics': '외국어 및 언어학',
    'Family and Consumer Sciences/Human Sciences': '가정학',
    'Legal Professions and Studies': '법학',
    'English Language and Literature/Letters': '영문학',
    'Liberal Arts and Sciences, General Studies and Humanities': '인문교양',
    'Library Science': '도서관학',
    'Biological and Biomedical Sciences': '생물학 및 의생명과학',
    'Mathematics and Statistics': '수학 및 통계학',
    'Military Science and Military Technologies': '군사학',
    'Multi/Interdisciplinary Studies': '융합전공',
    'Parks, Recreation, Leisure, and Fitness Studies': '레저 및 체육학',
    'Philosophy and Religious Studies': '철학 및 종교학',
    'Theology and Religious Vocations': '신학',
    'Physical Sciences': '물리학',
    'Science Technologies/Technicians': '과학 기술',
    'Psychology': '심리학',
    'Homeland Security, Law Enforcement, Firefighting and Related': '공공안전',
    'Public Administration and Social Service Professions': '행정학 및 사회복지',
    'Social Sciences': '사회과학',
    'Construction Trades': '건설 기술',
    'Mechanic and Repair Technologies/Technicians': '정비 기술',
    'Precision Production': '정밀 생산',
    'Transportation and Materials Moving': '운송학',
    'Visual and Performing Arts': '예술',
    'Health Professions and Related Programs': '보건의료',
    'Business, Management, Marketing, and Related Support Services': '경영학',
    'History': '역사학'
  };
  
  return translations[program] || program;
};

const STORAGE_KEY = 'compare-universities';

const UniversityProfilePage: React.FC = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const university = getUniversityData(id || '1');
  const [isAdded, setIsAdded] = useState(false);

  // Check if university is already in comparison list
  React.useEffect(() => {
    if (!university) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const currentIds: string[] = saved ? JSON.parse(saved) : [];
      setIsAdded(currentIds.includes(university.id));
    } catch (error) {
      console.error('Failed to check comparison list:', error);
    }
  }, [university]);

  if (!university) {
    return (
      <div className="university-profile-not-found">
        <div className="university-profile-not-found-content">
          <h2 className="university-profile-not-found-title">{t('university.notfound.title')}</h2>
          <Link to="/universities" className="university-profile-not-found-link">
            {t('university.notfound.back')}
          </Link>
        </div>
      </div>
    );
  }

  const universityName = language === 'ko' ? university.name : university.englishName;

  return (
    <div className="university-profile-page">
      {/* Header */}
      <div className="university-profile-header">
        <div className="university-profile-header-container">
          <Link
            to="/universities"
            className="university-profile-back-link"
            data-testid="link-back-to-universities"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('university.back')}
          </Link>

          <div className="university-profile-hero">
            <img
              src={university.image}
              alt={universityName}
              className="university-profile-image"
              data-testid="img-university-logo"
            />

            <div className="university-profile-hero-content">
              <div className="university-profile-title-row">
                <h1 className="university-profile-title" data-testid="text-university-name">
                  {universityName}
                </h1>
                <div className="university-profile-badges">
                  <span className="university-profile-badge commonapp" data-testid="badge-commonapp">
                    {t('university.commonapp.yes')}
                  </span>
                  <button className="university-profile-compare-btn" data-testid="button-compare">
                    <Plus className="h-4 w-4" />
                    {t('university.compare')}
                  </button>
                </div>
              </div>

              <div className="university-profile-location" data-testid="text-location">
                <MapPin className="h-5 w-5" />
                <span>{university.location}</span>
                <span>•</span>
                <span>{university.type === '공립' ? (language === 'ko' ? '공립' : 'Public') : (language === 'ko' ? '사립' : 'Private')}</span>
              </div>

              {/* School Details */}
              <div className="university-profile-details-grid">
                <div className="university-profile-detail-item">
                  <span className="university-profile-detail-label">{t('university.location')}:</span>
                  <span className="university-profile-detail-value">{university.location}</span>
                </div>
                <div className="university-profile-detail-item">
                  <span className="university-profile-detail-label">{t('university.type')}:</span>
                  <span className="university-profile-detail-value">{university.type === '공립' ? (language === 'ko' ? '공립' : 'Public') : (language === 'ko' ? '사립' : 'Private')}</span>
                </div>
                <div className="university-profile-detail-item">
                  <span className="university-profile-detail-label">{t('university.size')}:</span>
                  <span className="university-profile-detail-value">{translateSize(university.size, language)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="university-profile-content">
        {/* Quick Stats */}
        <div className="university-profile-stats">
          <div className="university-profile-stat-card" data-testid="card-acceptance-rate">
            <div className="university-profile-stat-header">
              <Users className="h-5 w-5" style={{color: '#082F49'}} />
              <span className="university-profile-stat-label">{t('university.stat.acceptance')}</span>
            </div>
            <div className="university-profile-stat-value" data-testid="text-acceptance-rate">
              {university.acceptanceRate}%
            </div>
          </div>

          <div className="university-profile-stat-card" data-testid="card-tuition">
            <div className="university-profile-stat-header">
              <DollarSign className="h-5 w-5" style={{color: '#082F49'}} />
              <span className="university-profile-stat-label">{t('university.stat.tuition')}</span>
            </div>
            <div className="university-profile-stat-value" data-testid="text-tuition">
              ${university.tuition.toLocaleString()}
            </div>
          </div>

          <div className="university-profile-stat-card" data-testid="card-sat">
            <div className="university-profile-stat-header">
              <BookOpen className="h-5 w-5" style={{color: '#082F49'}} />
              <span className="university-profile-stat-label">{t('university.stat.sat')}</span>
            </div>
            <div className="university-profile-stat-value" data-testid="text-sat-range">
              {university.satRange}
            </div>
          </div>

          <div className="university-profile-stat-card" data-testid="card-act">
            <div className="university-profile-stat-header">
              <BookOpen className="h-5 w-5" style={{color: '#082F49'}} />
              <span className="university-profile-stat-label">{t('university.stat.act')}</span>
            </div>
            <div className="university-profile-stat-value" data-testid="text-act-range">
              {university.actRange}
            </div>
          </div>

          {university.estimatedGPA && (
            <div className="university-profile-stat-card" data-testid="card-gpa">
              <div className="university-profile-stat-header">
                <BookOpen className="h-5 w-5" style={{color: '#082F49'}} />
                <span className="university-profile-stat-label">{t('university.stat.gpa')}</span>
              </div>
              <div className="university-profile-stat-value" data-testid="text-gpa">
                {university.estimatedGPA.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Two Column Layout: Application Requirements & Academic Information */}
        <div className="university-profile-two-column">
          {/* Left Column: Application Requirements */}
          <div className="university-profile-section">
            <h2 className="university-profile-section-title" data-testid="title-application-requirements">
              <BookOpen className="h-6 w-6" />
              {language === 'ko' ? '지원 요건' : 'Application Requirements'}
            </h2>
            <div className="university-profile-requirements-list">
              {university.applicationRequirements?.gpa && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '고등학교 GPA' : 'High School GPA'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.gpa)}`} data-testid="badge-gpa">
                    {translateRequirementStatus(language, university.applicationRequirements.gpa)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.rank && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '고등학교 석차' : 'High School Rank'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.rank)}`} data-testid="badge-rank">
                    {translateRequirementStatus(language, university.applicationRequirements.rank)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.record && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '고등학교 성적표' : 'High School Transcript'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.record)}`} data-testid="badge-transcript">
                    {translateRequirementStatus(language, university.applicationRequirements.record)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.prepProgram && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '대학 준비 프로그램 이수' : 'College Prep Program Completion'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.prepProgram)}`} data-testid="badge-prep">
                    {translateRequirementStatus(language, university.applicationRequirements.prepProgram)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.recommendations && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '추천서' : 'Recommendation'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.recommendations)}`} data-testid="badge-recommendation">
                    {translateRequirementStatus(language, university.applicationRequirements.recommendations)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.competencies && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '역량 증명' : 'Demonstration of Competencies'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.competencies)}`} data-testid="badge-competencies">
                    {translateRequirementStatus(language, university.applicationRequirements.competencies)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.workExperience && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '업무 경험' : 'Work Experience'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.workExperience)}`} data-testid="badge-work-experience">
                    {translateRequirementStatus(language, university.applicationRequirements.workExperience)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.essay && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '자기소개서/에세이' : 'Personal Statement/Essay'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.essay)}`} data-testid="badge-essay">
                    {translateRequirementStatus(language, university.applicationRequirements.essay)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.legacyStatus && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '동문 자녀 여부' : 'Legacy Status'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.legacyStatus)}`} data-testid="badge-legacy">
                    {translateRequirementStatus(language, university.applicationRequirements.legacyStatus)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.testScores && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '입학시험 점수' : 'Admission Test Scores'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.testScores)}`} data-testid="badge-test-scores">
                    {translateRequirementStatus(language, university.applicationRequirements.testScores)}
                  </span>
                </div>
              )}
              {university.applicationRequirements?.englishProficiency && (
                <div className="requirement-item">
                  <span className="requirement-name">{language === 'ko' ? '영어 능력 시험' : 'English Proficiency Test'}</span>
                  <span className={`requirement-badge ${getRequirementBadgeType(university.applicationRequirements.englishProficiency)}`} data-testid="badge-english">
                    {translateRequirementStatus(language, university.applicationRequirements.englishProficiency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Academic Information */}
          <div className="university-profile-section">
            <h2 className="university-profile-section-title" data-testid="title-academic-info">
              <BookOpen className="h-6 w-6" />
              {language === 'ko' ? '학업 정보' : 'Academic Information'}
            </h2>
            <div className="academic-info-content">
              {/* Graduation Rate */}
              {university.academicInfo?.graduationRate !== undefined && (
                <div className="academic-info-item">
                  <span className="academic-info-label">{language === 'ko' ? '졸업률' : 'Graduation Rate'}</span>
                  <span className="academic-info-value graduation-rate" data-testid="text-graduation-rate">
                    {university.academicInfo.graduationRate}%
                  </span>
                </div>
              )}

              {/* Degree Types */}
              {university.academicInfo?.degreeTypes && (
                <div className="academic-info-item">
                  <span className="academic-info-label">{language === 'ko' ? '제공 학위 유형' : 'Degree Types Offered'}</span>
                  <div className="degree-types" data-testid="section-degree-types">
                    {university.academicInfo.degreeTypes.bachelors && (
                      <span className="degree-badge">{language === 'ko' ? '학사' : 'Bachelor\'s'}</span>
                    )}
                    {university.academicInfo.degreeTypes.masters && (
                      <span className="degree-badge">{language === 'ko' ? '석사' : 'Master\'s'}</span>
                    )}
                    {university.academicInfo.degreeTypes.doctoral && (
                      <span className="degree-badge">{language === 'ko' ? '박사' : 'Doctoral'}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Available Majors/Programs */}
              {university.programs && university.programs.filter(p => p !== 'Grand total').length > 0 && (
                <div className="academic-info-item">
                  <span className="academic-info-label">{language === 'ko' ? '개설 전공' : 'Available Majors'}</span>
                  <div className="majors-list" data-testid="section-majors">
                    {university.programs
                      .filter(program => program !== 'Grand total')
                      .map((program, index) => (
                        <div key={index} className="major-item">
                          {translateProgramName(program, language)}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="university-profile-actions">
              <Link 
                to="/profile-calculator" 
                className="action-button primary"
                data-testid="button-check-admission"
              >
                <BookOpen className="h-5 w-5" />
                {language === 'ko' ? '합격 가능성 확인하기' : 'Check Admission Probability'}
              </Link>
              <button 
                className="action-button secondary"
                data-testid="button-add-comparison"
                onClick={() => {
                  try {
                    const saved = localStorage.getItem(STORAGE_KEY);
                    const currentIds: string[] = saved ? JSON.parse(saved) : [];

                    if (currentIds.includes(university.id)) {
                      alert(t('compare.toast.already-added'));
                      return;
                    }

                    if (currentIds.length >= 4) {
                      alert(t('compare.toast.limit'));
                      return;
                    }

                    currentIds.push(university.id);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentIds));
                    setIsAdded(true);

                    const universityName = language === 'ko' ? university.name : university.englishName;
                    const message = t('compare.toast.added').replace('{name}', universityName);
                    const viewCompare = language === 'ko' ? '\n\n비교하기 페이지에서 확인하시겠습니까?' : '\n\nView on the Compare page?';
                    
                    if (window.confirm(message + viewCompare)) {
                      navigate('/compare');
                    }
                  } catch (error) {
                    console.error('Failed to add to comparison:', error);
                    alert(language === 'ko' ? '오류가 발생했습니다' : 'An error occurred');
                  }
                }}
                style={isAdded ? { 
                  background: '#10b981', 
                  borderColor: '#10b981',
                  cursor: 'default'
                } : undefined}
                disabled={isAdded}
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5" />
                    {language === 'ko' ? '비교 목록에 추가됨' : 'Added to Comparison'}
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    {language === 'ko' ? '비교 목록에 추가' : 'Add to Comparison List'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePage;
