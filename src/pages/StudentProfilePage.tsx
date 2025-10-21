import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Target, ArrowRight, Plus, X, Search, Calculator, CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import { useStudentProfile, ExtracurricularActivity, RecommendationLetter, ApplicationComponents } from '../context/StudentProfileContext';
import { useLanguage } from '../context/LanguageContext';
import './student-profile-page.css';

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, calculateProfileScore, searchSchools } = useStudentProfile();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'academic' | 'non-academic'>('academic');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

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
    standardizedTest: profile?.satEBRW && profile?.satMath ? 'SAT' : profile?.actScore ? 'ACT' : '',
    satEBRW: profile?.satEBRW?.toString() || '',
    satMath: profile?.satMath?.toString() || '',
    actScore: profile?.actScore?.toString() || '',
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
    setAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleNonAcademicChange = (field: string, value: string | boolean) => {
    setNonAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplicationComponentChange = (component: keyof ApplicationComponents, value: boolean) => {
    setApplicationComponents(prev => ({ ...prev, [component]: value }));
  };

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
    setExtracurriculars(prev => [...prev, newActivity]);
  };

  const updateExtracurricular = (id: string, field: keyof ExtracurricularActivity, value: any) => {
    setExtracurriculars(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const removeExtracurricular = (id: string) => {
    setExtracurriculars(prev => prev.filter(activity => activity.id !== id));
  };

  const addRecommendationLetter = () => {
    const newLetter: RecommendationLetter = {
      id: Date.now().toString(),
      source: 'Teacher',
      depth: 'knows somewhat',
      relevance: 'not relevant or not available',
    };
    setRecommendationLetters(prev => [...prev, newLetter]);
  };

  const updateRecommendationLetter = (id: string, field: keyof RecommendationLetter, value: string) => {
    setRecommendationLetters(prev =>
      prev.map(letter =>
        letter.id === id ? { ...letter, [field]: value } : letter
      )
    );
  };

  const removeRecommendationLetter = (id: string) => {
    setRecommendationLetters(prev => prev.filter(letter => letter.id !== id));
  };

  const handleSaveProfile = () => {
    const profileData = {
      gpa: parseFloat(academicData.gpa) || 0,
      satEBRW: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satEBRW) || 0 : 0,
      satMath: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satMath) || 0 : 0,
      actScore: academicData.standardizedTest === 'ACT' ? parseInt(academicData.actScore) || 0 : 0,
      apCourses: 0,
      ibScore: 0,
      toeflScore: academicData.englishProficiencyTest === 'TOEFL iBT' ? parseInt(academicData.englishTestScore) || 0 : 0,
      intendedMajor: academicData.intendedMajor,
      personalStatement: nonAcademicData.personalStatement,
      legacyStatus: nonAcademicData.legacyStatus,
      citizenship: nonAcademicData.citizenship as 'domestic' | 'international',
      extracurriculars,
      recommendationLetters,
      applicationComponents,
      // Legacy fields for compatibility
      leadership: [],
      volunteering: [],
      awards: [],
    };

    updateProfile(profileData);
    setShowResults(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim() && profile) {
      setShowResults(true);
    }
  };

  const searchResults = searchQuery.trim() ? searchSchools(searchQuery) : [];
  const currentScore = calculateProfileScore({
    ...academicData,
    ...nonAcademicData,
    extracurriculars,
    recommendationLetters,
    gpa: parseFloat(academicData.gpa) || 0,
    satEBRW: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satEBRW) || 0 : 0,
    satMath: academicData.standardizedTest === 'SAT' ? parseInt(academicData.satMath) || 0 : 0,
    actScore: academicData.standardizedTest === 'ACT' ? parseInt(academicData.actScore) || 0 : 0,
    apCourses: 0,
    ibScore: 0,
    toeflScore: academicData.englishProficiencyTest === 'TOEFL iBT' ? parseInt(academicData.englishTestScore) || 0 : 0,
  });

  return (
    <div className="student-profile-page">
      <div className="profile-hero-section">
        <div className="profile-hero-content">
          <h1 className="profile-hero-title">
            {t('profile.hero.title')}
          </h1>
          <p className="profile-hero-description">
            {t('profile.hero.description')}
          </p>
        </div>
      </div>

      <div className="profile-container">

        {(profile || Object.values(academicData).some(v => v) || Object.values(nonAcademicData).some(v => v)) && (
          <div className="profile-calculator-section" style={{marginBottom: '24px', padding: '40px 32px', borderRadius: '16px'}}>
            <div className="profile-calculator-result-no-border" style={{width: '100%', height: '100%', maxWidth: '600px', margin: '0 auto'}}>
              <div className="profile-calculator-result-content">
                <div className="profile-calculator-score-group">
                  <span className="profile-calculator-score-label">{t('profile.score.label')}</span>
                  <div className="profile-calculator-score-display">
                    <span className="profile-calculator-score-value">{currentScore === 0 ? '--' : currentScore}</span>
                    <span className="profile-calculator-score-total">/100</span>
                  </div>
                </div>
                <p className="profile-calculator-description">
                  {currentScore === 0 ? t('profile.score.needs-improvement') :
                   currentScore >= 90 ? t('profile.score.excellent') :
                   currentScore >= 80 ? t('profile.score.very-good') :
                   currentScore >= 70 ? t('profile.score.good') :
                   currentScore >= 60 ? t('profile.score.fair') : t('profile.score.needs-improvement')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="application-checker-section">
          <div className="application-checker-header">
            <ClipboardList className="h-6 w-6" style={{color: '#082F49'}} />
            <h2 className="application-checker-title">{t('profile.checklist.title')}</h2>
          </div>

          <p className="application-checker-description">
            {t('profile.checklist.description')}
          </p>

          <div className="application-components-grid">
              {[
                { key: 'secondarySchoolGPA', label: t('profile.checklist.gpa'), description: t('profile.checklist.gpa.desc') },
                { key: 'secondarySchoolRank', label: t('profile.checklist.rank'), description: t('profile.checklist.rank.desc') },
                { key: 'secondarySchoolRecord', label: t('profile.checklist.transcript'), description: t('profile.checklist.transcript.desc') },
                { key: 'collegePrepProgram', label: t('profile.checklist.college-prep'), description: t('profile.checklist.college-prep.desc') },
                { key: 'recommendations', label: t('profile.checklist.recommendations'), description: t('profile.checklist.recommendations.desc') },
                { key: 'extracurricularActivities', label: t('profile.checklist.extracurriculars'), description: t('profile.checklist.extracurriculars.desc') },
                { key: 'essay', label: t('profile.checklist.essay'), description: t('profile.checklist.essay.desc') },
                { key: 'testScores', label: t('profile.checklist.test-scores'), description: t('profile.checklist.test-scores.desc') },
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
                >
                  <div className="application-component-content">
                    <div className="application-component-checkbox">
                      {applicationComponents[component.key as keyof ApplicationComponents] && (
                        <CheckCircle className="h-4 w-4" style={{color: '#082F49'}} />
                      )}
                    </div>
                    <div className="application-component-info">
                      <h3 className="application-component-label">
                        {component.label}
                      </h3>
                      <p className="application-component-description">
                        {component.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="profile-tabs-container">
          <div className="profile-tabs-nav">
            <button
              onClick={() => setActiveTab('academic')}
              className={`profile-tab-button ${activeTab === 'academic' ? 'active' : ''}`}
            >
              <BookOpen className="h-5 w-5" />
              {t('profile.tabs.academic')}
            </button>
            <button
              onClick={() => setActiveTab('non-academic')}
              className={`profile-tab-button ${activeTab === 'non-academic' ? 'active' : ''}`}
            >
              <Award className="h-5 w-5" />
              {t('profile.tabs.non-academic')}
            </button>
          </div>

          <div className="profile-tab-content">
            {activeTab === 'academic' && (
              <div>
                <h2 className="profile-section-title">{t('profile.academic.title')}</h2>

                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      {t('profile.academic.gpa')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={academicData.gpa}
                      onChange={(e) => handleAcademicChange('gpa', e.target.value)}
                      className="profile-form-input"
                      placeholder="3.8"
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      {t('profile.academic.major')}
                    </label>
                    <select
                      value={academicData.intendedMajor}
                      onChange={(e) => handleAcademicChange('intendedMajor', e.target.value)}
                      className="profile-form-select"
                    >
                      <option value="">{t('profile.academic.major.placeholder')}</option>
                      <option value="Computer Science">{t('profile.academic.major.cs')}</option>
                      <option value="Engineering">{t('profile.academic.major.engineering')}</option>
                      <option value="Business">{t('profile.academic.major.business')}</option>
                      <option value="Medicine">{t('profile.academic.major.medicine')}</option>
                      <option value="Liberal Arts">{t('profile.academic.major.liberal-arts')}</option>
                      <option value="Sciences">{t('profile.academic.major.sciences')}</option>
                      <option value="Mathematics">{t('profile.academic.major.math')}</option>
                      <option value="Other">{t('profile.academic.major.other')}</option>
                    </select>
                  </div>

                  <div className="profile-form-group full-width">
                    <label className="profile-form-label">
                      {t('profile.academic.test')}
                    </label>
                    <select
                      value={academicData.standardizedTest}
                      onChange={(e) => handleAcademicChange('standardizedTest', e.target.value)}
                      className="profile-form-select"
                    >
                      <option value="">{t('profile.academic.test.placeholder')}</option>
                      <option value="SAT">SAT</option>
                      <option value="ACT">ACT</option>
                    </select>
                  </div>

                  {academicData.standardizedTest === 'SAT' && (
                    <>
                      <div className="profile-form-group">
                        <label className="profile-form-label">
                          {t('profile.academic.sat.ebrw')}
                        </label>
                        <input
                          type="number"
                          min="200"
                          max="800"
                          value={academicData.satEBRW}
                          onChange={(e) => handleAcademicChange('satEBRW', e.target.value)}
                          className="profile-form-input"
                          placeholder="720"
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">
                          {t('profile.academic.sat.math')}
                        </label>
                        <input
                          type="number"
                          min="200"
                          max="800"
                          value={academicData.satMath}
                          onChange={(e) => handleAcademicChange('satMath', e.target.value)}
                          className="profile-form-input"
                          placeholder="730"
                        />
                      </div>
                    </>
                  )}

                  {academicData.standardizedTest === 'ACT' && (
                    <div className="profile-form-group">
                      <label className="profile-form-label">
                        {t('profile.academic.act')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="36"
                        value={academicData.actScore}
                        onChange={(e) => handleAcademicChange('actScore', e.target.value)}
                        className="profile-form-input"
                        placeholder="32"
                      />
                    </div>
                  )}

                  <div className="profile-form-group full-width">
                    <label className="profile-form-label">
                      {t('profile.academic.english')}
                    </label>
                    <select
                      value={academicData.englishProficiencyTest}
                      onChange={(e) => handleAcademicChange('englishProficiencyTest', e.target.value)}
                      className="profile-form-select"
                    >
                      <option value="">{t('profile.academic.english.placeholder')}</option>
                      <option value="TOEFL iBT">TOEFL iBT</option>
                      <option value="IELTS">IELTS</option>
                      <option value="Cambridge">Cambridge</option>
                      <option value="PTE Academic Test">PTE Academic Test</option>
                      <option value="Duolingo English Test">Duolingo English Test</option>
                    </select>
                  </div>

                  {academicData.englishProficiencyTest && (
                    <div className="profile-form-group full-width">
                      <label className="profile-form-label">
                        {academicData.englishProficiencyTest} 점수
                        {academicData.englishProficiencyTest === 'TOEFL iBT' && ' (120점 만점)'}
                        {academicData.englishProficiencyTest === 'IELTS' && ' (9.0점 만점)'}
                        {academicData.englishProficiencyTest === 'Cambridge' && ' (A1-C2 레벨)'}
                        {academicData.englishProficiencyTest === 'PTE Academic Test' && ' (90점 만점)'}
                        {academicData.englishProficiencyTest === 'Duolingo English Test' && ' (160점 만점)'}
                      </label>
                      <input
                        type={academicData.englishProficiencyTest === 'Cambridge' ? 'text' : 'number'}
                        min={academicData.englishProficiencyTest === 'IELTS' ? '0' : '0'}
                        max={
                          academicData.englishProficiencyTest === 'TOEFL iBT' ? '120' :
                          academicData.englishProficiencyTest === 'IELTS' ? '9' :
                          academicData.englishProficiencyTest === 'PTE Academic Test' ? '90' :
                          academicData.englishProficiencyTest === 'Duolingo English Test' ? '160' : undefined
                        }
                        step={academicData.englishProficiencyTest === 'IELTS' ? '0.5' : '1'}
                        value={academicData.englishTestScore}
                        onChange={(e) => handleAcademicChange('englishTestScore', e.target.value)}
                        className="profile-form-input"
                        placeholder={
                          academicData.englishProficiencyTest === 'TOEFL iBT' ? '105' :
                          academicData.englishProficiencyTest === 'IELTS' ? '7.5' :
                          academicData.englishProficiencyTest === 'Cambridge' ? 'C1' :
                          academicData.englishProficiencyTest === 'PTE Academic Test' ? '65' :
                          academicData.englishProficiencyTest === 'Duolingo English Test' ? '120' : ''
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'non-academic' && (
              <div>
                <h2 className="profile-section-title">{t('profile.non-academic.title')}</h2>

                <div className="profile-form-group full-width" style={{marginBottom: '32px'}}>
                  <label className="profile-form-label">
                    {t('profile.non-academic.essay')}
                  </label>
                  <textarea
                    value={nonAcademicData.personalStatement}
                    onChange={(e) => handleNonAcademicChange('personalStatement', e.target.value)}
                    className="profile-form-textarea"
                    rows={8}
                    placeholder={t('profile.non-academic.essay.placeholder')}
                  />
                  <p style={{fontSize: '12px', color: 'rgba(8, 47, 73, 0.6)', marginTop: '8px'}}>
                    {nonAcademicData.personalStatement.length} {t('profile.non-academic.essay.count')}
                  </p>
                </div>

                <div className="extracurriculars-section">
                  <div className="extracurriculars-header">
                    <h3 className="profile-section-title" style={{marginBottom: 0}}>{t('profile.extracurriculars.title')}</h3>
                    <button
                      onClick={addExtracurricular}
                      className="profile-btn-add"
                    >
                      <Plus className="h-4 w-4" />
                      {t('profile.extracurriculars.add')}
                    </button>
                  </div>

                  <div style={{marginTop: '16px'}}>
                    {extracurriculars.map((activity, index) => (
                      <div key={activity.id} className="extracurricular-card">
                        <button
                          onClick={() => removeExtracurricular(activity.id)}
                          className="extracurricular-remove-btn"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <h4 className="profile-form-label" style={{marginBottom: '16px'}}>{t('profile.extracurriculars.activity')} {index + 1}</h4>

                        <div className="profile-form-grid">
                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.extracurriculars.type')}
                            </label>
                            <select
                              value={activity.type}
                              onChange={(e) => updateExtracurricular(activity.id, 'type', e.target.value)}
                              className="profile-form-select"
                            >
                              <option value="Sports">{t('profile.extracurriculars.type.sports')}</option>
                              <option value="Arts">{t('profile.extracurriculars.type.arts')}</option>
                              <option value="Community Service">{t('profile.extracurriculars.type.community')}</option>
                              <option value="Research">{t('profile.extracurriculars.type.research')}</option>
                              <option value="Academic Clubs">{t('profile.extracurriculars.type.academic')}</option>
                              <option value="Leadership">{t('profile.extracurriculars.type.leadership')}</option>
                              <option value="Work Experience">{t('profile.extracurriculars.type.work')}</option>
                              <option value="Other">{t('profile.extracurriculars.type.other')}</option>
                            </select>
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.extracurriculars.name')}
                            </label>
                            <input
                              type="text"
                              value={activity.name}
                              onChange={(e) => updateExtracurricular(activity.id, 'name', e.target.value)}
                              className="profile-form-input"
                              placeholder={t('profile.extracurriculars.name.placeholder')}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('profile.extracurriculars.grades')}
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                              {['9', '10', '11', '12'].map(grade => (
                                <label key={grade} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={activity.grades?.includes(grade) || false}
                                    onChange={(e) => {
                                      const currentGrades = activity.grades || [];
                                      const newGrades = e.target.checked
                                        ? [...currentGrades, grade]
                                        : currentGrades.filter(g => g !== grade);
                                      updateExtracurricular(activity.id, 'grades', newGrades);
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm">{grade}{t('profile.extracurriculars.grade')}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.extracurriculars.recognition')}
                            </label>
                            <select
                              value={activity.recognitionLevel}
                              onChange={(e) => updateExtracurricular(activity.id, 'recognitionLevel', e.target.value)}
                              className="profile-form-select"
                            >
                              <option value="Local">{t('profile.extracurriculars.recognition.local')}</option>
                              <option value="Regional">{t('profile.extracurriculars.recognition.regional')}</option>
                              <option value="National">{t('profile.extracurriculars.recognition.national')}</option>
                              <option value="International">{t('profile.extracurriculars.recognition.international')}</option>
                            </select>
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.extracurriculars.hours')}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="40"
                              value={activity.hoursPerWeek}
                              onChange={(e) => updateExtracurricular(activity.id, 'hoursPerWeek', parseInt(e.target.value) || 0)}
                              className="profile-form-input"
                              placeholder="10"
                            />
                          </div>
                        </div>

                        <div className="profile-form-group full-width" style={{marginTop: '16px'}}>
                          <label className="profile-form-label">
                            {t('profile.extracurriculars.description')}
                          </label>
                          <textarea
                            value={activity.description}
                            onChange={(e) => updateExtracurricular(activity.id, 'description', e.target.value)}
                            className="profile-form-textarea"
                            rows={2}
                            placeholder={t('profile.extracurriculars.description.placeholder')}
                          />
                        </div>
                      </div>
                    ))}

                    {extracurriculars.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>{t('profile.extracurriculars.empty')}</p>
                        <p className="text-sm">{t('profile.extracurriculars.empty.action')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="extracurriculars-section">
                  <div className="extracurriculars-header">
                    <h3 className="profile-section-title" style={{marginBottom: 0}}>{t('profile.recommendations.title')}</h3>
                    <button
                      onClick={addRecommendationLetter}
                      className="profile-btn-add"
                    >
                      <Plus className="h-4 w-4" />
                      {t('profile.recommendations.add')}
                    </button>
                  </div>

                  <div style={{marginTop: '16px'}}>
                    {recommendationLetters.map((letter, index) => (
                      <div key={letter.id} className="extracurricular-card">
                        <button
                          onClick={() => removeRecommendationLetter(letter.id)}
                          className="extracurricular-remove-btn"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <h4 className="profile-form-label" style={{marginBottom: '16px'}}>{t('profile.recommendations.letter')} {index + 1}</h4>

                        <div className="profile-form-grid">
                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.recommendations.source')}
                            </label>
                            <select
                              value={letter.source}
                              onChange={(e) => updateRecommendationLetter(letter.id, 'source', e.target.value)}
                              className="profile-form-select"
                            >
                              <option value="Teacher">{t('profile.recommendations.source.teacher')}</option>
                              <option value="Counselor">{t('profile.recommendations.source.counselor')}</option>
                              <option value="Principal">{t('profile.recommendations.source.principal')}</option>
                              <option value="Coach">{t('profile.recommendations.source.coach')}</option>
                              <option value="Employer">{t('profile.recommendations.source.employer')}</option>
                              <option value="Other">{t('profile.recommendations.source.other')}</option>
                            </select>
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.recommendations.depth')}
                            </label>
                            <select
                              value={letter.depth || 'knows somewhat'}
                              onChange={(e) => updateRecommendationLetter(letter.id, 'depth', e.target.value)}
                              className="profile-form-select"
                            >
                              <option value="knows deeply">{t('profile.recommendations.depth.deep')}</option>
                              <option value="knows somewhat">{t('profile.recommendations.depth.somewhat')}</option>
                              <option value="barely knows">{t('profile.recommendations.depth.barely')}</option>
                            </select>
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-form-label">
                              {t('profile.recommendations.relevance')}
                            </label>
                            <select
                              value={letter.relevance || 'not relevant or not available'}
                              onChange={(e) => updateRecommendationLetter(letter.id, 'relevance', e.target.value)}
                              className="profile-form-select"
                            >
                              <option value="highly relevant to intended major">{t('profile.recommendations.relevance.highly')}</option>
                              <option value="somewhat relevant to intended major">{t('profile.recommendations.relevance.somewhat')}</option>
                              <option value="not relevant or not available">{t('profile.recommendations.relevance.not')}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    {recommendationLetters.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>{t('profile.recommendations.empty')}</p>
                        <p className="text-sm">{t('profile.recommendations.empty.action')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Legacy Status and Citizenship */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.legacy.title')}
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
                        {t('profile.legacy.yes')}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="legacyStatus"
                          checked={nonAcademicData.legacyStatus === false}
                          onChange={() => handleNonAcademicChange('legacyStatus', false)}
                          className="mr-2"
                        />
                        {t('profile.legacy.no')}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.citizenship.title')}
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
                        {t('profile.citizenship.domestic')}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="citizenship"
                          checked={nonAcademicData.citizenship === 'international'}
                          onChange={() => handleNonAcademicChange('citizenship', 'international')}
                          className="mr-2"
                        />
                        {t('profile.citizenship.international')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions" style={{padding: '0 32px 32px'}}>
            <button
              onClick={handleSaveProfile}
              className="profile-btn-primary" style={{width: '100%'}}
            >
              <Calculator className="h-5 w-5" />
              {t('profile.save')}
            </button>
          </div>
        </div>

        <div className="profile-tabs-container">
          <div className="profile-tab-content">
            <h2 className="profile-section-title">{t('profile.comparison.title')}</h2>
          
            <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
              <div style={{flex: 1, position: 'relative'}}>
                <Search className="h-5 w-5" style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(8, 47, 73, 0.4)'}} />
                <input
                  type="text"
                  placeholder={t('profile.comparison.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="profile-form-input"
                  style={{width: '100%', paddingLeft: '48px'}}
                />
              </div>
              <button
                onClick={handleSearch}
                className="profile-btn-primary"
              >
                {t('profile.comparison.search.button')}
              </button>
            </div>

            {showResults && searchResults.length > 0 && (
              <div>
                <h3 className="profile-form-label" style={{marginBottom: '16px'}}>{t('profile.comparison.results')}</h3>
                {searchResults.map(school => (
                  <div
                    key={school.id}
                    className="extracurricular-card"
                    style={{
                      borderColor: school.category === 'safety' ? '#FACC15' : school.category === 'target' ? '#F59E0B' : '#EF4444',
                      background: school.category === 'safety' ? '#FFFBEB' : school.category === 'target' ? '#FFF7ED' : '#FEE2E2',
                      marginBottom: '16px'
                    }}
                  >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{school.name}</h4>
                      <p className="text-sm text-gray-600">#{school.ranking} • {t('profile.comparison.ranking')} {school.acceptanceRate}%</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        school.category === 'safety' ? 'bg-green-100 text-green-800' :
                        school.category === 'target' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {school.category === 'safety' ? t('profile.comparison.category.safety') : 
                         school.category === 'target' ? t('profile.comparison.category.target') : t('profile.comparison.category.reach')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">{t('profile.comparison.required-score')}</span>
                      <span className="ml-2 font-bold">{school.requiredScore}/100</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">{t('profile.comparison.my-score')}</span>
                      <span className="ml-2 font-bold">{currentScore}/100</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">{t('profile.comparison.ratio')}</span>
                      <span className="ml-2 font-bold">{school.comparisonRatio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showResults && searchResults.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>"{searchQuery}" {t('profile.comparison.no-results')}</p>
              <p className="text-sm">{t('profile.comparison.no-results.action')}</p>
            </div>
          )}

            {!showResults && (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{t('profile.comparison.empty')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;