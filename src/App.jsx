import { useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingScreen from '@/components/LoadingScreen'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import ProjectsSection from '@/components/ProjectsSection'

const ProjectDetailPage = lazy(() => import('@/components/ProjectDetailPage'))

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsSection />
    </>
  )
}

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false)

  return (
    <>
      {/* Yuki Minimalist Loading Screen */}
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Dynamic Island Navbar */}
      <Navbar />

      {/* Main website stage */}
      <main
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#000000',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: '#000000',
              }}
            />
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}
