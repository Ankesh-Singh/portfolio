import { designs } from '@/data/design'
import DesignListClient from '@/components/DesignListClient'

export const metadata = {
  title: 'Design | Ashirwad Singh',
  description: 'Showcase of my design work',
}

export default function DesignPage() {
  return <DesignListClient designs={designs} />
}
