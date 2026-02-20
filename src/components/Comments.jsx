import { useState, useEffect } from 'react'
import { MessageSquare, User, Send, Clock, AlertCircle, Loader, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Comments() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Check admin role
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (data && (data.role === 'admin' || data.role === 'super_admin')) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }
    checkRole()
  }, [user])

  useEffect(() => {
    fetchComments()
    
    // Realtime subscription
    // IMPORTANT: Make sure 'Replication' is enabled for 'comments' table in Supabase Dashboard
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'comments' }, 
        (payload) => {
          // Avoid duplicate display if we manually added it
          setComments(current => {
              if (current.some(c => c.id === payload.new.id)) return current;
              return [payload.new, ...current];
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])


  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setComments(data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setErrorMsg('无法加载评论，请稍后再试: ' + (err.message || '网络错误'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return
    setErrorMsg('')
    setSubmitting(true)

    try {
const { data, error } = await supabase
        .from('comments')
        .insert([
          { 
            content: newComment, 
            user_id: user.id,
            user_email: user.email, 
            user_nickname: user.user_metadata?.nickname || '同学',
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) throw error
      
      if (data && data.length > 0) {
        const newCommentObj = data[0]
        setComments(current => {
          // Prevent duplicate if realtime also fires
          if (current.some(c => c.id === newCommentObj.id)) return current
          return [newCommentObj, ...current]
        })
      }
      
      setNewComment('')
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMsg('发送失败: ' + (err.message || '请检查 supabase RLS 策略或网络'))
    } finally {
      setSubmitting(false)
    }
  }

const handleDelete = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      
      setComments(current => current.filter(c => c.id !== commentId))
    } catch (err) {
      console.error('Delete error:', err)
      setErrorMsg('删除失败: ' + (err.message || '网络错误'))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const avatarColors = [
    'linear-gradient(135deg,#6366f1,#a855f7)',
    'linear-gradient(135deg,#0ea5e9,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#10b981,#0ea5e9)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#8b5cf6,#6366f1)',
  ]
  const getAvatarColor = (email = '') => avatarColors[email.charCodeAt(0) % avatarColors.length]

  // Render comment avatar
  const renderAvatar = (comment, size = 38) => {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: getAvatarColor(comment.user_email || ''),
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: size * 0.42 + 'px',
        flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
      }}>
        {typeof comment.user_email === 'string' ? comment.user_email[0].toUpperCase() : '?'}
      </div>
    )
  }

  // Render self avatar in sidebar
  const renderSelfAvatar = (size = 40) => {
    const emoji = user?.user_metadata?.avatar_emoji
    if (emoji) {
      return (
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: '#e0e7ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.55 + 'px', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>{emoji}</div>
      )
    }
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: getAvatarColor(user?.email || ''),
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: size * 0.42 + 'px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        {user?.email?.[0].toUpperCase()}
      </div>
    )
  }

  return (
    <div className="comments-section" style={{
      marginTop: '3rem',
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 8px 40px -8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-anim { animation: spin 1s linear infinite; }
        .comment-item { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .comment-delete-btn:hover { opacity: 1 !important; background: #fef2f2 !important; }
        .comments-layout { display: grid; grid-template-columns: 1fr 340px; min-height: 400px; }
        @media (max-width: 768px) { 
          .comments-layout { display: flex; flex-direction: column-reverse; } 
          .comments-sidebar { border-left: none !important; border-bottom: 1px solid #f1f5f9 !important; position: static !important; width: 100% !important; } 
        }
        .comment-card:hover { background: #f8fafc !important; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #f1f5f9',
        background: 'linear-gradient(to right, #fafbff, #f8fafc)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#6366f1,#a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MessageSquare size={18} color="white" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>留言板</h3>
        <span style={{
          fontSize: '0.8rem', background: '#e0e7ff', color: '#6366f1',
          padding: '2px 10px', borderRadius: '20px', fontWeight: '600'
        }}>
          {comments.length} 条留言
        </span>
      </div>

      {errorMsg && (
        <div style={{
          margin: '0 2rem', marginTop: '1rem',
          padding: '10px 14px',
          background: '#fee2e2', color: '#dc2626',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={15} /> {errorMsg}
        </div>
      )}

      <div className="comments-layout">
        {/* Left: comment list */}
        <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', maxHeight: '600px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8', gap: '12px' }}>
              <Loader className="spin-anim" size={28} />
              <span style={{ fontSize: '0.9rem' }}>加载留言中...</span>
            </div>
          ) : comments.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', color: '#94a3b8', gap: '12px' }}>
              <MessageSquare size={44} style={{ opacity: 0.15 }} />
              <p style={{ margin: 0, fontSize: '0.95rem' }}>还没有人发言，来抢个沙发吧！</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item comment-card" style={{
                  display: 'flex', gap: '12px',
                  padding: '14px 12px',
                  borderRadius: '14px',
                  transition: 'background 0.2s',
                }}>
                  {/* Avatar */}
                  {renderAvatar(comment, 38)}

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                          {comment.user_nickname || '同学'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.73rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <Clock size={11} /> {formatDate(comment.created_at)}
                      </span>
                    </div>

                    <p style={{
                      margin: 0,
                      color: '#334155',
                      fontSize: '0.92rem',
                      lineHeight: '1.65',
                      background: '#f1f5f9',
                      padding: '10px 14px',
                      borderRadius: '4px 14px 14px 14px',
                      wordBreak: 'break-word'
                    }}>
                      {comment.content}
                    </p>

                    {user && (isAdmin || user.id === comment.user_id) && (
                      <button
                        className="comment-delete-btn"
                        onClick={() => handleDelete(comment.id)}
                        style={{
                          background: 'none', border: 'none',
                          color: '#ef4444', cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          marginTop: '6px', opacity: 0.45,
                          transition: 'all 0.2s',
                          padding: '3px 8px', borderRadius: '6px'
                        }}
                      >
                        <Trash2 size={12} /> 删除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: input sidebar */}
        <div className="comments-sidebar" style={{
          borderLeft: '1px solid #f1f5f9',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          position: 'sticky', top: '80px', alignSelf: 'start',
          background: '#fafbff'
        }}>
          {user ? (
            <>
              {/* Self info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {renderSelfAvatar(40)}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.85rem' }}>
                    {user.user_metadata?.nickname || '同学'}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的留言..."
                  disabled={submitting}
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '2px solid #e2e8f0',
                    resize: 'none',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff',
                    color: '#334155',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: '1.6'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="send-btn"
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: newComment.trim() ? 'linear-gradient(135deg,#6366f1,#a855f7)' : '#e5e7eb',
                    color: 'white',
                    border: 'none',
                    cursor: newComment.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: '600', fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxShadow: newComment.trim() ? '0 4px 12px rgba(99,102,241,0.25)' : 'none'
                  }}
                >
                  {submitting ? <Loader className="spin-anim" size={18} /> : <Send size={18} />}
                  {submitting ? '发送中...' : '发表留言'}
                </button>
              </form>
            </>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '1rem',
              padding: '2rem 1rem', textAlign: 'center',
              flex: 1
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={26} color="#94a3b8" />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>加入讨论</p>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>登录后即可发表留言</p>
              </div>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                color: 'white', borderRadius: '100px',
                textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
              }}>
                <User size={16} /> 立即登录
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
