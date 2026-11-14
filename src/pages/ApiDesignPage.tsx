import { NotesLayout } from '../components/Notes/NotesLayout'
import { apiDesignIntro, apiDesignSections } from '../data/apiDesign'

interface ApiDesignPageProps {
  section: string | null
  reducedMotion: boolean
}

export default function ApiDesignPage({ section, reducedMotion }: ApiDesignPageProps) {
  return (
    <NotesLayout
      path="/api-design"
      title="API design"
      intro={apiDesignIntro}
      sections={apiDesignSections}
      section={section}
      reducedMotion={reducedMotion}
    />
  )
}
