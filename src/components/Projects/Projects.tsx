import * as m from 'framer-motion/m'
import { projects } from '../../data/projects'
import { Section } from '../Section/Section'
import styles from './Projects.module.css'

interface ProjectsProps {
  reducedMotion: boolean
}

export function Projects({ reducedMotion }: ProjectsProps) {
  return (
    <Section
      id="projects"
      title="Side projects"
      intro="Built in my own time, end to end — each one spec-first and shipped with the same AI-assisted workflow I use at work."
    >
      <ul className={styles.grid}>
        {projects.map((project, i) => (
          <m.li
            key={project.id}
            className={styles.card}
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            <span className={styles.when}>{project.when}</span>
            <h3 className={styles.name}>{project.name}</h3>
            <p className={styles.summary}>{project.summary}</p>
            <ul className={styles.highlights} aria-label="Highlights">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p className={styles.stack}>{project.stack}</p>
            <p className={styles.links}>
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="visually-hidden"> for {project.name} (opens in a new tab)</span>
                </a>
              ))}
            </p>
          </m.li>
        ))}
      </ul>
    </Section>
  )
}
