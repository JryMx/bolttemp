import { useState } from 'react';
import { Search, FileText, Award, BookOpen, Users, Lightbulb, PenTool, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './profile-calculator.css';

const ProfileCalculatorPage = () => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'academic' | 'non-academic'>('academic');
  const [searchQuery, setSearchQuery] = useState('');

  // Form data
  const [gpa, setGpa] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [testType, setTestType] = useState('');
  const [satMath, setSatMath] = useState('');
  const [satEBRW, setSatEBRW] = useState('');
  const [actScore, setActScore] = useState('');

  const calculateScore = () => {
    // Simple score calculation based on GPA and test scores
    let score = 0;
    
    if (gpa) {
      score += (parseFloat(gpa) / 4.0) * 40; // GPA worth 40 points
    }
    
    if (testType === 'SAT' && satMath && satEBRW) {
      const satTotal = parseInt(satMath) + parseInt(satEBRW);
      score += (satTotal / 1600) * 40; // SAT worth 40 points
    } else if (testType === 'ACT' && actScore) {
      score += (parseInt(actScore) / 36) * 40; // ACT worth 40 points
    }
    
    return Math.round(score);
  };

  const currentScore = calculateScore();

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
    <div className="profile-analysis-page">
      <div className="profile-analysis-container">
        {/* Header */}
        <div className="profile-analysis-header">
          <h1 className="profile-analysis-title" data-testid="text-profile-title">
            {language === 'ko' ? '프로필 분석' : 'Profile Analysis'}
          </h1>
          <p className="profile-analysis-description" data-testid="text-profile-description">
            {language === 'ko' 
              ? '교과 및 비교과 프로필을 완성하여 종합적인 프로필 점수와 개인 맞춤 대학 추천을 받아보세요.'
              : 'Complete your academic and non-academic profile to receive a comprehensive profile score and personalized university recommendations.'}
          </p>
        </div>

        {/* Profile Score Display */}
        <div className="profile-score-display" data-testid="section-profile-score">
          <div className="score-content">
            <span className="score-label-text">{language === 'ko' ? '프로필 점수' : 'Profile Score'}</span>
            <div className="score-badge">
              <span className="score-number" data-testid="text-current-score">{currentScore}</span>
              <span className="score-total">/100</span>
            </div>
            <span className="score-continue-text">{language === 'ko' ? '계속 학습' : 'Continue Learning'}</span>
          </div>
        </div>

        {/* Application Components Checklist */}
        <div className="checklist-box">
          <div className="checklist-box-header">
            <FileText className="checklist-box-icon" />
            <h2 className="checklist-box-title">
              {language === 'ko' ? '자원식 구성 요소 체크리스트' : 'Application Components Checklist'}
            </h2>
          </div>
          <p className="checklist-box-description">
            {language === 'ko' 
              ? '입학전형시 가치로 있는 항목을 체크하세요. 지원 전의 성취를 평가하는 데 도움이 됩니다. 모든 항목은 필수는 아니며 추가 사항이기도 합니다.'
              : 'Check the items that have value in the admissions process. This helps evaluate your achievements before applying. Not all items are required and some are additional.'}
          </p>

          <div className="checklist-box-grid">
            {checklistItems.map((item, index) => (
              <div key={index} className="checklist-box-item" data-testid={`checklist-item-${index}`}>
                <item.icon className="checklist-item-icon" />
                <span className="checklist-item-label">{item.label}</span>
                {language === 'ko' && item.sublabel && (
                  <span className="checklist-item-sublabel">{item.sublabel}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="analysis-tabs">
          <button
            className={`analysis-tab ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
            data-testid="button-tab-academic"
          >
            {language === 'ko' ? '교과' : 'Academic'}
          </button>
          <button
            className={`analysis-tab ${activeTab === 'non-academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('non-academic')}
            data-testid="button-tab-non-academic"
          >
            {language === 'ko' ? '비교과' : 'Non-academic'}
          </button>
        </div>

        {/* Academic Tab Content */}
        {activeTab === 'academic' && (
          <div className="analysis-form-section" data-testid="section-academic-form">
            <h3 className="analysis-form-heading">{language === 'ko' ? '교과 정보' : 'Academic Information'}</h3>

            <div className="analysis-form-field">
              <label className="analysis-form-label">
                {language === 'ko' ? 'GPA (4.0 만점)' : 'GPA (4.0 Scale)'} <span className="field-required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="analysis-form-input"
                placeholder="3.8"
                data-testid="input-gpa"
              />
            </div>

            <div className="analysis-form-field">
              <label className="analysis-form-label">
                {language === 'ko' ? '학교 연도' : 'School Year'}
              </label>
              <select
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="analysis-form-select"
                data-testid="select-school-year"
              >
                <option value="">{language === 'ko' ? '선택을 선택해주세요' : 'Please select'}</option>
                <option value="freshman">{language === 'ko' ? '1학년' : 'Freshman'}</option>
                <option value="sophomore">{language === 'ko' ? '2학년' : 'Sophomore'}</option>
                <option value="junior">{language === 'ko' ? '3학년' : 'Junior'}</option>
                <option value="senior">{language === 'ko' ? '4학년' : 'Senior'}</option>
              </select>
            </div>

            <div className="analysis-form-field">
              <label className="analysis-form-label">
                {language === 'ko' ? '반년 시험' : 'Standardized Test'}
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="analysis-form-select"
                data-testid="select-test-type"
              >
                <option value="">{language === 'ko' ? '시험을 선택하세요 (선택사항)' : 'Select a test (Optional)'}</option>
                <option value="SAT">SAT</option>
                <option value="ACT">ACT</option>
              </select>
            </div>

            {testType === 'SAT' && (
              <>
                <div className="analysis-form-field">
                  <label className="analysis-form-label">SAT Math</label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={satMath}
                    onChange={(e) => setSatMath(e.target.value)}
                    className="analysis-form-input"
                    placeholder="720"
                    data-testid="input-sat-math"
                  />
                </div>
                <div className="analysis-form-field">
                  <label className="analysis-form-label">SAT EBRW</label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={satEBRW}
                    onChange={(e) => setSatEBRW(e.target.value)}
                    className="analysis-form-input"
                    placeholder="730"
                    data-testid="input-sat-ebrw"
                  />
                </div>
              </>
            )}

            {testType === 'ACT' && (
              <div className="analysis-form-field">
                <label className="analysis-form-label">
                  {language === 'ko' ? 'ACT 점수' : 'ACT Score'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  className="analysis-form-input"
                  placeholder="30"
                  data-testid="input-act-score"
                />
              </div>
            )}

            <button
              className="analysis-submit-button"
              data-testid="button-calculate"
            >
              <ClipboardCheck className="button-submit-icon" />
              {language === 'ko' ? '프로필 점수 계산하기' : 'Calculate Profile Score'}
            </button>
          </div>
        )}

        {/* Non-academic Tab Content */}
        {activeTab === 'non-academic' && (
          <div className="analysis-form-section" data-testid="section-non-academic-form">
            <h3 className="analysis-form-heading">{language === 'ko' ? '비교과 정보' : 'Non-academic Information'}</h3>
            <p className="coming-soon-text">
              {language === 'ko' ? '곧 출시됩니다...' : 'Coming soon...'}
            </p>
          </div>
        )}

        {/* School Comparison Section */}
        <div className="school-comparison-box" data-testid="section-school-comparison">
          <h3 className="school-comparison-title">{language === 'ko' ? '학교 비교' : 'School Comparison'}</h3>
          <div className="search-box-wrapper">
            <div className="search-input-box">
              <Search className="search-box-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ko' ? '학교명으로 검색...' : 'Search by school name...'}
                className="search-box-input"
                data-testid="input-school-search"
              />
            </div>
            <button className="search-box-button" data-testid="button-search">
              {language === 'ko' ? '검색' : 'Search'}
            </button>
          </div>

          {!searchQuery && (
            <div className="empty-search-state">
              <Search className="empty-state-icon" />
              <p className="empty-state-text">
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

export default ProfileCalculatorPage;
