
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Camera, Calendar } from 'lucide-react'
import Comments from '../components/Comments'

export default function AlbumDetail() {
  const { id } = useParams()

  const albums = {
    1: {
      title: '苏州的秋天',
      date: '2025-11-21',
      description: '金秋十月，丹桂飘香。我们在苏州的街头巷尾，记录下了属于这个季节的色彩。',
      photos: [
        'https://images.unsplash.com/photo-1508182314998-a27960c03979?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
    },
    2: {
      title: '劳动实践',
      date: '2025-11-29',
      description: '劳动最光荣！全班同学一起参与校园清洁活动，虽然辛苦，但收获满满。',
      photos: [
        'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509653087866-91f6c2ab5ae8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530099486328-e021101a494a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
    },
    3: {
      title: '军训',
      date: '2025-08-25',
      description: '烈日下的汗水，是青春的勋章。难忘的军训时光。',
      photos: [
        'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
    },
    4: {
      title: '上海·班级团日活动',
      date: '2025-10-15',
      description: '参观一大旧址，重温红色记忆。',
      photos: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
    },
    5: {
      title: '苏州革命博物馆',
      date: '2025-09-20',
      description: '铭记历史，吾辈自强。',
      photos: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
    },
  }

  const album = albums[id]
  if (!album) return <div className="section-container">相册不存在</div>

  const { photos } = album

  // Render photo grid based on count
  const renderPhotos = () => {
    const imgStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 0.5s ease',
    }
    const wrapStyle = {
      overflow: 'hidden',
      borderRadius: '12px',
      background: '#e2e8f0',
    }

    if (photos.length === 1) {
      return (
        <div style={{ ...wrapStyle, height: '520px' }}>
          <img src={photos[0]} alt="photo-0" style={imgStyle} />
        </div>
      )
    }

    if (photos.length === 2) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '480px' }}>
          {photos.map((p, i) => (
            <div key={i} style={{ ...wrapStyle, height: '100%' }}>
              <img src={p} alt={`photo-${i}`} style={imgStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      )
    }

    if (photos.length === 3) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gridTemplateRows: '240px 240px', gap: '8px' }}>
          <div style={{ ...wrapStyle, gridRow: '1 / 3' }}>
            <img src={photos[0]} alt="photo-0" style={imgStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          {photos.slice(1).map((p, i) => (
            <div key={i} style={wrapStyle}>
              <img src={p} alt={`photo-${i + 1}`} style={imgStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      )
    }

    if (photos.length === 4) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '280px 220px', gap: '8px' }}>
          <div style={{ ...wrapStyle, gridColumn: '1 / 3' }}>
            <img src={photos[0]} alt="photo-0" style={imgStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          {photos.slice(1).map((p, i) => (
            <div key={i} style={wrapStyle}>
              <img src={p} alt={`photo-${i + 1}`} style={imgStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      )
    }

    // 5+ photos: masonry columns
    const col1 = photos.filter((_, i) => i % 2 === 0)
    const col2 = photos.filter((_, i) => i % 2 !== 0)
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {col1.map((p, i) => (
            <div key={i} style={{ ...wrapStyle, height: i === 0 ? '320px' : '220px' }}>
              <img src={p} alt={`photo-${i * 2}`} style={imgStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
          {col2.map((p, i) => (
            <div key={i} style={{ ...wrapStyle, height: i === col2.length - 1 ? '320px' : '220px' }}>
              <img src={p} alt={`photo-${i * 2 + 1}`} style={imgStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .album-detail-hero { position: relative; height: 420px; overflow: hidden; }
        .album-detail-hero img { width:100%; height:100%; object-fit:cover; }
        .album-detail-hero .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 60%, transparent 100%); }
        .album-detail-hero .meta { position:absolute; bottom:0; left:0; right:0; padding:2.5rem 3rem; color:white; }
      `}</style>

      {/* Hero banner */}
      <div className="album-detail-hero">
        <img src={photos[0]} alt={album.title} />
        <div className="overlay" />
        <div className="meta">
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.8)', textDecoration:'none', fontSize:'0.9rem', marginBottom:'1rem', transition:'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='white'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.8)'}
          >
            <ChevronLeft size={18} /> 返回首页
          </Link>
          <h1 style={{ margin:'0 0 0.5rem', fontSize:'2.4rem', fontWeight:'800', letterSpacing:'-0.5px', textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>{album.title}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', fontSize:'0.9rem', opacity:0.85 }}>
            <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Calendar size={15}/>{album.date}</span>
            <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Camera size={15}/>{photos.length} 张照片</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'3rem 2rem' }}>
        {/* Description */}
        <p style={{
          fontSize:'1.1rem', color:'#475569', lineHeight:'1.8',
          padding:'1.5rem 2rem', background:'#f8fafc',
          borderLeft:'4px solid var(--primary-color)',
          borderRadius:'0 12px 12px 0',
          marginBottom:'2.5rem'
        }}>
          {album.description}
        </p>

        {/* Photo layout */}
        <div style={{ marginBottom: '4rem' }}>
          {renderPhotos()}
        </div>

        {/* Comments */}
        <Comments />
      </div>
    </>
  )
}
