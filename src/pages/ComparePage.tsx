import { useState, useEffect } from 'react';
import { X, Plus, BookOpen, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import universitiesData from '../data/universities.json';
import './compare-page.css';

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
  estimatedGPA: number;
  academicInfo: {
    graduationRate: number;
    degreeTypes: {
      bachelors: boolean;
      masters: boolean;
      doctoral: boolean;
    };
  };
  sealUrl?: string;
}

const STORAGE_KEY = 'compare-universities';

const ComparePage = () => {
  const { t, language } = useLanguage();
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const allUniversities = universitiesData as University[];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedIds = JSON.parse(saved) as string[];
        const universities = savedIds
          .map(id => allUniversities.find(u => u.id === id))
          .filter((u): u is University => u !== undefined);
        setSelectedUniversities(universities);
      } catch (error) {
        console.error('Failed to load comparison list:', error);
      }
    }
  }, []);

  useEffect(() => {
    const ids = selectedUniversities.map(u => u.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [selectedUniversities]);

  const availableUniversities = allUniversities.filter(
    uni => !selectedUniversities.find(selected => selected.id === uni.id)
  );

  const filteredUniversities = availableUniversities.filter(uni => {
    const searchLower = searchTerm.toLowerCase();
    return (
      uni.name.toLowerCase().includes(searchLower) ||
      uni.englishName.toLowerCase().includes(searchLower) ||
      uni.location.toLowerCase().includes(searchLower)
    );
  });

  const addUniversity = (university: University) => {
    if (selectedUniversities.length >= 4) {
      alert(t('compare.toast.limit'));
      return;
    }

    if (selectedUniversities.find(u => u.id === university.id)) {
      alert(t('compare.toast.already-added'));
      return;
    }

    setSelectedUniversities(prev => [...prev, university]);
    setShowAddModal(false);
    setSearchTerm('');
  };

  const removeUniversity = (universityId: string) => {
    setSelectedUniversities(prev => prev.filter(uni => uni.id !== universityId));
  };

  const formatDegreeTypes = (degreeTypes: { bachelors: boolean; masters: boolean; doctoral: boolean }) => {
    const types = [];
    if (degreeTypes.bachelors) types.push(language === 'ko' ? '학사' : 'Bachelor\'s');
    if (degreeTypes.masters) types.push(language === 'ko' ? '석사' : 'Master\'s');
    if (degreeTypes.doctoral) types.push(language === 'ko' ? '박사' : 'Doctoral');
    return types.join(', ') || (language === 'ko' ? 'N/A' : 'N/A');
  };

  const comparisonCategories = [
    {
      title: t('compare.category.basic'),
      fields: [
        { 
          key: 'location', 
          label: t('compare.field.location'), 
          format: (val: string) => val 
        },
        { 
          key: 'type', 
          label: t('compare.field.type'), 
          format: (val: string) => val 
        },
        { 
          key: 'size', 
          label: t('compare.field.size'), 
          format: (val: string) => val 
        },
        { 
          key: 'tuition', 
          label: t('compare.field.tuition'), 
          format: (val: number) => `$${val.toLocaleString()}` 
        },
      ],
    },
    {
      title: t('compare.category.admission'),
      fields: [
        { 
          key: 'acceptanceRate', 
          label: t('compare.field.acceptance-rate'), 
          format: (val: number) => `${val}%` 
        },
        { 
          key: 'satRange', 
          label: t('compare.field.sat-range'), 
          format: (val: string) => val 
        },
        { 
          key: 'actRange', 
          label: t('compare.field.act-range'), 
          format: (val: string) => val 
        },
        { 
          key: 'estimatedGPA', 
          label: t('compare.field.gpa'), 
          format: (val: number) => val.toFixed(1) 
        },
      ],
    },
    {
      title: t('compare.category.outcomes'),
      fields: [
        { 
          key: 'academicInfo.graduationRate', 
          label: t('compare.field.graduation-rate'), 
          format: (val: number) => `${val}%` 
        },
        { 
          key: 'academicInfo.degreeTypes', 
          label: t('compare.field.degree-types'), 
          format: (val: any) => formatDegreeTypes(val) 
        },
      ],
    },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="compare-page">
      <div className="compare-container">
        <div className="compare-header">
          <h1 className="compare-title" data-testid="text-compare-title">
            {t('compare.title')}
          </h1>
          <p className="compare-description" data-testid="text-compare-description">
            {t('compare.description')}
          </p>
        </div>

        <div className="compare-selection">
          <h2 className="compare-selection-title" data-testid="text-selected-count">
            {t('compare.selected.title')} ({selectedUniversities.length}/4)
          </h2>

          <div className="compare-selected-grid">
            {selectedUniversities.map(university => (
              <div key={university.id} className="compare-selected-card" data-testid={`card-selected-university-${university.id}`}>
                <button
                  onClick={() => removeUniversity(university.id)}
                  className="compare-selected-remove"
                  data-testid={`button-remove-university-${university.id}`}
                  aria-label={t('compare.remove.button')}
                >
                  <X className="h-4 w-4" />
                </button>
                <h3 className="compare-selected-name" data-testid={`text-university-name-${university.id}`}>
                  {language === 'ko' ? university.name : university.englishName}
                </h3>
                <p className="compare-selected-location" data-testid={`text-university-location-${university.id}`}>
                  {university.location}
                </p>
              </div>
            ))}

            {Array.from({ length: 4 - selectedUniversities.length }).map((_, index) => (
              <button
                key={index}
                className="compare-add-button"
                onClick={() => setShowAddModal(true)}
                data-testid={`button-add-slot-${index}`}
              >
                <Plus className="compare-add-icon h-8 w-8" />
                <span className="compare-add-text">{t('compare.add.button')}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedUniversities.length >= 2 && (
          <div className="compare-table-wrapper">
            <div style={{overflowX: 'auto'}}>
              <table className="compare-table" data-testid="table-comparison">
                <thead>
                  <tr>
                    <th style={{minWidth: '200px'}}>
                      {language === 'ko' ? '카테고리' : 'Category'}
                    </th>
                    {selectedUniversities.map(university => (
                      <th key={university.id} style={{textAlign: 'center', minWidth: '200px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                          <div style={{fontSize: '14px'}}>
                            {language === 'ko' ? university.name : university.englishName}
                          </div>
                          {language === 'ko' && (
                            <div style={{fontSize: '12px', opacity: 0.8}}>
                              {university.englishName}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {comparisonCategories.map(category => (
                    <React.Fragment key={category.title}>
                      <tr>
                        <td
                          colSpan={selectedUniversities.length + 1}
                          className="compare-table-category"
                          data-testid={`row-category-${category.title}`}
                        >
                          {category.title}
                        </td>
                      </tr>

                      {category.fields.map(field => (
                        <tr key={field.key}>
                          <td data-testid={`cell-label-${field.key}`}>
                            {field.label}
                          </td>
                          {selectedUniversities.map(university => (
                            <td key={university.id} style={{textAlign: 'center'}} data-testid={`cell-${field.key}-${university.id}`}>
                              {field.format(getNestedValue(university, field.key))}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedUniversities.length < 2 && (
          <div className="compare-empty" data-testid="container-empty-state">
            <BookOpen className="compare-empty-icon" />
            <h3 className="compare-empty-title" data-testid="text-empty-title">
              {t('compare.empty.title')}
            </h3>
            <p className="compare-empty-text" data-testid="text-empty-description">
              {t('compare.empty.description')}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="compare-empty-button"
              data-testid="button-add-university-empty"
            >
              <Plus className="h-5 w-5" />
              {t('compare.empty.action')}
            </button>
          </div>
        )}

        {showAddModal && (
          <div className="compare-search-modal" onClick={() => setShowAddModal(false)} data-testid="modal-add-university">
            <div className="compare-search-content" onClick={(e) => e.stopPropagation()}>
              <div className="compare-search-header">
                <h3 className="compare-search-title" data-testid="text-modal-title">{t('compare.search.title')}</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="compare-search-close"
                  data-testid="button-close-modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="compare-search-input-wrapper">
                <Search className="compare-search-icon h-5 w-5" />
                <input
                  type="text"
                  placeholder={t('compare.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="compare-search-input"
                  data-testid="input-search-universities"
                  autoFocus
                />
              </div>

              <div className="compare-search-results">
                {filteredUniversities.slice(0, 50).map(university => (
                  <button
                    key={university.id}
                    onClick={() => addUniversity(university)}
                    className="compare-search-item"
                    data-testid={`button-add-university-${university.id}`}
                  >
                    <div className="compare-search-item-name">
                      {language === 'ko' ? university.name : university.englishName}
                    </div>
                    <div className="compare-search-item-location">{university.location}</div>
                  </button>
                ))}

                {filteredUniversities.length === 0 && (
                  <p className="compare-empty-text" style={{textAlign: 'center', padding: '40px 0'}} data-testid="text-no-results">
                    {t('compare.search.no-results')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
