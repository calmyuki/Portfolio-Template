import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '@/data/projects'
import './ProjectsSection.css'

export default function ProjectsSection() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        {/* Connected Collage of Different Shaped Boxes with Project Photos */}
        <div
          className={`connected-collage ${hoveredId ? 'has-hovered' : ''}`}
          onMouseLeave={() => setHoveredId(null)}
        >
          {PROJECTS.map((project) => {
            const isHovered = hoveredId === project.id

            return (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className={`collage-box box-${project.id} ${isHovered ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredId(project.id)}
                aria-label={`Open ${project.title} project details`}
              >
                {/* Real Project Banner Photo for projects with images */}
                {project.banner && (
                  <div className="box-media">
                    <img
                      src={project.banner}
                      alt={project.title}
                      className="box-image"
                      loading="lazy"
                    />
                    {(project.id === 'khwabon' || project.id === 'mellow-cafe') && (
                      <div className="box-overlay-dim" />
                    )}
                  </div>
                )}

                {/* Names written in text-only boxes (Websites, Mellow Ai, Birthdates) or overlay boxes (Khwabon, Mellow Cafe) */}
                {(!project.banner || project.id === 'khwabon' || project.id === 'mellow-cafe') && (
                  <div
                    className={`box-content ${
                      !project.banner ? 'box-content-text-only' : 'box-content-overlay'
                    }`}
                  >
                    <h3 className="box-title">{project.title}</h3>
                  </div>
                )}

                {/* Crisp Monochrome Highlight Frame */}
                <div className="box-border" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
