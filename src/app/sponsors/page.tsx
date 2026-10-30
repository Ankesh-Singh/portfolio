import { sponsors } from '@/data/sponsors'
import SponsorsListClient from '@/components/SponsorsListClient'

export const metadata = {
  title: 'Sponsors | Ashirwad Singh',
  description: 'People who support my open source work',
}

export default function SponsorsPage() {
  return <SponsorsListClient sponsors={sponsors} />
}

