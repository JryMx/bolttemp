import { useState } from 'react';
import { Search, BookOpen, Award, ClipboardList, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './profile-calculator.css';

interface ApplicationComponents {
  secondarySchoolGPA: boolean;
  secondarySchoolRank: boolean;
  secondarySchoolRecord: boolean;
  collegePrepProgram: boolean;
  recommendations: boolean;
  extracurricularActivities: boolean;
  essay: boolean;
  testScores: boolean;
}

const ProfileCalculatorPage = () => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'academic' | 'non-academic'>('academic');
  const [searchQuery, setSearchQuery] = useState('');

  // Application Components Checker
  const [applicationComponents, setApplicationComponents] = useState<ApplicationComponents>({
    secondarySchoolGPA: false,
    secondarySchoolRank: false,
    secondarySchoolRecord: false,
    collegePrepProgram: false,
    recommendations: false,
    extracurricularActivities: false,
    essay: false,
    testScores: false,
  });

  // Form data
  const [gpa, setGpa] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [testType, setTestType] = useState('');
  const [satMath, setSatMath] = useState('');
  const [satEBRW, setSatEBRW] = useState('');
  const [actScore, setActScore] = useState('');

  const calculateScore = () => {
    let score = 0;
    
    if (gpa) {
      score += (parseFloat(gpa) / 4.0) * 40;
    }
    
    if (testType === 'SAT' && satMath && satEBRW) {
      const satTotal = parseInt(satMath) + parseInt(satEBRW);
      score += (satTotal / 1600) * 40;
    } else if (testType === 'ACT' && actScore) {
      score += (parseInt(actScore) / 36) * 40;
    }
    
    return Math.round(score);
  };

  const currentScore = calculateScore();

  const handleApplicationComponentChange = (component: keyof ApplicationComponents, value: boolean) => {
    setApplicationComponents(prev => ({ ...prev, [component]: value }));
  };

  return (
    <div className="student-profile-page">
      <div className="profile-hero-section">
        <div className="profile-hero-content">
          <h1 className="profile-hero-title" data-testid="text-profile-title">
            {language === 'ko' ? '프로필 분석' : 'Profile Analysis'}
          </h1>
          <p className="profile-hero-description" data-testid="text-profile-description">
            {language === 'ko' 
              ? '교과 및 비교과 프로필을 완성하여 종합적인 프로필 점수와 개인 맞춤 대학 추천을 받아보세요.'
              : 'Complete your academic and non-academic profile to receive a comprehensive profile score and personalized university recommendations.'}
          </p>
        </div>
      </div>

      <div className="profile-container">
        {/* Profile Score Display */}
        <div className="profile-calculator-section" style={{marginBottom: '24px', padding: '40px 32px', borderRadius: '16px'}}>
          <div className="profile-calculator-result-no-border" style={{width: '100%', height: '100%', maxWidth: '600px', margin: '0 auto'}}>
            <div className="profile-calculator-result-content">
              <div className="profile-calculator-score-group">
                <span className="profile-calculator-score-label">{language === 'ko' ? '프로필 점수' : 'Profile Score'}</span>
                <div className="profile-calculator-score-display">
                  <span className="profile-calculator-score-value" data-testid="text-current-score">{currentScore === 0 ? '0' : currentScore}</span>
                  <span className="profile-calculator-score-total">/100</span>
                </div>
              </div>
              <p className="profile-calculator-description">
                {language === 'ko' ? '계속 학습' : 'Continue Learning'}
              </p>
            </div>
          </div>
        </div>

        {/* Application Components Checklist */}
        <div className="application-checker-section">
          <div className="application-checker-header">
            <ClipboardList className="h-6 w-6" style={{color: '#082F49'}} />
            <h2 className="application-checker-title">
              {language === 'ko' ? '자원식 구성 요소 체크리스트' : 'Application Components Checklist'}
            </h2>
          </div>

          <p className="application-checker-description">
            {language === 'ko' 
              ? '입학전형시 가치로 있는 항목을 체크하세요. 지원 전의 성취를 평가하는 데 도움이 됩니다. 모든 항목은 필수는 아니며 추가 사항이기도 합니다.'
              : 'Check the items that have value in the admissions process. This helps evaluate your achievements before applying. Not all items are required and some are additional.'}
          </p>

          <div className="application-components-grid">
            {[
              { key: 'secondarySchoolGPA', labelKo: '고등학교 GPA', labelEn: 'Secondary school GPA', descriptionKo: 'Secondary school GPA', descriptionEn: 'Secondary school GPA' },
              { key: 'secondarySchoolRank', labelKo: '고등학교 석차', labelEn: 'Secondary school rank', descriptionKo: 'Secondary school rank', descriptionEn: 'Secondary school rank' },
              { key: 'secondarySchoolRecord', labelKo: '고등학교 성적표', labelEn: 'Secondary school transcript', descriptionKo: 'Secondary school transcript', descriptionEn: 'Secondary school transcript' },
              { key: 'collegePrepProgram', labelKo: '대학 준비 프로그램', labelEn: 'Completion of college preparatory program', descriptionKo: 'Completion of college preparatory program', descriptionEn: 'Completion of college preparatory program' },
              { key: 'recommendations', labelKo: '추천서', labelEn: 'Recommendations', descriptionKo: 'Recommendations', descriptionEn: 'Recommendations' },
              { key: 'extracurricularActivities', labelKo: '대외활동', labelEn: 'Extracurricular activities', descriptionKo: 'Extracurricular activities', descriptionEn: 'Extracurricular activities' },
              { key: 'essay', labelKo: '자기소개서/에세이', labelEn: 'Personal statement or essay', descriptionKo: 'Personal statement or essay', descriptionEn: 'Personal statement or essay' },
              { key: 'testScores', labelKo: '시험 점수', labelEn: 'Test scores', descriptionKo: 'Test scores', descriptionEn: 'Test scores' },
            ].map((component) => (
              <div
                key={component.key}
                className={`application-component-card ${
                  applicationComponents[component.key as keyof ApplicationComponents] ? 'checked' : ''
                }`}
                onClick={() => handleApplicationComponentChange(
                  component.key as keyof ApplicationComponents,
                  !applicationComponents[component.key as keyof ApplicationComponents]
                )}
                data-testid={`checklist-item-${component.key}`}
              >
                <div className="application-component-content">
                  <div className="application-component-checkbox">
                    {applicationComponents[component.key as keyof ApplicationComponents] && (
                      <CheckCircle className="h-4 w-4" style={{color: '#082F49'}} />
                    )}
                  </div>
                  <div className="application-component-info">
                    <h3 className="application-component-label">
                      {language === 'ko' ? component.labelKo : component.labelEn}
                    </h3>
                    <p className="application-component-description">
                      {language === 'ko' ? component.descriptionKo : component.descriptionEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Container */}
        <div className="profile-tabs-container">
          <div className="profile-tabs-nav">
            <button
              onClick={() => setActiveTab('academic')}
              className={`profile-tab-button ${activeTab === 'academic' ? 'active' : ''}`}
              data-testid="button-tab-academic"
            >
              <BookOpen className="h-5 w-5" />
              {language === 'ko' ? '교과' : 'Academic'}
            </button>
            <button
              onClick={() => setActiveTab('non-academic')}
              className={`profile-tab-button ${activeTab === 'non-academic' ? 'active' : ''}`}
              data-testid="button-tab-non-academic"
            >
              <Award className="h-5 w-5" />
              {language === 'ko' ? '비교과' : 'Non-academic'}
            </button>
          </div>

          <div className="profile-tab-content">
            {activeTab === 'academic' && (
              <div>
                <h2 className="profile-section-title">{language === 'ko' ? '교과 정보' : 'Academic Information'}</h2>

                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      {language === 'ko' ? 'GPA (4.0 만점)' : 'GPA (4.0 Scale)'} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      className="profile-form-input"
                      placeholder="3.8"
                      data-testid="input-gpa"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      {language === 'ko' ? '학교 연도' : 'School Year'}
                    </label>
                    <select
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="profile-form-select"
                      data-testid="select-school-year"
                    >
                      <option value="">{language === 'ko' ? '선택을 선택해주세요' : 'Please select'}</option>
                      <option value="freshman">{language === 'ko' ? '1학년' : 'Freshman'}</option>
                      <option value="sophomore">{language === 'ko' ? '2학년' : 'Sophomore'}</option>
                      <option value="junior">{language === 'ko' ? '3학년' : 'Junior'}</option>
                      <option value="senior">{language === 'ko' ? '4학년' : 'Senior'}</option>
                    </select>
                  </div>

                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      {language === 'ko' ? '반년 시험' : 'Standardized Test'}
                    </label>
                    <select
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      className="profile-form-select"
                      data-testid="select-test-type"
                    >
                      <option value="">{language === 'ko' ? '시험을 선택하세요 (선택사항)' : 'Select a test (Optional)'}</option>
                      <option value="SAT">SAT</option>
                      <option value="ACT">ACT</option>
                    </select>
                  </div>

                  {testType === 'SAT' && (
                    <>
                      <div className="profile-form-group">
                        <label className="profile-form-label">
                          {language === 'ko' ? 'SAT 시험을 선택하세요 (선택사항)' : 'SAT Test (Optional)'}
                        </label>
                        <input
                          type="number"
                          min="200"
                          max="800"
                          value={satMath}
                          onChange={(e) => setSatMath(e.target.value)}
                          className="profile-form-input"
                          placeholder="720"
                          data-testid="input-sat-math"
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">
                          {language === 'ko' ? 'SAT 시험을 선택하세요 (선택사항)' : 'SAT EBRW (Optional)'}
                        </label>
                        <input
                          type="number"
                          min="200"
                          max="800"
                          value={satEBRW}
                          onChange={(e) => setSatEBRW(e.target.value)}
                          className="profile-form-input"
                          placeholder="730"
                          data-testid="input-sat-ebrw"
                        />
                      </div>
                    </>
                  )}

                  {testType === 'ACT' && (
                    <div className="profile-form-group">
                      <label className="profile-form-label">
                        {language === 'ko' ? 'ACT 점수' : 'ACT Score'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="36"
                        value={actScore}
                        onChange={(e) => setActScore(e.target.value)}
                        className="profile-form-input"
                        placeholder="30"
                        data-testid="input-act-score"
                      />
                    </div>
                  )}
                </div>

                <button className="profile-btn-primary" style={{marginTop: '32px', width: '100%'}} data-testid="button-calculate">
                  <ClipboardList className="h-5 w-5" />
                  {language === 'ko' ? '프로필 점수 계산하기' : 'Calculate Profile Score'}
                </button>
              </div>
            )}

            {activeTab === 'non-academic' && (
              <div>
                <h2 className="profile-section-title">{language === 'ko' ? '비교과 정보' : 'Non-academic Information'}</h2>
                <p style={{textAlign: 'center', padding: '60px 20px', color: '#9ca3af', fontSize: '15px'}}>
                  {language === 'ko' ? '곧 출시됩니다...' : 'Coming soon...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* School Comparison Section */}
        <div className="application-checker-section">
          <h3 className="application-checker-title">{language === 'ko' ? '학교 비교' : 'School Comparison'}</h3>
          <div style={{display: 'flex', gap: '12px', marginTop: '20px', marginBottom: '20px'}}>
            <div style={{flex: 1, position: 'relative'}}>
              <Search style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af', pointerEvents: 'none'}} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ko' ? '학교명으로 검색...' : 'Search by school name...'}
                className="profile-form-input"
                style={{paddingLeft: '48px'}}
                data-testid="input-school-search"
              />
            </div>
            <button className="profile-btn-primary" style={{padding: '12px 32px', whiteSpace: 'nowrap'}} data-testid="button-search">
              {language === 'ko' ? '검색' : 'Search'}
            </button>
          </div>

          {!searchQuery && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px'}}>
              <Search style={{width: '48px', height: '48px', color: '#d1d5db'}} />
              <p style={{fontSize: '14px', color: '#9ca3af', textAlign: 'center', maxWidth: '400px'}}>
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
