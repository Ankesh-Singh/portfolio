import { getDesignById } from '@/data/design'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProjectDetailClient from '@/components/ProjectDetailClient'
import { Project } from '@/types/project'

export const runtime = 'edge'

import { MasonryGrid } from '@/components/MasonryGrid'

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const design = getDesignById(id)

  if (!design) {
    return {
      title: 'Design Not Found',
    }
  }

  return {
    title: `${design.title} | Ashirwad Singh`,
    description: design.description,
    openGraph: {
      title: design.title,
      description: design.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: design.title,
      description: design.description,
    }
  }
}

export default async function DesignPage({ params }: Props) {
  const { id } = await params
  const design = getDesignById(id)

  if (!design) {
    notFound()
  }

  const projectLikeDesign: Project = {
    id: design.id,
    title: design.title,
    description: design.description,
    image: design.image,
    tags: [],
    category: design.category,
    variationCount: design.variations?.length || 0,
  }

  const variationsAsProjects: Project[] = (design.variations || []).map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    image: v.image,
    tags: [],
    category: v.category,
  }))

  return (
    <ProjectDetailClient project={projectLikeDesign} allProjects={[]} hrefPrefix="/design">
      {variationsAsProjects.length > 0 && (
        <div className="sm:px-12 py-2">
          <div className="px-4 mt-2 border-t border-neutral-300 dark:border-neutral-700 pt-8">
            <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] italic font-medium mb-6 text-neutral-900 dark:text-neutral-100 tracking-tight">
              variations
            </h2>
            <MasonryGrid projects={variationsAsProjects} hrefPrefix="/design" />
          </div>
        </div>
      )}
    </ProjectDetailClient>
  )
}
