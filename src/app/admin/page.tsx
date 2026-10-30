"use client";

import { useState, useRef, useEffect } from 'react';
import AdminGate from '@/components/admin/AdminGate';
import Analytics from '@/components/admin/Analytics';
import PostList from '@/components/admin/PostList';
import AddBlog from '@/components/admin/AddBlog';
import AddReading from '@/components/admin/AddReading';
import AddThought from '@/components/admin/AddThought';
import DateRangePickerModal from '@/components/admin/analytics/DateRangePickerModal';
import { DateRangeValue } from '@/components/admin/analytics/types';
import type { Post } from '@/lib/posts';
import { ChevronDown, LogOut, Calendar } from "lucide-react";

type Tab = 'analytics' | 'blog' | 'reading' | 'thought';
type SubTab = 'list' | 'create';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [subTab, setSubTab] = useState<SubTab>('list');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [rangeValue, setRangeValue] = useState<DateRangeValue>({
    type: 'preset',
    preset: '30d',
    label: 'Last 30 days',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const refreshPosts = () => {
    setRefreshKey((key) => key + 1);
    setEditingPost(null);
    setSubTab('list');
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    localStorage.removeItem('admin_authed_at');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  const contentTabs: Tab[] = ['blog', 'reading', 'thought'];
  const isContentTab = contentTabs.includes(activeTab);

  return (
    <AdminGate>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-zinc-800 pb-6">
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex bg-neutral-100 dark:bg-zinc-900 rounded-lg p-1 overflow-x-auto max-w-full">
                {(['analytics', 'blog', 'reading', 'thought'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSubTab('list'); setEditingPost(null); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'analytics' && (
                <div className="relative" ref={datePickerRef}>
                  <button
                    onClick={() => setShowDatePicker((prev) => !prev)}
                    className="flex items-center gap-2 bg-neutral-100 dark:bg-zinc-900 text-neutral-800 dark:text-zinc-200 border border-neutral-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Calendar size={14} className="opacity-70" />
                    <span>{rangeValue.label}</span>
                    <ChevronDown size={14} className="opacity-60" />
                  </button>

                  {showDatePicker && (
                    <div className="absolute right-0 mt-2 z-50">
                      <DateRangePickerModal
                        value={rangeValue}
                        onApply={(newVal) => setRangeValue(newVal)}
                        onClose={() => setShowDatePicker(false)}
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {isContentTab && (
            <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-zinc-800 pb-3 overflow-x-auto max-w-full">
              <button
                onClick={() => { setSubTab('list'); setEditingPost(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  subTab === 'list' && !editingPost
                    ? 'bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-sm border border-neutral-200/50 dark:border-transparent' 
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                All {activeTab}s
              </button>
              <button
                onClick={() => { setSubTab('create'); setEditingPost(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  subTab === 'create' || editingPost
                    ? 'bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-sm border border-neutral-200/50 dark:border-transparent' 
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {editingPost ? `Edit ${activeTab}` : '+ Create New'}
              </button>
            </div>
          )}

          <main>
            {activeTab === 'analytics' && <Analytics rangeValue={rangeValue} />}

            {activeTab === 'blog' && subTab === 'list' && (
              <PostList type="blog" refreshKey={refreshKey} />
            )}
            {activeTab === 'blog' && subTab === 'create' && (
              <AddBlog onAdd={refreshPosts} />
            )}

            {activeTab === 'reading' && !editingPost && subTab === 'list' && (
              <PostList
                type="reading"
                refreshKey={refreshKey}
                onEdit={(post) => {
                  setEditingPost(post);
                  setSubTab('create');
                }}
              />
            )}
            {activeTab === 'reading' && subTab === 'create' && (
              <AddReading
                onAdd={refreshPosts}
                initialPost={editingPost}
                onCancel={() => {
                  setEditingPost(null);
                  setSubTab('list');
                }}
              />
            )}

            {activeTab === 'thought' && subTab === 'list' && (
              <PostList type="thought" refreshKey={refreshKey} />
            )}
            {activeTab === 'thought' && subTab === 'create' && (
              <AddThought onAdd={refreshPosts} />
            )}
          </main>

        </div>
      </div>
    </AdminGate>
  );
}
