import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { StarIcon, CheckCircleIcon, PlusIcon, CloseIcon } from './Icons';

/**
 * ProductReviews Component
 * Complete ratings & reviews system with:
 * - Dynamic 5-star breakdown histogram
 * - Interactive rating filters (All, 5★, 4★, 3★, 2★, 1★)
 * - Sorting (Most Recent, Highest Rated, Lowest Rated, Most Helpful)
 * - Search within reviews
 * - Helpful upvote counter
 * - Verified Buyer Badge
 * - Interactive 5-star rating selector with hover states
 * - Elegant review submission form
 */
export const ProductReviews = ({ productId }) => {
  const { reviews = {}, addReview, upvoteReview, currentUser } = useStore();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState(currentUser?.name || '');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  // Filtering & Sorting State
  const [filterRating, setFilterRating] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest' | 'lowest' | 'helpful'
  const [searchQuery, setSearchQuery] = useState('');
  const [hasVoted, setHasVoted] = useState({});

  const productReviews = useMemo(() => {
    return reviews[productId] || [
      {
        id: 'rev-default-1',
        author: 'Julian Mercer',
        role: 'Architect, Stockholm',
        rating: 5,
        title: 'Exceptional craftsmanship and true anatomical comfort',
        comment: 'The cold-formed lasting makes an enormous difference. Zero break-in period and the calfskin has aged into a gorgeous subtle lustre.',
        date: '2 weeks ago',
        verified: true,
        helpfulCount: 14
      },
      {
        id: 'rev-default-2',
        author: 'Elena Rostova',
        role: 'Creative Director, Vienna',
        rating: 5,
        title: 'The cleanest low-top on the market',
        comment: 'No branding, perfectly balanced proportions, and the Margom outsole gives great tactile feedback.',
        date: '1 month ago',
        verified: true,
        helpfulCount: 9
      },
      {
        id: 'rev-default-3',
        author: 'Kaelen Voss',
        role: 'Industrial Designer, Berlin',
        rating: 4,
        title: 'Superior materials, size slightly slim',
        comment: 'Leather quality is on par with bespoke Italian benchmakers. Recommend sizing up half a size if you have broad feet.',
        date: '1 month ago',
        verified: true,
        helpfulCount: 6
      }
    ];
  }, [reviews, productId]);

  // Dynamic calculations
  const totalCount = productReviews.length;
  const avgRating = totalCount > 0
    ? (productReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: counts[star],
      pct: totalCount > 0 ? Math.round((counts[star] / totalCount) * 100) : 0
    }));
  }, [productReviews, totalCount]);

  // Filtered and Sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...productReviews];

    if (filterRating !== 'ALL') {
      const targetStar = Number(filterRating);
      list = list.filter(r => Math.round(r.rating) === targetStar);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.comment && r.comment.toLowerCase().includes(q)) ||
        (r.author && r.author.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }
    // Default 'newest' keeps default insertion order

    return list;
  }, [productReviews, filterRating, searchQuery, sortBy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview(productId, {
      id: 'rev-' + Date.now(),
      author: author.trim(),
      role: role.trim() || 'Verified Patron',
      rating,
      title: title.trim() || 'Exceptional Atelier Piece',
      comment: comment.trim(),
      date: 'Just now',
      verified: true,
      helpfulCount: 0
    });

    setAuthor(currentUser?.name || '');
    setRole('');
    setTitle('');
    setComment('');
    setRating(5);
    setIsWritingReview(false);
  };

  const handleUpvote = (revId) => {
    if (hasVoted[revId]) return;
    setHasVoted(prev => ({ ...prev, [revId]: true }));
    if (upvoteReview) {
      upvoteReview(productId, revId);
    }
  };

  return (
    <section style={{ marginTop: '54px', paddingTop: '40px', borderTop: '1px solid #e5e7eb' }}>
      {/* Reviews Header & Score Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '48px',
        alignItems: 'start',
        marginBottom: '36px'
      }}>
        {/* Left: Overall Score Card */}
        <div style={{
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
            VERIFIED PATRON REVIEWS
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0 6px 0' }}>
            <span style={{ fontSize: '3.25rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
              {avgRating}
            </span>
            <span style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: 600 }}>/ 5.0</span>
          </div>

          <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '8px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} size={20} filled={i <= Math.round(Number(avgRating))} />
            ))}
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '22px' }}>
            Based on {totalCount} verified atelier purchases.
          </div>

          <button
            type="button"
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="btn-primary"
            style={{
              width: '100%',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {isWritingReview ? (
              <>
                <CloseIcon size={14} />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <PlusIcon size={14} />
                <span>Write a Review</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Interactive Star Distribution Histogram */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
              Rating Distribution
            </span>
            {filterRating !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFilterRating('ALL')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear filter ({filterRating} Stars)
              </button>
            )}
          </div>

          {distribution.map((item) => (
            <button
              key={item.star}
              type="button"
              onClick={() => setFilterRating(filterRating === String(item.star) ? 'ALL' : String(item.star))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.75rem',
                border: 'none',
                background: filterRating === String(item.star) ? '#f3f4f6' : 'transparent',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'background-color 0.15s'
              }}
            >
              <span style={{ width: '50px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>{item.star}</span>
                <StarIcon size={12} filled={true} style={{ color: '#f59e0b' }} />
              </span>

              <div style={{
                flexGrow: 1,
                height: '8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${item.pct}%`,
                  height: '100%',
                  backgroundColor: filterRating === String(item.star) ? '#2563eb' : '#111827',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              <span style={{ width: '40px', textAlign: 'right', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Review Submission Form Modal / Card */}
      {isWritingReview && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #111827',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '40px',
            boxShadow: 'var(--shadow-card)',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Submit Your Patron Craftsmanship Review
            </h4>
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' }}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Interactive Star Rating Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              OVERALL RATING *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isHighlighted = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      type="button"
                      key={starVal}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      style={{
                        color: isHighlighted ? '#f59e0b' : '#d1d5db',
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                        transform: (hoverRating || rating) === starVal ? 'scale(1.15)' : 'scale(1)'
                      }}
                      title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                    >
                      <StarIcon size={26} filled={isHighlighted} />
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginLeft: '8px' }}>
                {rating === 5 ? '5 Stars — Masterpiece' :
                 rating === 4 ? '4 Stars — Highly Recommended' :
                 rating === 3 ? '3 Stars — Average Performance' :
                 rating === 2 ? '2 Stars — Below Expectation' : '1 Star — Poor Quality'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                YOUR FULL NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.8125rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                PATRON TITLE / LOCATION
              </label>
              <input
                type="text"
                placeholder="e.g. Architect, Kyoto"
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.8125rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              REVIEW HEADLINE
            </label>
            <input
              type="text"
              placeholder="e.g. Exceptional structural reduction and leather feel"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.8125rem', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              DETAILED OBSERVATIONS *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe materials, leather ageing, fit, ergonomics, and daily wear..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.8125rem', fontFamily: 'inherit', outline: 'none', lineHeight: 1.5 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              style={{ padding: '10px 18px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#4b5563' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.75rem', fontWeight: 800 }}
            >
              Publish Verified Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews Controls Toolbar: Search & Sort */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Rating filter pills */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setFilterRating('ALL')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: filterRating === 'ALL' ? '1.5px solid #111827' : '1px solid #e5e7eb',
                backgroundColor: filterRating === 'ALL' ? '#111827' : '#ffffff',
                color: filterRating === 'ALL' ? '#ffffff' : '#374151',
                cursor: 'pointer'
              }}
            >
              All ({totalCount})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterRating(String(s))}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: filterRating === String(s) ? '1.5px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: filterRating === String(s) ? '#111827' : '#ffffff',
                  color: filterRating === String(s) ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>{s}★</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              outline: 'none',
              minWidth: '160px'
            }}
          />
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
          <span style={{ color: '#6b7280', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      {displayedReviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#fafaf9',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 12px 0' }}>
            No reviews match your selected filter criteria.
          </p>
          <button
            type="button"
            onClick={() => { setFilterRating('ALL'); setSearchQuery(''); }}
            style={{
              fontSize: '0.75rem',
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Review Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Avatar circle */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {rev.author ? rev.author.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}>
                        {rev.author}
                      </span>
                      {rev.verified !== false && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          color: '#059669',
                          backgroundColor: '#ecfdf5',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid #a7f3d0'
                        }}>
                          <CheckCircleIcon size={11} />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    {rev.role && (
                      <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                        {rev.role}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {rev.date}
                </div>
              </div>

              {/* Star rating row */}
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} size={15} filled={i <= (rev.rating || 5)} />
                ))}
              </div>

              {/* Review Title */}
              {rev.title && (
                <h5 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.3 }}>
                  {rev.title}
                </h5>
              )}

              {/* Review Comment Body */}
              <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                {rev.comment}
              </p>

              {/* Helpfulness upvote action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingTop: '8px',
                borderTop: '1px solid #f3f4f6',
                marginTop: '4px'
              }}>
                <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                  Was this review helpful?
                </span>
                <button
                  type="button"
                  onClick={() => handleUpvote(rev.id)}
                  disabled={hasVoted[rev.id]}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: hasVoted[rev.id] ? '1px solid #10b981' : '1px solid #d1d5db',
                    backgroundColor: hasVoted[rev.id] ? '#ecfdf5' : '#ffffff',
                    color: hasVoted[rev.id] ? '#059669' : '#374151',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: hasVoted[rev.id] ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>👍</span>
                  <span>Yes ({rev.helpfulCount || (hasVoted[rev.id] ? 1 : 0)})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
