import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, DollarSign, BookOpen, Filter, Grid2x2 as Grid, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DualRangeSlider } from '../components/DualRangeSlider';
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

// Mock university data
const universities: University[] = [
  {
    id: '1',
    name: '하버드 대학교',
    englishName: 'Harvard University',
    location: '메사추세츠 케임브리지',
    tuition: 54269,
    acceptanceRate: 5.4,
    satRange: '1460-1570',
    actRange: '33-35',
    image: 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '사립',
    size: '중간 (5,000-15,000)',
  },
  {
    id: '2',
    name: '스탠퍼드 대학교',
    englishName: 'Stanford University',
    location: '캘리포니아 스탠퍼드',
    tuition: 56169,
    acceptanceRate: 4.8,
    satRange: '1440-1570',
    actRange: '32-35',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '사립',
    size: '중간 (5,000-15,000)',
  },
  {
    id: '3',
    name: '메사추세츠 공과대학교',
    englishName: 'Massachusetts Institute of Technology (MIT)',
    location: '메사추세츠 케임브리지',
    tuition: 53790,
    acceptanceRate: 7.3,
    satRange: '1470-1570',
    actRange: '33-35',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '사립',
    size: '작음 (<5,000)',
  },
  {
    id: '4',
    name: '캘리포니아 대학교 버클리',
    englishName: 'University of California, Berkeley',
    location: '캘리포니아 버클리',
    tuition: 44007,
    acceptanceRate: 17.5,
    satRange: '1330-1530',
    actRange: '30-35',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '공립',
    size: '큼 (15,000+)',
  },
  {
    id: '5',
    name: '뉴욕 대학교',
    englishName: 'New York University (NYU)',
    location: '뉴욕 뉴욕',
    tuition: 53308,
    acceptanceRate: 21.1,
    satRange: '1350-1530',
    actRange: '30-34',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '사립',
    size: '큼 (15,000+)',
  },
  {
    id: '6',
    name: '펜실베이니아 주립대학교',
    englishName: 'Pennsylvania State University',
    location: '펜실베이니아 유니버시티 파크',
    tuition: 35514,
    acceptanceRate: 76.0,
    satRange: '1160-1360',
    actRange: '25-30',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '공립',
    size: '큼 (15,000+)',
  },
];

const UniversitiesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const itemsPerBatch = 12;
  const [filters, setFilters] = useState({
    types: [] as string[],
    sortBy: '',
    tuitionRange: [0, 70000] as [number, number],
    satRange: [800, 1600] as [number, number],
  });

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'sat-asc':
        const aSatMin = parseInt(a.satRange.split('-')[0]);
        const bSatMin = parseInt(b.satRange.split('-')[0]);
        return aSatMin - bSatMin;
      case 'sat-desc':
        const aSatMax = parseInt(a.satRange.split('-')[1]);
        const bSatMax = parseInt(b.satRange.split('-')[1]);
        return bSatMax - aSatMax;
      default:
        // Default/Recommended Sort: Prioritize universities with official logos
        // These schools typically have verified data and complete profiles
        // Schools with real logos from wikimedia or logos-world appear first
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
    setVisibleCount(12);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setVisibleCount(12);
  };

  const handleTuitionRangeChange = (range: [number, number]) => {
    // Ensure min doesn't exceed max and max doesn't go below min
    const [min, max] = range;
    const validRange: [number, number] = [
      Math.min(min, max),
      Math.max(min, max)
    ];
    setFilters(prev => ({ ...prev, tuitionRange: validRange }));
    setVisibleCount(12);
  };
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setVisibleCount(12);
  };

  const handleSatRangeChange = (range: [number, number]) => {
    // Ensure min doesn't exceed max and max doesn't go below min
    const [min, max] = range;
    const validRange: [number, number] = [
      Math.min(min, max),
      Math.max(min, max)
    ];
    setFilters(prev => ({ ...prev, satRange: validRange }));
    setVisibleCount(12);
  };

  // Infinite scroll: display only the visible items
  const visibleUniversities = sortedUniversities.slice(0, visibleCount);
  const hasMore = visibleCount < sortedUniversities.length;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setVisibleCount(prev => prev + itemsPerBatch);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isLoadingMore, itemsPerBatch]);

  return (
    <div className="universities-page">
      <div className="universities-container">
        <div className="universities-header">
          <h1 className="universities-title">
            대학 찾기
          </h1>
          <p className="universities-description">
            미국 대학을 둘러보고 나에게 맞는 학교를 찾아보세요.
          </p>
        </div>

        <div className="universities-controls">
          <div className="universities-search-row">
            <div className="universities-search-wrapper">
              <Search className="universities-search-icon h-5 w-5" />
              <input
                type="text"
                placeholder="이름 또는 지역으로 검색"
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
              <span className="universities-filters-title">필터</span>
            </div>

            <div className="universities-filters-content">
              <div className="universities-filter-group">
                <label className="universities-filter-label">소유 형태</label>
                <div className="universities-filter-buttons">
                  <button
                    onClick={() => handleTypeToggle('Private')}
                    className={`universities-filter-button ${filters.types.includes('Private') ? 'active' : ''}`}
                  >
                    사립
                  </button>
                  <button
                    onClick={() => handleTypeToggle('Public')}
                    className={`universities-filter-button ${filters.types.includes('Public') ? 'active' : ''}`}
                  >
                    공립
                  </button>
                </div>
              </div>

              <div className="universities-filter-group">
                <label className="universities-filter-label">정렬</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="universities-filter-select"
                >
                  <option value="">기본</option>
                  <option value="name-asc">알파벳순 (A–Z)</option>
                  <option value="name-desc">알파벳순 (Z–A)</option>
                  <option value="sat-asc">SAT 범위순 (오름차순)</option>
                  <option value="sat-desc">SAT 범위순 (내림차순)</option>
                </select>
              </div>

              <div className="universities-filter-group">
                <label className="universities-filter-label">
                  학비: ${filters.tuitionRange[0].toLocaleString()} - ${filters.tuitionRange[1].toLocaleString()}
                </label>
                <div className="px-2">
                  <DualRangeSlider
                    min={0}
                    max={70000}
                    step={1000}
                    value={filters.tuitionRange}
                    onChange={handleTuitionRangeChange}
                  />
                </div>
              </div>

              <div className="universities-filter-group">
                <label className="universities-filter-label">
                  SAT 범위: {filters.satRange[0]} - {filters.satRange[1]}
                </label>
                <div className="px-2">
                  <DualRangeSlider
                    min={800}
                    max={1600}
                    step={10}
                    value={filters.satRange}
                    onChange={handleSatRangeChange}
                  />
                </div>
              </div>
              </div>
            </div>
          </div>

        {/* Results Counter */}
        <div style={{
          marginBottom: '24px',
          padding: '12px 0',
          fontFamily: 'Wanted Sans Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
          fontSize: '15px',
          fontWeight: '600',
          color: '#082F49',
          letterSpacing: '-0.01em'
        }} data-testid="text-results-count">
          {language === 'ko' 
            ? `전체 ${universities.length}개 중 ${sortedUniversities.length}개 학교`
            : `Showing ${sortedUniversities.length} of ${universities.length} schools`
          }
        </div>

        <div className={viewMode === 'grid' ? 'universities-grid' : 'universities-list'}>
          {visibleUniversities.map(university => (
            viewMode === 'grid' ? (
              <Link
                key={university.id}
                to={`/university/${university.id}`}
                className="university-card"
              >
                <img
                  src={university.image}
                  alt={university.name}
                  className="university-card-image"
                />
                <div className="university-card-content">
                  <h3 className="university-card-title">{university.name}</h3>
                  <p className="university-card-subtitle">{university.englishName}</p>

                  <div className="university-card-location">
                    <MapPin className="h-4 w-4" />
                    <span>{university.location} • {university.type}</span>
                  </div>

                  <div className="university-card-stats">
                    <div className="university-card-stat">
                      <Users className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">합격률 {university.acceptanceRate}%</span>
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
                  alt={university.name}
                  className="university-list-image"
                />
                <div className="university-list-content">
                  <div className="university-list-header">
                    <h3 className="university-list-title">{university.name}</h3>
                    <p className="university-list-subtitle">{university.englishName}</p>
                    <div className="university-card-location" style={{marginTop: '8px'}}>
                      <MapPin className="h-4 w-4" />
                      <span>{university.location} • {university.type}</span>
                    </div>
                  </div>
                  <div className="university-list-stats">
                    <div className="university-card-stat">
                      <Users className="university-card-stat-icon h-4 w-4" />
                      <span className="university-card-stat-text">합격률 {university.acceptanceRate}%</span>
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
            <h3 className="universities-empty-title">해당되는 학교가 없습니다</h3>
            <p className="universities-empty-text">필터를 해제하고 다시 시도해보세요.</p>
            <button
              onClick={() => {
                setFilters({
                  types: [],
                  sortBy: '',
                  tuitionRange: [0, 70000],
                  satRange: [800, 1600]
                });
                setVisibleCount(12);
              }}
              className="universities-filter-button active" style={{marginTop: '16px'}}
            >
              필터 해제
            </button>
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        {hasMore && (
          <div 
            ref={sentinelRef}
            style={{
              height: '20px',
              margin: '40px 0'
            }}
          />
        )}

        {/* Loading Indicator */}
        {isLoadingMore && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            gap: '12px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #FACC15',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{
              fontFamily: 'Wanted Sans Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b'
            }}>
              {language === 'ko' ? '학교 불러오는 중...' : 'Loading more schools...'}
            </span>
          </div>
        )}

        {/* End of Results Message */}
        {!hasMore && sortedUniversities.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            fontFamily: 'Wanted Sans Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            color: '#9ca3af'
          }}>
            {language === 'ko' ? '모든 학교를 불러왔습니다' : 'All schools loaded'}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesPage;