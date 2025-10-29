import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, DollarSign, BookOpen, Filter, Grid2x2 as Grid, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import universitiesData from '../data/universities.json';
import './universities-page.css';

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
}

// Load real university data from JSON file
const universities: University[] = universitiesData as University[];

const UniversitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    types: [] as string[],
    sortBy: '',
    tuitionRange: [0, 60000] as [number, number],
    satRange: [800, 1600] as [number, number],
  });

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.types.length === 0 || filters.types.includes(uni.type);
    const matchesTuition = uni.tuition >= filters.tuitionRange[0] && uni.tuition <= filters.tuitionRange[1];
    
    // Parse SAT range (e.g., "1460-1570" -> [1460, 1570])
    const satParts = uni.satRange.split('-').map(s => parseInt(s.trim()));
    const uniSatMin = satParts[0] || 800;
    const uniSatMax = satParts[1] || 1600;
    const matchesSat = uniSatMax >= filters.satRange[0] && uniSatMin <= filters.satRange[1];

    return matchesSearch && matchesType && matchesTuition && matchesSat;
  });

  // Sort filtered universities
  const sortedUniversities = [...filteredUniversities].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name-asc':
        const nameA = language === 'ko' ? a.name : a.englishName;
        const nameB = language === 'ko' ? b.name : b.englishName;
        return nameA.localeCompare(nameB);
      case 'name-desc':
        const nameDescA = language === 'ko' ? a.name : a.englishName;
        const nameDescB = language === 'ko' ? b.name : b.englishName;
        return nameDescB.localeCompare(nameDescA);
      case 'sat-asc':
        const aSatMin = parseInt(a.satRange.split('-')[0]);
        const bSatMin = parseInt(b.satRange.split('-')[0]);
        return aSatMin - bSatMin;
      case 'sat-desc':
        const aSatMax = parseInt(a.satRange.split('-')[1]);
        const bSatMax = parseInt(b.satRange.split('-')[1]);
        return bSatMax - aSatMax;
      default:
        // Default: Show universities with real logos first
        const aHasLogo = a.image.includes('upload.wikimedia.org') || a.image.includes('logos-world.net');
        const bHasLogo = b.image.includes('upload.wikimedia.org') || b.image.includes('logos-world.net');
        if (aHasLogo && !bHasLogo) return -1;
        if (!aHasLogo && bHasLogo) return 1;
        // If both have logos or both don't, maintain original order
        return 0;
    }
  });

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleTuitionRangeChange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, tuitionRange: range }));
  };

  const handleSatRangeChange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, satRange: range }));
  };

  return (
    <div className="universities-page">
      <div className="universities-container">
        <div className="universities-header">
          <h1 className="universities-title">
            {t('universities.title')}
          </h1>
          <p className="universities-description">
            {t('universities.description')}
          </p>
        </div>

        <div className="universities-controls">
          <div className="universities-search-row">
            <div className="universities-search-wrapper">
              <Search className="universities-search-icon h-5 w-5" />
              <input
                type="text"
                placeholder={t('universities.search.placeholder')}
                className="universities-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="universities-view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`universities-view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`universities-view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="universities-filters">
            <div className="universities-filters-header">
              <Filter className="h-5 w-5" style={{color: '#082F49'}} />
              <span className="universities-filters-title">{t('universities.filter.title')}</span>
            </div>

            <div className="universities-filters-content">
              <div className="universities-filter-group">
                <label className="universities-filter-label">{t('universities.filter.type')}</label>
                <div className="universities-filter-buttons">
                  <button
                    onClick={() => handleTypeToggle('Private')}
                    className={`universities-filter-button ${filters.types.includes('Private') ? 'active' : ''}`}
                  >
                    {t('universities.filter.type.private')}
                  </button>
                  <button
                    onClick={() => handleTypeToggle('Public')}
                    className={`universities-filter-button ${filters.types.includes('Public') ? 'active' : ''}`}
                  >
                    {t('universities.filter.type.public')}
                  </button>
                </div>
              </div>

              <div className="universities-filter-group">
                <label className="universities-filter-label">{t('universities.filter.sort')}</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="universities-filter-select"
                >
                  <option value="">{t('universities.filter.sort.default')}</option>
                  <option value="name-asc">{t('universities.filter.sort.name-asc')}</option>
                  <option value="name-desc">{t('universities.filter.sort.name-desc')}</option>
                  <option value="sat-asc">{t('universities.filter.sort.sat-asc')}</option>
                  <option value="sat-desc">{t('universities.filter.sort.sat-desc')}</option>
                </select>
              </div>

              <div className="universities-filter-group">
                <label className="universities-filter-label">
                  {t('universities.filter.tuition')}: ${filters.tuitionRange[0].toLocaleString()} - ${filters.tuitionRange[1].toLocaleString()}
                </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="60000"
                      step="1000"
                      value={filters.tuitionRange[0]}
                      onChange={(e) => handleTuitionRangeChange([parseInt(e.target.value), filters.tuitionRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="60000"
                      step="1000"
                      value={filters.tuitionRange[1]}
                      onChange={(e) => handleTuitionRangeChange([filters.tuitionRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                    />
                  </div>
                </div>

              <div className="universities-filter-group">
                <label className="universities-filter-label">
                  {t('universities.filter.sat')}: {filters.satRange[0]} - {filters.satRange[1]}
                </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="800"
                      max="1600"
                      step="10"
                      value={filters.satRange[0]}
                      onChange={(e) => handleSatRangeChange([parseInt(e.target.value), filters.satRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <input
                      type="range"
                      min="800"
                      max="1600"
                      step="10"
                      value={filters.satRange[1]}
                      onChange={(e) => handleSatRangeChange([filters.satRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '24px'}}>
            <p className="universities-description">
              {t('universities.results').replace('{total}', universities.length.toString()).replace('{filtered}', sortedUniversities.length.toString())}
            </p>
          </div>

        <div className={viewMode === 'grid' ? 'universities-grid' : 'universities-list'}>
          {sortedUniversities.map(university => (
            viewMode === 'grid' ? (
              <Link
                key={university.id}
                to={`/university/${university.id}`}
                className="university-card"
              >
                <img
                  src={university.image}
                  alt={language === 'ko' ? university.name : university.englishName}
                  className="university-card-image"
                />
                <div className="university-card-content">
                  <h3 className="university-card-title">{language === 'ko' ? university.name : university.englishName}</h3>
                  {university.name !== university.englishName && (
                    <p className="university-card-subtitle">{language === 'ko' ? university.englishName : university.name}</p>
                  )}

                  <div className="university-card-location">
                    <MapPin className="h-4 w-4" />
                    <span>{university.location} • {university.type}</span>
                  </div>

                  <div className="university-card-stats">
                    <div className="university-card-stat">
                      <Users className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">{t('universities.acceptance')} {university.acceptanceRate}%</span>
                    </div>
                    <div className="university-card-stat">
                      <DollarSign className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">${university.tuition.toLocaleString()}</span>
                    </div>
                    <div className="university-card-stat">
                      <BookOpen className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">SAT: {university.satRange}</span>
                    </div>
                    <div className="university-card-stat">
                      <BookOpen className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">ACT: {university.actRange}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                key={university.id}
                to={`/university/${university.id}`}
                className="university-list-item"
              >
                <img
                  src={university.image}
                  alt={language === 'ko' ? university.name : university.englishName}
                  className="university-list-image"
                />
                <div className="university-list-content">
                  <div className="university-list-header">
                    <h3 className="university-list-title">{language === 'ko' ? university.name : university.englishName}</h3>
                    {university.name !== university.englishName && (
                      <p className="university-list-subtitle">{language === 'ko' ? university.englishName : university.name}</p>
                    )}
                    <div className="university-card-location" style={{marginTop: '8px'}}>
                      <MapPin className="h-4 w-4" />
                      <span>{university.location} • {university.type}</span>
                    </div>
                  </div>
                  <div className="university-list-stats">
                    <div className="university-card-stat">
                      <Users className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">{t('universities.acceptance')} {university.acceptanceRate}%</span>
                    </div>
                    <div className="university-card-stat">
                      <DollarSign className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">${university.tuition.toLocaleString()}</span>
                    </div>
                    <div className="university-card-stat">
                      <BookOpen className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">SAT: {university.satRange}</span>
                    </div>
                    <div className="university-card-stat">
                      <BookOpen className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">ACT: {university.actRange}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>

        {sortedUniversities.length === 0 && (
          <div className="universities-empty">
            <BookOpen className="universities-empty-icon" />
            <h3 className="universities-empty-title">{t('universities.empty.title')}</h3>
            <p className="universities-empty-text">{t('universities.empty.description')}</p>
            <button
              onClick={() => setFilters({
                types: [],
                sortBy: '',
                tuitionRange: [0, 60000],
                satRange: [800, 1600]
              })}
              className="universities-filter-button active" style={{marginTop: '16px'}}
            >
              {t('universities.empty.reset')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesPage;