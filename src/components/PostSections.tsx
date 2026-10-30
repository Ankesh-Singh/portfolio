"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/cards/BlogCard";
import ReadingCard from "@/components/cards/ReadingCard";
import ThoughtCard from "@/components/cards/ThoughtCard";
import NeumorphButton from "@/components/NeumorphButton";
import type { Post, PostType } from "@/lib/posts";

type PostSectionProps = {
  type: PostType;
  title: string;
  limit?: number;
  viewAllHref?: string;
};

export function PostSection({ type, title, limit, viewAllHref }: PostSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`/api/posts?type=${type}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load posts");
        return res.json();
      })
      .then((data) => {
        if (active) setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [type]);

  const visiblePosts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="sm:px-12 py-2">
      <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
        <h2 className="text-base sm:text-xl opacity-20 font-[family-name:var(--font-instrument-serif)]">
          {title}
        </h2>
      </div>
      <div className="px-4">
        {loading ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading...</p>
        ) : visiblePosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 group">
            {visiblePosts.map((post, idx) => {
              if (type === "blog") return <BlogCard key={post.id} {...post} />;
              if (type === "reading") return <ReadingCard key={post.id} {...post} />;
              return <ThoughtCard key={post.id} index={idx + 1} {...post} />;
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No {title.toLowerCase()} yet.</p>
        )}
      </div>
      {viewAllHref && posts.length > 0 && (
        <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
          <Link href={viewAllHref}>
            <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
              <span>View All</span>
              <span>→</span>
            </NeumorphButton>
          </Link>
        </div>
      )}
    </div>
  );
}
