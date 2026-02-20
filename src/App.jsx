import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AlbumDetail from './pages/AlbumDetail'
import Resources from './pages/Resources'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="album/:id" element={<AlbumDetail />} />
          <Route path="resources" element={<Resources />} />
          <Route path="login" element={<Login />} />
        </Route>
        
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
