import { getPost } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'

export const runtime = 'edge'


type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const blog = await getPost(Number(id))

  if (!blog || blog.type !== 'blog') {
    return { title: 'Blog Post Not Found' }
  }

  return {
    title: `${blog.title || 'Blog'} | Ankesh Singh`,
    description: blog.title || 'Blog post',
    openGraph: {
      title: blog.title || 'Blog',
      description: blog.title || 'Blog post',
      type: 'article',
      images: blog.banner_url ? [blog.banner_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title || 'Blog',
      description: blog.title || 'Blog post',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params
  const blog = await getPost(Number(id))

  if (!blog || blog.type !== 'blog') {
    notFound()
  }

  if (blog.url) {
    redirect(blog.url)
  }

  notFound()
}
