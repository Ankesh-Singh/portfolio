import { getPost } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ReadingDetailClient from '@/components/ReadingDetailClient'

export const runtime = 'edge'


type Props = {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(parseInt(id, 10))

  if (!post || post.type !== 'reading') {
    return { title: 'Reading Not Found' }
  }

  return {
    title: `${post.title}`,
    description: post.notes ? post.notes.substring(0, 160) : 'My reading notes',
  } 
}

export default async function ReadingPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(parseInt(id, 10))

  if (!post || post.type !== 'reading') {
    notFound()
  }

  return <ReadingDetailClient post={post} />
}
