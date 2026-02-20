import { Link } from 'react-router-dom'
import { ExternalLink, FileText, ChevronLeft, Star, BookOpen, Code2, BrainCircuit, TrendingUp } from 'lucide-react'

export default function Resources() {
  const categories = [
    {
      icon: <BrainCircuit size={20} />,
      label: '数学可视化 & 学习',
      color: '#6366f1',
      bg: '#eef2ff',
      sites: [
        { title: '3Blue1Brown', url: 'https://www.3blue1brown.com/', desc: 'Grant Sanderson 主理，用动画直觉讲解线性代数、微积分、神经网络，必看频道。', tag: '必看' },
        { title: 'Desmos Graphing Calculator', url: 'https://www.desmos.com/calculator', desc: '业界最好用的在线交互式图形计算器，适合函数探索与数学可视化。', tag: '工具' },
        { title: 'GeoGebra', url: 'https://www.geogebra.org/', desc: '全平台几何·代数·统计互动工具，可直接构建动态数学演示。', tag: '工具' },
        { title: 'Brilliant.org', url: 'https://brilliant.org/', desc: '面向问题驱动学习的 STEM 平台，注重数学思维而非死记硬背。', tag: '课程' },
        { title: 'Art of Problem Solving (AoPS)', url: 'https://artofproblemsolving.com/', desc: '竞赛数学圣地，AMC/AIME/USAMO 海量真题与论坛，全球竞赛生必备。', tag: '竞赛' },
        { title: "Paul's Online Math Notes", url: 'https://tutorial.math.lamar.edu/', desc: 'Paul Dawkins (Lamar University) 编写，微积分·线代·微差方程最清晰的免费讲义。', tag: '讲义' },
      ]
    },
    {
      icon: <Code2 size={20} />,
      label: '顶尖课程 & 公开课',
      color: '#0ea5e9',
      bg: '#e0f2fe',
      sites: [
        { title: 'MIT OpenCourseWare — Mathematics', url: 'https://ocw.mit.edu/search/?d=Mathematics', desc: 'MIT 全系列数学课程免费开放，涵盖实分析、拓扑、组合数学等前沿内容。', tag: 'MIT' },
        { title: 'Harvard CS50', url: 'https://cs50.harvard.edu/', desc: '哈佛最受欢迎的入门计算机课，David Malan 讲授，免费证书可认证。', tag: 'Harvard' },
        { title: 'Stanford CS229 — Machine Learning', url: 'https://cs229.stanford.edu/', desc: '斯坦福经典机器学习课，Andrew Ng 原班讲义与习题集全部公开。', tag: 'Stanford' },
        { title: 'Stanford CS221 — AI: Principles', url: 'https://stanford-cs221.github.io/autumn2024/', desc: '斯坦福人工智能总论，覆盖搜索、约束、概率推断、深度学习全景。', tag: 'Stanford' },
        { title: 'Khan Academy — Math', url: 'https://www.khanacademy.org/math', desc: '从算术到大学数学，完整自适应练习体系，零成本、无广告。', tag: '基础' },
        { title: 'fast.ai — Practical Deep Learning', url: 'https://course.fast.ai/', desc: 'Jeremy Howard 主理，从代码实践出发的深度学习课，反传统 top-down 方法论。', tag: 'AI' },
      ]
    },
    {
      icon: <TrendingUp size={20} />,
      label: '科研工具 & 前沿',
      color: '#10b981',
      bg: '#d1fae5',
      sites: [
        { title: 'ArXiv — Mathematics & CS', url: 'https://arxiv.org/', desc: '数学·CS·AI 领域预印本数据库，第一时间追踪最新研究成果。', tag: '科研' },
        { title: 'WolframAlpha', url: 'https://www.wolframalpha.com/', desc: '计算知识引擎，可符号积分、矩阵运算、统计分析，比计算器强百倍。', tag: '工具' },
        { title: 'Distill.pub', url: 'https://distill.pub/', desc: '用可交互可视化发表 ML 研究，是机器学习论文中最优雅的写作范本。', tag: 'ML' },
        { title: 'Two Minute Papers', url: 'https://www.youtube.com/@TwoMinutePapers', desc: 'Károly Zsolnai-Fehér 用2分钟解读最新 AI & 图形学论文，节奏极佳。', tag: '速览' },
      ]
    },
  ]

  const articles = [
    {
      title: 'But what is a neural network? | Chapter 1, Deep learning',
      author: '3Blue1Brown',
      date: '2017-10-05',
      tag: '可视化',
      url: 'https://www.youtube.com/watch?v=aircAruvnKk',
      desc: '用动画解释神经网络工作原理，是入门深度学习最好的第一课。'
    },
    {
      title: 'Transformers, explained: Understand the model behind GPT, BERT, and T5',
      author: 'Google — Dale Markowitz',
      date: '2021-08-31',
      tag: 'Transformer',
      url: 'https://daleonai.com/transformers-explained',
      desc: '直观解释 Transformer 架构的工作方式，无需深厚数学背景。'
    },
    {
      title: 'Attention Is All You Need (Original Paper)',
      author: 'Vaswani et al. — Google Brain',
      date: '2017-06-12',
      tag: '论文',
      url: 'https://arxiv.org/abs/1706.03762',
      desc: '彻底改变 NLP 领域的 Transformer 原始论文，现代 AI 的基石之一。'
    },
    {
      title: 'An Introduction to Statistical Learning (Free Textbook)',
      author: 'James, Witten, Hastie, Tibshirani — Stanford',
      date: '2023-01-01',
      tag: '教材',
      url: 'https://www.statlearning.com/',
      desc: '斯坦福统计学习权威教材，PDF 完全免费，数学和代码并重。'
    },
    {
      title: 'How GPT models work: accessible to everyone',
      author: 'Stephen Wolfram',
      date: '2023-02-14',
      tag: 'LLM',
      url: 'https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/',
      desc: 'Wolfram 从底层细节解释 ChatGPT 的工作原理，深入浅出，篇幅极长但值得。'
    },
    {
      title: 'The Matrix Calculus You Need For Deep Learning',
      author: 'Parr & Howard — fast.ai',
      date: '2018-07-05',
      tag: '数学',
      url: 'https://arxiv.org/abs/1802.01528',
      desc: '理解反向传播所需的矩阵微积分精华，fast.ai 团队出品，清晰严谨。'
    },
    {
      title: 'Visualizing Neural Networks with the Tensorflow Playground',
      author: 'TensorFlow Team — Google',
      date: '2016-04-12',
      tag: '互动',
      url: 'https://playground.tensorflow.org/',
      desc: '浏览器内实时训练神经网络，直观观察损失曲面与决策边界变化。'
    },
    {
      title: 'Mathematics for Machine Learning (Free Textbook)',
      author: 'Deisenroth, Faisal, Ong — Imperial & UCL',
      date: '2020-04-23',
      tag: '教材',
      url: 'https://mml-book.github.io/',
      desc: '覆盖 ML 所需线性代数、概率论、优化的完整数学教材，开放 PDF 下载。'
    },
  ]

  const tagColor = {
    '必看': '#ef4444', '工具': '#0ea5e9', '课程': '#8b5cf6', '竞赛': '#f59e0b',
    '讲义': '#10b981', 'MIT': '#6366f1', 'Harvard': '#dc2626', 'Stanford': '#b45309',
    '基础': '#64748b', 'AI': '#06b6d4', '科研': '#7c3aed', 'ML': '#0284c7',
    '速览': '#f97316', '可视化': '#10b981', 'Transformer': '#6366f1', '论文': '#64748b',
    '教材': '#8b5cf6', 'LLM': '#ec4899', '数学': '#0ea5e9', '互动': '#f59e0b',
  }

  const inputStyleBase = {
    padding: '6px 10px', borderRadius: '20px', fontSize: '0.72rem',
    fontWeight: '600', border: 'none', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '3rem 0 2rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            <ChevronLeft size={18} /> 返回首页
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: '800' }}>资源推荐 · Resources</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>精选全球顶尖数学 & AI 学习资源，持续更新</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              <span>{categories.reduce((a, c) => a + c.sites.length, 0)} 个网站</span>
              <span>·</span>
              <span>{articles.length} 篇文章</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Websites */}
        {categories.map((cat, ci) => (
          <section key={ci} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{cat.label}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {cat.sites.map((site, si) => (
                <a key={si} href={site.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'block', padding: '18px 20px',
                  background: 'white', borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`; e.currentTarget.style.borderColor = cat.color }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', lineHeight: '1.3' }}>{site.title}</span>
                    <span style={{ ...inputStyleBase, background: tagColor[site.tag] ? tagColor[site.tag] + '18' : '#f1f5f9', color: tagColor[site.tag] || '#64748b', flexShrink: 0 }}>{site.tag}</span>
                  </div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.83rem', lineHeight: '1.6' }}>{site.desc}</p>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', color: cat.color, fontSize: '0.78rem', fontWeight: '600' }}>
                    <ExternalLink size={12} /> 立即访问
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* Articles */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>精选文章 & 资源</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {articles.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{
                background: 'white', borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '12px',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafbff'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateX(0)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ ...inputStyleBase, background: tagColor[a.tag] ? tagColor[a.tag] + '18' : '#f1f5f9', color: tagColor[a.tag] || '#64748b' }}>{a.tag}</span>
                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{a.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={12} /> {a.author}</span>
                    <span>{a.date}</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.83rem', color: '#64748b', lineHeight: '1.5' }}>{a.desc}</p>
                </div>
                <ExternalLink size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

