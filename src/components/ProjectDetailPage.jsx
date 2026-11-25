import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PROJECTS } from '@/data/projects'
import './ProjectDetailPage.css'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const project = PROJECTS.find((p) => p.id === id) || PROJECTS[0]

  const handleBack = () => {
    navigate('/')
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('scroll-stage-goto', { detail: { target: 'projects' } })
      )
    }, 100)
  }

  return (
    <article className="mag-page">
      {/* ── Top-Left Back Button ── */}
      <nav className="mag-top-nav">
        <button
          onClick={handleBack}
          className="mag-back-btn"
          aria-label="Back to projects"
        >
          <span className="mag-back-arrow">←</span>
          <span>Back</span>
        </button>
      </nav>

      {/* ── Main Magazine Editorial Content (No Lines, Airy Spacing) ── */}
      <div className="mag-container">
        {/* Header Block: Logo at Left, Title at Right */}
        <header className="mag-header">
          <div className="mag-title-block">
            {/* Logo Slot at Left */}
            {project.logo && (
              <div className="mag-logo-container">
                <img
                  src={project.logo}
                  alt={`${project.title} logo`}
                  className="mag-logo-image"
                />
              </div>
            )}

            {/* Title & Subtitle at Right */}
            <div className="mag-title-text-wrap">
              <span className="mag-issue-year">{project.year}</span>
              <h1 className="mag-title">{project.title}</h1>
              <p className="mag-subtitle">{project.subtitle}</p>

              {project.link && (
                <div className="mag-title-action">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mag-action-link"
                  >
                    <span>{project.linkLabel || 'Open Project'}</span>
                    <span className="mag-link-arrow">↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Magazine Content Grid: Main Article & Languages Sidebar */}
        <div className="mag-body-grid">
          {/* Main Column: Normal Text About The Project */}
          <section className="mag-main-text">
            <h2 className="mag-section-label">ABOUT</h2>
            <p className="mag-lead-paragraph">{project.about}</p>
            {project.details && (
              <p className="mag-secondary-paragraph">{project.details}</p>
            )}
          </section>

          {/* Sidebar Column: Languages & Details */}
          <aside className="mag-sidebar">
            <div className="mag-sidebar-section">
              <h3 className="mag-sidebar-label">LANGUAGES USED</h3>
              <ul className="mag-language-list">
                {project.languages.map((lang) => (
                  <li key={lang} className="mag-language-item">
                    {lang}
                  </li>
                ))}
              </ul>
            </div>

            {project.category && (
              <div className="mag-sidebar-section">
                <h3 className="mag-sidebar-label">CATEGORY</h3>
                <p className="mag-sidebar-val">{project.category}</p>
              </div>
            )}

            {project.status && (
              <div className="mag-sidebar-section">
                <h3 className="mag-sidebar-label">STATUS</h3>
                <p className="mag-sidebar-val">{project.status}</p>
              </div>
            )}

            {project.link && (
              <div className="mag-sidebar-section">
                <h3 className="mag-sidebar-label">LINK</h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mag-sidebar-link"
                >
                  <span>{project.linkLabel || 'Visit Link'}</span>
                  <span className="mag-link-arrow">↗</span>
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  )
}
