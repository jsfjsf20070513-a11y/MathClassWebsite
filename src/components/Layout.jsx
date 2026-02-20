import { useState } from 'react'
import { GraduationCap, User, Pencil, X, Check, Loader, Smile, Shield } from 'lucide-react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const EMOJIS = [
  '🐱','🐶','🐼','🐨','🦊','🐸','🐯','🦁',
  '🐮','🐷','🐙','🦄','🐧','🦅','🌸','🌊',
  '🔥','⭐','🎵','🎮','🚀','💎','🌙','🎯',
  '🍀','🎨','🏆','🌈','🍉','🦋','🎸','🧩',
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const nickname = user?.user_metadata?.nickname || user?.email?.split('@')[0]
  const avatarEmoji = user?.user_metadata?.avatar_emoji || ''

  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('nickname') // 'nickname' | 'avatar'
  const [newNickname, setNewNickname] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk] = useState(false)

  const openModal = (tab = 'nickname') => {
    setNewNickname(nickname || '')
    setSelectedEmoji(avatarEmoji || '')
    setSaveError('')
    setSaveOk(false)
    setActiveTab(tab)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    try {
      if (activeTab === 'nickname') {
        if (!newNickname.trim()) { setSaveError('昵称不能为空'); setSaving(false); return }
        const { error } = await supabase.auth.updateUser({ data: { nickname: newNickname.trim() } })
        if (error) throw error
      } else {
        if (!selectedEmoji) { setSaveError('请选择一个头像'); setSaving(false); return }
        const { error } = await supabase.auth.updateUser({ data: { avatar_emoji: selectedEmoji } })
        if (error) throw error
      }
      setSaveOk(true)
      setTimeout(() => { setModalOpen(false); setSaveOk(false) }, 900)
    } catch (e) {
      setSaveError(e.message || '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-container">
      {/* Profile modal */}
      {modalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeInBg 0.2s ease'
          }}
        >
          <style>{`
            @keyframes fadeInBg { from { opacity:0 } to { opacity:1 } }
            @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
            @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
            .emoji-btn:hover { transform:scale(1.2); background:#e0e7ff !important; }
          `}</style>
          <div style={{
            background: 'white', borderRadius: '24px',
            padding: '2rem', width: '100%', maxWidth: '440px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            animation: 'slideUp 0.25s ease'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>
                  {avatarEmoji || '👤'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>个人设置</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{nickname}</div>
                </div>
              </div>
              <button onClick={closeModal} style={{
                background: '#f1f5f9', border: 'none', borderRadius: '10px',
                width: '34px', height: '34px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
              }}><X size={16} /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem', gap: '4px' }}>
              {[{ key: 'nickname', icon: <Pencil size={14}/>, label: '修改昵称' }, { key: 'avatar', icon: <Smile size={14}/>, label: '选择头像' }].map(tab => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSaveError(''); setSaveOk(false) }} style={{
                  flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.key ? 'white' : 'transparent',
                  color: activeTab === tab.key ? '#6366f1' : '#64748b',
                  fontWeight: activeTab === tab.key ? '700' : '500',
                  fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}>{tab.icon}{tab.label}</button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'nickname' ? (
              <>
                <div style={{ marginBottom: '1rem', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                  当前昵称：<span style={{ fontWeight: '600', color: '#1e293b' }}>{nickname}</span>
                </div>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    autoFocus
                    type="text"
                    value={newNickname}
                    onChange={e => { setNewNickname(e.target.value); setSaveError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    placeholder="输入新昵称"
                    maxLength={20}
                    style={{
                      width: '100%', padding: '13px 50px 13px 42px',
                      borderRadius: '12px', border: '2px solid #e2e8f0',
                      fontSize: '1rem', outline: 'none',
                      boxSizing: 'border-box', transition: 'border-color 0.2s',
                      backgroundColor: '#f8fafc'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.backgroundColor = 'white' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                  />
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.73rem', color: '#cbd5e1' }}>{newNickname.length}/20</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  当前头像：<span style={{ fontSize: '1.4rem', marginLeft: '6px' }}>{selectedEmoji || avatarEmoji || '未设置'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', marginBottom: '1rem' }}>
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      className="emoji-btn"
                      onClick={() => { setSelectedEmoji(emoji); setSaveError('') }}
                      style={{
                        fontSize: '1.4rem', padding: '6px',
                        borderRadius: '10px', border: 'none', cursor: 'pointer',
                        background: selectedEmoji === emoji ? '#e0e7ff' : '#f8fafc',
                        transition: 'all 0.15s',
                        outline: selectedEmoji === emoji ? '2px solid #6366f1' : 'none'
                      }}
                    >{emoji}</button>
                  ))}
                </div>
              </>
            )}

            {saveError && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: '10px', fontSize: '0.85rem' }}>
                {saveError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                border: '1px solid #e2e8f0', background: 'white',
                color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '0.92rem'
              }}>取消</button>
              <button onClick={handleSave} disabled={saving || saveOk} style={{
                flex: 2, padding: '12px', borderRadius: '12px', border: 'none',
                background: saveOk ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#a855f7)',
                color: 'white', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
              }}>
                {saving ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> 保存中...</>
                  : saveOk ? <><Check size={16} /> 已保存！</> : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <GraduationCap className="nav-icon" />
            <span>2025级数学班</span>
          </Link>
          <div className="nav-links">
            <Link to="/">首页</Link>
            <Link to="/resources">资源推荐</Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => openModal('nickname')}
                  title="点击修改昵称或头像"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px 10px', borderRadius: '20px',
                    transition: 'background 0.2s', color: '#334155',
                    fontSize: '0.9rem', fontWeight: '500'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: avatarEmoji ? '#e0e7ff' : 'linear-gradient(135deg,#6366f1,#a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: avatarEmoji ? '1.1rem' : '0.8rem', fontWeight: '700', flexShrink: 0
                  }}>
                    {avatarEmoji || (nickname || '?')[0].toUpperCase()}
                  </div>
                  {nickname}
                  <Pencil size={11} style={{ color: '#94a3b8' }} />
                </button>
                <button
                  onClick={signOut}
                  style={{
                    background: 'none', border: '1px solid #e2e8f0',
                    padding: '5px 12px', borderRadius: '20px',
                    color: '#64748b', cursor: 'pointer', fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                >
                  退出
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={16} /> 登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/">班级信息</Link>
            <Link to="/">班级相册</Link>
            <Link to="/">通知公告</Link>
          </div>
          <p>&copy; 2026 中国人民大学（苏州校区）2025级数学班</p>
          <p className="icp">京ICP备2026003579号</p>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>🔒</span> 实名信息仅用于管理员核实身份，不对外公开，请放心填写。
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>🌐</span> 部分推荐网站（如 ArXiv、MIT OCW 等）在中国大陆访问可能需要科学上网。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
