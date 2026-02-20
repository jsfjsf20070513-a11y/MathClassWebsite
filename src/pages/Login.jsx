import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User, CheckCircle2, Phone, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('') // New state via phone login
  
  // 新增：登录方式切换 ('email' | 'phone')
  const [loginMethod, setLoginMethod] = useState('email')

  // 新增：昵称字段
  const [nickname, setNickname] = useState('')
  // 新增：真实姓名
  const [realName, setRealName] = useState('')
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  
  // 新增：注册成功后的反馈状态
  const [showSuccess, setShowSuccess] = useState(false)
  
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    let finalEmail = email
    if (loginMethod === 'phone') {
      // 简单验证手机号格式（11位数字）
      if (!/^1\d{10}$/.test(phone)) {
        setMessage({ type: 'error', text: '请输入有效的11位手机号码' })
        setLoading(false)
        return
      }
      finalEmail = `${phone}@phone.local`
    } else {
        if (!email) {
            setMessage({ type: 'error', text: '请输入邮箱' })
            setLoading(false)
            return
        }
    }

    try {
      if (isSignUp) {
        if (!realName.trim()) {
          setMessage({ type: 'error', text: '请填写你的真实姓名' })
          setLoading(false)
          return
        }
        if (!nickname.trim()) {
          setMessage({ type: 'error', text: '请填写你的昵称' })
          setLoading(false)
          return
        }
        // 注册逻辑：将 nickname 和 realName 存入 user_metadata
        const { data, error } = await supabase.auth.signUp({
          email: finalEmail,
          password,
          options: {
            data: {
              nickname: nickname.trim(),
              real_name: realName.trim(),
              phone: loginMethod === 'phone' ? phone : null
            }
          }
        })
        if (error) throw error
        
        // 注册成功展示成功界面
        setShowSuccess(true)
        setTimeout(() => {
          // 如果不需要邮件确认，3秒后自动跳转；如果需要确认，这里可能要改逻辑
          if (data.session) navigate('/')
        }, 3000)

      } else {
        // 登录逻辑
        const { data, error } = await supabase.auth.signInWithPassword({
          email: finalEmail,
          password,
        })
        if (error) throw error
        
        // 登录成功也稍微展示一下
        setShowSuccess(true)
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || '操作失败，请重试' })
    } finally {
      if (!showSuccess) setLoading(false)
    }
  }

  // 如果注册/登录成功显示这部分 UI
  if (showSuccess) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={64} color="#16a34a" style={{ marginBottom: '1.5rem', display: 'inline-block' }} />
          <h2 style={{ color: '#166534', marginBottom: '1rem' }}>欢迎回来，{nickname || realName || '同学'}！</h2>
          <p style={{ color: '#64748b' }}>正在进入班级空间...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 180px)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '3rem 2.5rem', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '24px', 
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
        border: '1px solid white'
      }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--primary-color)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'white',
            boxShadow: '0 10px 20px -5px rgba(196, 30, 58, 0.3)'
          }}>
            <User size={32} strokeWidth={1.5} />
          </div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.8rem', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
            {isSignUp ? '加入班级' : '欢迎回来'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            {isSignUp ? '填写信息注册账号' : '使用邮箱登录'}
          </p>
        </div>
        
        {message && (
            <div style={{
                padding: '14px',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                color: message.type === 'error' ? '#ef4444' : '#16a34a',
                border: message.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div style={{width:'8px', height:'8px', background:'currentColor', borderRadius:'50%'}}></div>
                {message.text}
            </div>
        )}

        {/* 切换登录方式 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: loginMethod === 'email' ? 'rgba(196, 30, 58, 0.1)' : 'transparent',
              color: loginMethod === 'email' ? 'var(--primary-color)' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            <Mail size={16} /> 邮箱登录
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: loginMethod === 'phone' ? 'rgba(196, 30, 58, 0.1)' : 'transparent',
              color: loginMethod === 'phone' ? 'var(--primary-color)' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            <Phone size={16} /> 手机号登录
          </button>
        </div>

        <form onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>真实姓名 <span style={{color:'#ef4444'}}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 48px',
                      borderRadius: '14px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      backgroundColor: '#f8fafc'
                    }}
                    placeholder="例如：张三"
                    required
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.backgroundColor = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>昵称 <span style={{color:'#ef4444'}}>*</span> <span style={{fontWeight:400, color:'#94a3b8'}}>(同学们怎么称呼你)</span></label>
                <div style={{ position: 'relative' }}>
                  <User size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 48px',
                      borderRadius: '14px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      backgroundColor: '#f8fafc'
                    }}
                    placeholder="例如：小明"
                    required
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.backgroundColor = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '1.2rem' }}>
            {loginMethod === 'email' ? (
              <>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>邮箱</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '14px 14px 14px 48px', 
                      borderRadius: '14px', 
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      backgroundColor: '#f8fafc'
                    }} 
                    placeholder="name@example.com"
                    required={true}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.backgroundColor = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.backgroundColor = '#f8fafc'
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>手机号</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '14px 14px 14px 48px', 
                      borderRadius: '14px', 
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      backgroundColor: '#f8fafc'
                    }} 
                    placeholder="请输入手机号"
                    required
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.backgroundColor = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.backgroundColor = '#f8fafc'
                    }}
                  />
                </div>
              </>
            )}
          </div>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>密码</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 14px 14px 48px', 
                  borderRadius: '14px', 
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8fafc'
                }} 
                placeholder="至少 6 位字符"
                required
                minLength={6}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)'
                  e.target.style.backgroundColor = 'white'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.backgroundColor = '#f8fafc'
                }}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px',
              background: loading ? '#94a3b8' : 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '1.05rem', 
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.1s, background-color 0.2s, box-shadow 0.2s',
              boxShadow: loading ? 'none' : '0 10px 20px -5px rgba(196, 30, 58, 0.4)',
              
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'translateY(1px)')}
            onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
          >
            {loading ? '处理中...' : (isSignUp ? '立即注册' : '登录')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#64748b' }}>
            <span>{isSignUp ? '已有账号？' : '还没有账号？'}</span>
            {' '}
            <button 
                onClick={() => {
                    setIsSignUp(!isSignUp)
                    setMessage(null)
                    setNickname('')
                    setRealName('')
                }}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary-color)', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    padding: 0,
                    fontSize: 'inherit',
                    textDecoration: 'none'
                }}
            >
                {isSignUp ? '直接登录' : '创建新账号'}
            </button>
        </div>
      </div>
    </div>
  )
}
