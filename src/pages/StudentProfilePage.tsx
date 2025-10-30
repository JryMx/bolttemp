import { useState } from 'react';
import { Search, FileText, Award, BookOpen, Users, Lightbulb, PenTool, ClipboardCheck } from 'lucide-react';
import { useStudentProfile } from '../context/StudentProfileContext';
import { useLanguage } from '../context/LanguageContext';
import './student-profile-page.css';

const StudentProfilePage = () => {
  const { profile, updateProfile, calculateProfileScore } = useStudentProfile();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'academic' | 'non-academic'>('academic');
  const [searchQuery, setSearchQuery] = useState('');

  // Academic form data
  const [academicData, setAcademicData] = useState({
    gpa: profile?.gpa?.toString() || '',
    schoolYear: '',
    standardizedTest: '',
    satEBRW: profile?.satEBRW?.toString() || '',
    satMath: profile?.satMath?.toString() || '',
    actScore: profile?.actScore?.toString() || '',
    englishTest: '',
    toeflScore: profile?.toeflScore?.toString() || '',
  });

  const handleAcademicChange = (field: string, value: string) => {
    setAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculateScore = () => {
    const profileData = {
      gpa: parseFloat(academicData.gpa) || 0,
      satEBRW: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satEBRW) || 0 : 0,
      satMath: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satMath) || 0 : 0,
      actScore: academicData.standardizedTest === 'ACT' ? parseInt(academicData.actScore) || 0 : 0,
      apCourses: 0,
      ibScore: 0,
      toeflScore: parseInt(academicData.toeflScore) || 0,
      intendedMajor: '',
      personalStatement: '',
      legacyStatus: false,
      citizenship: 'domestic' as 'domestic' | 'international',
      extracurriculars: [],
      recommendationLetters: [],
      applicationComponents: {
        secondarySchoolGPA: !!academicData.gpa,
        secondarySchoolRank: false,
        secondarySchoolRecord: false,
        collegePrepProgram: false,
        recommendations: false,
        extracurricularActivities: false,
        essay: false,
        testScores: !!(academicData.satEBRW || academicData.actScore),
      },
      leadership: [],
      volunteering: [],
      awards: [],
    };

    updateProfile(profileData);
  };

  const currentScore = calculateProfileScore({
    gpa: parseFloat(academicData.gpa) || 0,
    satEBRW: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satEBRW) || 0 : 0,
    satMath: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satMath) || 0 : 0,
    actScore: academicData.standardizedTest === 'ACT' ? parseInt(academicData.actScore) || 0 : 0,
    apCourses: 0,
    ibScore: 0,
    toeflScore: 0,
    intendedMajor: '',
    personalStatement: '',
    legacyStatus: false,
    citizenship: 'domestic',
    extracurriculars: [],
    recommendationLetters: [],
    applicationComponents: {
      secondarySchoolGPA: false,
      secondarySchoolRank: false,
      secondarySchoolRecord: false,
      collegePrepProgram: false,
      recommendations: false,
      extracurricularActivities: false,
      essay: false,
      testScores: false,
    },
    leadership: [],
    volunteering: [],
    awards: [],
  });

  const checklistItems = [
    { icon: FileText, label: language === 'ko' ? '고등학교 GPA' : 'Secondary school GPA', sublabel: language === 'ko' ? 'Secondary school GPA' : '' },
    { icon: Award, label: language === 'ko' ? '고등학교 석차' : 'Secondary school rank', sublabel: language === 'ko' ? 'Secondary school rank' : '' },
    { icon: ClipboardCheck, label: language === 'ko' ? '고등학교 성적표' : 'Secondary school transcript', sublabel: language === 'ko' ? 'Secondary school transcript' : '' },
    { icon: BookOpen, label: language === 'ko' ? '대학 준비 프로그램' : 'Completion of college preparatory program', sublabel: language === 'ko' ? 'Completion of college preparatory program' : '' },
    { icon: Users, label: language === 'ko' ? '추천서' : 'Recommendations', sublabel: language === 'ko' ? 'Recommendations' : '' },
    { icon: Lightbulb, label: language === 'ko' ? '대외활동' : 'Extracurricular activities', sublabel: language === 'ko' ? 'Extracurricular activities' : '' },
    { icon: PenTool, label: language === 'ko' ? '자기소개서/에세이' : 'Personal statement or essay', sublabel: language === 'ko' ? 'Personal statement or essay' : '' },
    { icon: ClipboardCheck, label: language === 'ko' ? '시험 점수' : 'Test scores', sublabel: language === 'ko' ? 'Test scores' : '' },
  ];

  return (
    <div className="student-profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title" data-testid="text-profile-title">
            {language === 'ko' ? '프로필 분석' : 'Profile Analysis'}
          </h1>
          <p className="profile-description" data-testid="text-profile-description">
            {language === 'ko' 
              ? '교과 및 비교과 프로필을 완성하여 종합적인 프로필 점수와 개인 맞춤 대학 추천을 받아보세요.'
              : 'Complete your academic and non-academic profile to receive a comprehensive profile score and personalized university recommendations.'}
          </p>
        </div>

        {/* Profile Score Display */}
        <div className="profile-score-box" data-testid="section-profile-score">
          <div className="score-display">
            <span className="score-label">{language === 'ko' ? '프로필 점수' : 'Profile Score'}</span>
            <span className="score-value" data-testid="text-current-score">{currentScore}<span className="score-max">/100</span></span>
            <span className="score-continue">{language === 'ko' ? '계속 학습' : 'Continue Learning'}</span>
          </div>
        </div>

        {/* Application Components Checklist */}
        <div className="checklist-section">
          <div className="checklist-header">
            <FileText className="checklist-icon" />
            <h2 className="checklist-title">
              {language === 'ko' ? '자원식 구성 요소 체크리스트' : 'Application Components Checklist'}
            </h2>
          </div>
          <p className="checklist-description">
            {language === 'ko' 
              ? '입학전형시 가치로 있는 항목을 체크하세요. 지원 전의 성취를 평가하는 데 도움이 됩니다. 모든 항목은 필수는 아니며 추가 사항이기도 합니다.'
              : 'Check the items that have value in the admissions process. This helps evaluate your achievements before applying. Not all items are required and some are additional.'}
          </p>

          <div className="checklist-grid">
            {checklistItems.map((item, index) => (
              <div key={index} className="checklist-item" data-testid={`checklist-item-${index}`}>
                <item.icon className="item-icon" />
                <span className="item-label">{item.label}</span>
                {language === 'ko' && item.sublabel && (
                  <span className="item-sublabel">{item.sublabel}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
            data-testid="button-tab-academic"
          >
            {language === 'ko' ? '교과' : 'Academic'}
          </button>
          <button
            className={`tab-button ${activeTab === 'non-academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('non-academic')}
            data-testid="button-tab-non-academic"
          >
            {language === 'ko' ? '비교과' : 'Non-academic'}
          </button>
        </div>

        {/* Academic Tab Content */}
        {activeTab === 'academic' && (
          <div className="form-section" data-testid="section-academic-form">
            <h3 className="form-title">{language === 'ko' ? '교과 정보' : 'Academic Information'}</h3>

            <div className="form-group">
              <label className="form-label">
                {language === 'ko' ? 'GPA (4.0 만점)' : 'GPA (4.0 Scale)'} <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={academicData.gpa}
                onChange={(e) => handleAcademicChange('gpa', e.target.value)}
                className="form-input"
                placeholder="3.8"
                data-testid="input-gpa"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'ko' ? '학교 연도' : 'School Year'}
              </label>
              <select
                value={academicData.schoolYear}
                onChange={(e) => handleAcademicChange('schoolYear', e.target.value)}
                className="form-select"
                data-testid="select-school-year"
              >
                <option value="">{language === 'ko' ? '선택을 선택해주세요' : 'Please select'}</option>
                <option value="freshman">{language === 'ko' ? '1학년' : 'Freshman'}</option>
                <option value="sophomore">{language === 'ko' ? '2학년' : 'Sophomore'}</option>
                <option value="junior">{language === 'ko' ? '3학년' : 'Junior'}</option>
                <option value="senior">{language === 'ko' ? '4학년' : 'Senior'}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'ko' ? '반년 시험' : 'Standardized Test'}{' '}
                <span className="optional">({language === 'ko' ? '선택사항' : 'Optional'})</span>
              </label>
              <select
                value={academicData.standardizedTest}
                onChange={(e) => handleAcademicChange('standardizedTest', e.target.value)}
                className="form-select"
                data-testid="select-standardized-test"
              >
                <option value="">{language === 'ko' ? '시험을 선택하세요 (선택사항)' : 'Select a test (Optional)'}</option>
                <option value="SAT">SAT</option>
                <option value="ACT">ACT</option>
              </select>
            </div>

            {academicData.standardizedTest === 'SAT' && (
              <>
                <div className="form-group">
                  <label className="form-label">SAT EBRW</label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={academicData.satEBRW}
                    onChange={(e) => handleAcademicChange('satEBRW', e.target.value)}
                    className="form-input"
                    placeholder="650"
                    data-testid="input-sat-ebrw"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SAT Math</label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={academicData.satMath}
                    onChange={(e) => handleAcademicChange('satMath', e.target.value)}
                    className="form-input"
                    placeholder="680"
                    data-testid="input-sat-math"
                  />
                </div>
              </>
            )}

            {academicData.standardizedTest === 'ACT' && (
              <div className="form-group">
                <label className="form-label">ACT Score</label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={academicData.actScore}
                  onChange={(e) => handleAcademicChange('actScore', e.target.value)}
                  className="form-input"
                  placeholder="28"
                  data-testid="input-act-score"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {language === 'ko' ? '영어 능력 시험' : 'English Proficiency Test'}{' '}
                <span className="optional">({language === 'ko' ? '선택사항' : 'Optional'})</span>
              </label>
              <select
                value={academicData.englishTest}
                onChange={(e) => handleAcademicChange('englishTest', e.target.value)}
                className="form-select"
                data-testid="select-english-test"
              >
                <option value="">{language === 'ko' ? '시험을 선택하세요 (선택사항)' : 'Select a test (Optional)'}</option>
                <option value="TOEFL">TOEFL</option>
                <option value="IELTS">IELTS</option>
                <option value="Duolingo">Duolingo English Test</option>
              </select>
            </div>

            {academicData.englishTest === 'TOEFL' && (
              <div className="form-group">
                <label className="form-label">TOEFL Score</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={academicData.toeflScore}
                  onChange={(e) => handleAcademicChange('toeflScore', e.target.value)}
                  className="form-input"
                  placeholder="90"
                  data-testid="input-toefl-score"
                />
              </div>
            )}

            <button
              onClick={handleCalculateScore}
              className="calculate-button"
              data-testid="button-calculate-score"
            >
              <ClipboardCheck className="button-icon" />
              {language === 'ko' ? '프로필 점수 계산하기' : 'Calculate Profile Score'}
            </button>
          </div>
        )}

        {/* Non-academic Tab Content */}
        {activeTab === 'non-academic' && (
          <div className="form-section" data-testid="section-non-academic-form">
            <h3 className="form-title">{language === 'ko' ? '비교과 정보' : 'Non-academic Information'}</h3>
            <p className="coming-soon">
              {language === 'ko' ? '곧 출시됩니다...' : 'Coming soon...'}
            </p>
          </div>
        )}

        {/* School Comparison Section */}
        <div className="comparison-section" data-testid="section-school-comparison">
          <h3 className="comparison-title">{language === 'ko' ? '학교 비교' : 'School Comparison'}</h3>
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ko' ? '학교명으로 검색...' : 'Search by school name...'}
                className="search-input"
                data-testid="input-school-search"
              />
            </div>
            <button className="search-button" data-testid="button-search">
              {language === 'ko' ? '검색' : 'Search'}
            </button>
          </div>

          {!searchQuery && (
            <div className="empty-search">
              <Search className="empty-icon" />
              <p className="empty-text">
                {language === 'ko' 
                  ? '프로필을 완성하고 학교를 검색하여 비교 결과를 확인하세요.'
                  : 'Complete your profile and search for schools to view comparison results.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
