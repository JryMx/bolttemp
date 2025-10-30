  import React, { useState } from 'react';
  import {
    Search,
    FileText,
    Award,
    BookOpen,
    Users,
    Lightbulb,
    PenTool,
    ClipboardCheck,
    Plus,
    X,
    User,
    Calculator,
  } from 'lucide-react';
  import {
    useStudentProfile,
    ExtracurricularActivity,
    RecommendationLetter,
    ApplicationComponents,
  } from '../context/StudentProfileContext';
  import { useLanguage } from '../context/LanguageContext';
  import './student-profile-page.css';

  const StudentProfilePage: React.FC = () => {
    const { profile, updateProfile, calculateProfileScore } = useStudentProfile();
    const { language } = useLanguage();

    const [activeTab, setActiveTab] = useState<'academic' | 'non-academic'>('academic');
    const [searchQuery, setSearchQuery] = useState('');

    // Application Components Checker
    const [applicationComponents, setApplicationComponents] = useState<ApplicationComponents>(
      profile?.applicationComponents || {
        secondarySchoolGPA: false,
        secondarySchoolRank: false,
        secondarySchoolRecord: false,
        collegePrepProgram: false,
        recommendations: false,
        extracurricularActivities: false,
        essay: false,
        testScores: false,
      }
    );

    // Academic form data
    const [academicData, setAcademicData] = useState({
      gpa: profile?.gpa?.toString() || '',
      schoolYear: '',
      standardizedTest: '',
      satEBRW: profile?.satEBRW?.toString() || '',
      satMath: profile?.satMath?.toString() || '',
      actScore: profile?.actScore?.toString() || '',
      // English proficiency (richer merged fields)
      englishProficiencyTest: profile?.toeflScore ? 'TOEFL iBT' : '',
      englishTestScore: profile?.toeflScore?.toString() || '',
      intendedMajor: profile?.intendedMajor || '',
    });

    // Non-academic form data
    const [nonAcademicData, setNonAcademicData] = useState({
      personalStatement: profile?.personalStatement || '',
      legacyStatus: profile?.legacyStatus || false,
      citizenship: profile?.citizenship || 'domestic',
    });

    const [extracurriculars, setExtracurriculars] = useState<ExtracurricularActivity[]>(
      profile?.extracurriculars || []
    );

    const [recommendationLetters, setRecommendationLetters] = useState<RecommendationLetter[]>(
      profile?.recommendationLetters || []
    );

    const handleAcademicChange = (field: string, value: string) => {
      setAcademicData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNonAcademicChange = (field: string, value: string | boolean) => {
      setNonAcademicData((prev) => ({ ...prev, [field]: value }));
    };

    const handleApplicationComponentChange = (component: keyof ApplicationComponents, value: boolean) => {
      setApplicationComponents((prev) => ({ ...prev, [component]: value }));
    };

    // Extracurriculars
    const addExtracurricular = () => {
      const newActivity: ExtracurricularActivity = {
        id: Date.now().toString(),
        type: 'Other',
        name: '',
        description: '',
        grades: [],
        recognitionLevel: 'Local',
        hoursPerWeek: 0,
      };
      setExtracurriculars((prev) => [...prev, newActivity]);
    };

    const updateExtracurricular = (id: string, field: keyof ExtracurricularActivity, value: any) => {
      setExtracurriculars((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
    };

    const removeExtracurricular = (id: string) => {
      setExtracurriculars((prev) => prev.filter((a) => a.id !== id));
    };

    // Recommendation letters
    const addRecommendationLetter = () => {
      const newLetter: RecommendationLetter = {
        id: Date.now().toString(),
        source: 'Teacher',
        depth: 'knows somewhat',
        relevance: 'not relevant or not available',
      };
      setRecommendationLetters((prev) => [...prev, newLetter]);
    };

    const updateRecommendationLetter = (id: string, field: keyof RecommendationLetter, value: string) => {
      setRecommendationLetters((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    };

    const removeRecommendationLetter = (id: string) => {
      setRecommendationLetters((prev) => prev.filter((l) => l.id !== id));
    };

    const handleSaveProfile = () => {
      const profileData = {
        gpa: parseFloat(academicData.gpa) || 0,
        satEBRW: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satEBRW) || 0 : 0,
        satMath: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satMath) || 0 : 0,
        actScore: academicData.standardizedTest === 'ACT' ? parseInt(academicData.actScore) || 0 : 0,
        apCourses: 0,
        ibScore: 0,
        toeflScore:
          academicData.englishProficiencyTest === 'TOEFL iBT'
            ? parseInt(academicData.englishTestScore) || 0
            : 0,
        intendedMajor: academicData.intendedMajor,
        personalStatement: nonAcademicData.personalStatement,
        legacyStatus: nonAcademicData.legacyStatus,
        citizenship: nonAcademicData.citizenship as 'domestic' | 'international',
        extracurriculars,
        recommendationLetters,
        applicationComponents,
        // legacy/compat
        leadership: [],
        volunteering: [],
        awards: [],
      };

      updateProfile(profileData);
    };

    const currentScore = calculateProfileScore({
      ...nonAcademicData,
      extracurriculars,
      recommendationLetters,
      gpa: parseFloat(academicData.gpa) || 0,
      satEBRW: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satEBRW) || 0 : 0,
      satMath: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satMath) || 0 : 0,
      actScore: academicData.standardizedTest === 'ACT' ? parseInt(academicData.actScore) || 0 : 0,
      apCourses: 0,
      ibScore: 0,
      toeflScore:
        academicData.englishProficiencyTest === 'TOEFL iBT'
          ? parseInt(academicData.englishTestScore) || 0
          : 0,
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

          {/* Profile Score */}
          <div className="profile-score-box" data-testid="section-profile-score">
            <div className="score-display">
              <span className="score-label">{language === 'ko' ? '프로필 점수' : 'Profile Score'}</span>
              <span className="score-value" data-testid="text-current-score">
                {currentScore}
                <span className="score-max">/100</span>
              </span>
              <span className="score-continue">
                {language === 'ko' ? '계속 학습' : 'Continue Learning'}
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div className="checklist-section">
            <div className="checklist-header">
              <FileText className="checklist-icon" />
              <h2 className="checklist-title">
                {language === 'ko' ? '지원서 구성 요소 체크리스트' : 'Application Components Checklist'}
              </h2>
            </div>
            <p className="checklist-description">
              {language === 'ko'
                ? '입학 전형에서 가치가 있는 항목을 체크하세요. 지원 전 성취를 평가하는 데 도움이 됩니다. 모든 항목이 필수는 아닙니다.'
                : 'Check the items valued in admissions. This helps evaluate your achievements before applying. Not all items are required.'}
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

          {/* Academic Tab */}
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
                <label className="form-label">{language === 'ko' ? '학교 연도' : 'School Year'}</label>
                <select
                  value={academicData.schoolYear}
                  onChange={(e) => handleAcademicChange('schoolYear', e.target.value)}
                  className="form-select"
                  data-testid="select-school-year"
                >
                  <option value="">{language === 'ko' ? '선택해주세요' : 'Please select'}</option>
                  <option value="freshman">{language === 'ko' ? '1학년' : 'Freshman'}</option>
                  <option value="sophomore">{language === 'ko' ? '2학년' : 'Sophomore'}</option>
                  <option value="junior">{language === 'ko' ? '3학년' : 'Junior'}</option>
                  <option value="senior">{language === 'ko' ? '4학년' : 'Senior'}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {language === 'ko' ? '표준화 시험' : 'Standardized Test'}{' '}
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
                  {language === 'ko' ? '영어 능력 시험(국제학생)' : 'English Proficiency Test (International)'}{' '}
                  <span className="optional">({language === 'ko' ? '선택사항' : 'Optional'})</span>
                </label>
                <select
                  value={academicData.englishProficiencyTest}
                  onChange={(e) => handleAcademicChange('englishProficiencyTest', e.target.value)}
                  className="form-select"
                  data-testid="select-english-test"
                >
                  <option value="">{language === 'ko' ? '시험을 선택하세요 (선택사항)' : 'Select a test (Optional)'}</option>
                  <option value="TOEFL iBT">TOEFL iBT</option>
                  <option value="IELTS">IELTS</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="PTE Academic Test">PTE Academic Test</option>
                  <option value="Duolingo English Test">Duolingo English Test</option>
                </select>
              </div>

              {academicData.englishProficiencyTest && (
                <div className="form-group">
                  <label className="form-label">
                    {academicData.englishProficiencyTest} {language === 'ko' ? '점수' : 'Score'}
                  </label>
                  <input
                    type={academicData.englishProficiencyTest === 'Cambridge' ? 'text' : 'number'}
                    min="0"
                    max={
                      academicData.englishProficiencyTest === 'TOEFL iBT'
                        ? 120
                        : academicData.englishProficiencyTest === 'IELTS'
                        ? 9
                        : academicData.englishProficiencyTest === 'PTE Academic Test'
                        ? 90
                        : academicData.englishProficiencyTest === 'Duolingo English Test'
                        ? 160
                        : undefined
                    }
                    step={academicData.englishProficiencyTest === 'IELTS' ? 0.5 : 1}
                    value={academicData.englishTestScore}
                    onChange={(e) => handleAcademicChange('englishTestScore', e.target.value)}
                    className="form-input"
                    placeholder={
                      academicData.englishProficiencyTest === 'TOEFL iBT'
                        ? '105'
                        : academicData.englishProficiencyTest === 'IELTS'
                        ? '7.5'
                        : academicData.englishProficiencyTest === 'Cambridge'
                        ? 'C1'
                        : academicData.englishProficiencyTest === 'PTE Academic Test'
                        ? '65'
                        : academicData.englishProficiencyTest === 'Duolingo English Test'
                        ? '120'
                        : ''
                    }
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{language === 'ko' ? '희망 전공' : 'Intended Major'}</label>
                <select
                  value={academicData.intendedMajor}
                  onChange={(e) => handleAcademicChange('intendedMajor', e.target.value)}
                  className="form-select"
                >
                  <option value="">{language === 'ko' ? '전공을 선택하세요' : 'Select a major'}</option>
                  <option value="Computer Science">컴퓨터과학</option>
                  <option value="Engineering">공학</option>
                  <option value="Business">경영학</option>
                  <option value="Medicine">의학</option>
                  <option value="Liberal Arts">인문학</option>
                  <option value="Sciences">자연과학</option>
                  <option value="Mathematics">수학</option>
                  <option value="Other">기타</option>
                </select>
              </div>

              <button onClick={handleSaveProfile} className="calculate-button" data-testid="button-calculate-score">
                <ClipboardCheck className="button-icon" />
                {language === 'ko' ? '프로필 점수 계산하기' : 'Calculate Profile Score'}
              </button>
            </div>
          )}

          {/* Non-academic Tab */}
          {activeTab === 'non-academic' && (
            <div className="form-section" data-testid="section-non-academic-form">
              <h3 className="form-title">{language === 'ko' ? '비교과 정보' : 'Non-academic Information'}</h3>

              {/* Personal Statement */}
              <div className="profile-form-group full-width" style={{ marginBottom: '24px' }}>
                <label className="profile-form-label">
                  {language === 'ko' ? '자기소개서 (Common App 에세이)' : 'Personal Statement'}
                </label>
                <textarea
                  value={nonAcademicData.personalStatement}
                  onChange={(e) => handleNonAcademicChange('personalStatement', e.target.value)}
                  className="profile-form-textarea"
                  rows={8}
                  placeholder={language === 'ko' ? '자기소개서를 작성하세요...' : 'Write your statement...'}
                />
              </div>

              {/* Extracurriculars */}
              <div className="extracurriculars-section">
                <div className="extracurriculars-header">
                  <h3 className="profile-section-title" style={{ marginBottom: 0 }}>
                    {language === 'ko' ? '대외활동' : 'Extracurricular Activities'}
                  </h3>
                  <button onClick={addExtracurricular} className="profile-btn-add">
                    <Plus className="h-4 w-4" />
                    {language === 'ko' ? '활동 추가' : 'Add Activity'}
                  </button>
                </div>

                <div style={{ marginTop: '16px' }}>
                  {extracurriculars.map((activity, index) => (
                    <div key={activity.id} className="extracurricular-card">
                      <button onClick={() => removeExtracurricular(activity.id)} className="extracurricular-remove-btn">
                        <X className="h-5 w-5" />
                      </button>
                      <h4 className="profile-form-label" style={{ marginBottom: '16px' }}>
                        {language === 'ko' ? '활동' : 'Activity'} {index + 1}
                      </h4>

                      <div className="profile-form-grid">
                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '활동 유형' : 'Type'}</label>
                          <select
                            value={activity.type}
                            onChange={(e) => updateExtracurricular(activity.id, 'type', e.target.value)}
                            className="profile-form-select"
                          >
                            <option value="Sports">스포츠</option>
                            <option value="Arts">예술</option>
                            <option value="Community Service">봉사활동</option>
                            <option value="Research">연구</option>
                            <option value="Academic Clubs">학술 동아리</option>
                            <option value="Leadership">리더십</option>
                            <option value="Work Experience">근무 경험</option>
                            <option value="Other">기타</option>
                          </select>
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '활동명' : 'Name'}</label>
                          <input
                            type="text"
                            value={activity.name}
                            onChange={(e) => updateExtracurricular(activity.id, 'name', e.target.value)}
                            className="profile-form-input"
                            placeholder={language === 'ko' ? '예: 축구부' : 'e.g., Soccer Team'}
                          />
                        </div>

                        <div>
                          <label className="profile-form-label">{language === 'ko' ? '참여 학년' : 'Grades'}</label>
                          <div className="grid grid-cols-4 gap-2">
                            {['9', '10', '11', '12'].map((grade) => (
                              <label key={grade} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={activity.grades?.includes(grade) || false}
                                  onChange={(e) => {
                                    const currentGrades = activity.grades || [];
                                    const newGrades = e.target.checked
                                      ? [...currentGrades, grade]
                                      : currentGrades.filter((g) => g !== grade);
                                    updateExtracurricular(activity.id, 'grades', newGrades);
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                />
                                <span className="text-sm">{grade}{language === 'ko' ? '학년' : ''}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '인정 수준' : 'Recognition'}</label>
                          <select
                            value={activity.recognitionLevel}
                            onChange={(e) => updateExtracurricular(activity.id, 'recognitionLevel', e.target.value)}
                            className="profile-form-select"
                          >
                            <option value="Local">지역</option>
                            <option value="Regional">광역</option>
                            <option value="National">전국</option>
                            <option value="International">국제</option>
                          </select>
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '주당 시간' : 'Hours/Week'}</label>
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={activity.hoursPerWeek}
                            onChange={(e) =>
                              updateExtracurricular(activity.id, 'hoursPerWeek', parseInt(e.target.value) || 0)
                            }
                            className="profile-form-input"
                            placeholder="10"
                          />
                        </div>
                      </div>

                      <div className="profile-form-group full-width" style={{ marginTop: '16px' }}>
                        <label className="profile-form-label">{language === 'ko' ? '설명' : 'Description'}</label>
                        <textarea
                          value={activity.description}
                          onChange={(e) => updateExtracurricular(activity.id, 'description', e.target.value)}
                          className="profile-form-textarea"
                          rows={2}
                          placeholder={language === 'ko' ? '역할과 성과를 설명하세요...' : 'Describe your role and impact...'}
                        />
                      </div>
                    </div>
                  ))}

                  {extracurriculars.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{language === 'ko' ? '아직 추가된 대외활동이 없습니다.' : 'No activities added yet.'}</p>
                      <p className="text-sm">
                        {language === 'ko' ? '"활동 추가"를 클릭하여 시작하세요.' : 'Click "Add Activity" to start.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation Letters */}
              <div className="extracurriculars-section">
                <div className="extracurriculars-header">
                  <h3 className="profile-section-title" style={{ marginBottom: 0 }}>
                    {language === 'ko' ? '추천서' : 'Recommendation Letters'}
                  </h3>
                  <button onClick={addRecommendationLetter} className="profile-btn-add">
                    <Plus className="h-4 w-4" />
                    {language === 'ko' ? '추천서 추가' : 'Add Letter'}
                  </button>
                </div>

                <div style={{ marginTop: '16px' }}>
                  {recommendationLetters.map((letter, index) => (
                    <div key={letter.id} className="extracurricular-card">
                      <button onClick={() => removeRecommendationLetter(letter.id)} className="extracurricular-remove-btn">
                        <X className="h-5 w-5" />
                      </button>
                      <h4 className="profile-form-label" style={{ marginBottom: '16px' }}>
                        {language === 'ko' ? '추천서' : 'Letter'} {index + 1}
                      </h4>

                      <div className="profile-form-grid">
                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '추천인' : 'Source'}</label>
                          <select
                            value={letter.source}
                            onChange={(e) => updateRecommendationLetter(letter.id, 'source', e.target.value)}
                            className="profile-form-select"
                          >
                            <option value="Teacher">교사</option>
                            <option value="Counselor">상담교사</option>
                            <option value="Principal">교장</option>
                            <option value="Coach">코치</option>
                            <option value="Employer">고용주</option>
                            <option value="Other">기타</option>
                          </select>
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '관계의 깊이' : 'Depth'}</label>
                          <select
                            value={letter.depth || 'knows somewhat'}
                            onChange={(e) => updateRecommendationLetter(letter.id, 'depth', e.target.value)}
                            className="profile-form-select"
                          >
                            <option value="knows deeply">깊이 알고 있음</option>
                            <option value="knows somewhat">어느 정도 알고 있음</option>
                            <option value="barely knows">거의 모름</option>
                          </select>
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-form-label">{language === 'ko' ? '관련성' : 'Relevance'}</label>
                          <select
                            value={letter.relevance || 'not relevant or not available'}
                            onChange={(e) => updateRecommendationLetter(letter.id, 'relevance', e.target.value)}
                            className="profile-form-select"
                          >
                            <option value="highly relevant to intended major">희망 전공과 매우 관련</option>
                            <option value="somewhat relevant to intended major">어느 정도 관련</option>
                            <option value="not relevant or not available">관련 없음/해당 없음</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {recommendationLetters.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{language === 'ko' ? '아직 추가된 추천서가 없습니다.' : 'No letters added yet.'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Legacy/Citizenship */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ko' ? '가족 내 동문 여부' : 'Legacy Status'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="legacyStatus"
                        checked={nonAcademicData.legacyStatus === true}
                        onChange={() => handleNonAcademicChange('legacyStatus', true)}
                        className="mr-2"
                      />
                      {language === 'ko' ? '예' : 'Yes'}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="legacyStatus"
                        checked={nonAcademicData.legacyStatus === false}
                        onChange={() => handleNonAcademicChange('legacyStatus', false)}
                        className="mr-2"
                      />
                      {language === 'ko' ? '아니오' : 'No'}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ko' ? '시민권' : 'Citizenship'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="citizenship"
                        checked={nonAcademicData.citizenship === 'domestic'}
                        onChange={() => handleNonAcademicChange('citizenship', 'domestic')}
                        className="mr-2"
                      />
                      {language === 'ko' ? '국내' : 'Domestic'}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="citizenship"
                        checked={nonAcademicData.citizenship === 'international'}
                        onChange={() => handleNonAcademicChange('citizenship', 'international')}
                        className="mr-2"
                      />
                      {language === 'ko' ? '국제' : 'International'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* School Comparison (simple placeholder search UI) */}
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

          {/* Save/Calculate CTA */}
          <div className="profile-actions" style={{ padding: '0 32px 32px' }}>
            <button onClick={handleSaveProfile} className="profile-btn-primary" style={{ width: '100%' }}>
              <Calculator className="h-5 w-5" />
              {language === 'ko' ? '프로필 점수 계산하기' : 'Save & Calculate'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default StudentProfilePage;
