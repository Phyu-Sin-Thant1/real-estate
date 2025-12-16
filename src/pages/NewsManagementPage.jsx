import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { getDraft, saveDraft, clearDraft, addArticle, getArticles } from '../store/newsArticlesStore'

const STATUS_VARIANTS = {
  Draft: 'bg-slate-100 text-slate-600',
  Scheduled: 'bg-amber-100 text-amber-700',
  Published: 'bg-sky-100 text-sky-700',
  Archived: 'bg-slate-200 text-slate-500',
}

const CATEGORY_OPTIONS = ['Political', 'Health', 'Weather', 'General', 'Tech', 'Sport']
const FILTER_CATEGORIES = ['All', ...CATEGORY_OPTIONS]
const STATUS_TABS = ['All', 'Draft', 'Scheduled', 'Published', 'Archived']

const INITIAL_NEWS = [
  {
    id: 'news-01',
    title: 'Seoul Luxury Market Trends Q4 2025',
    category: 'General',
    author: 'Yavan Kim',
    date: '2025-11-08T09:00',
    status: 'Published',
    featured: true,
    thumbnail:
      'https://images.unsplash.com/photo-1473862170183-608bb1c46d91?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'news-02',
    title: 'Yangon Residential Zones Update',
    category: 'Political',
    author: 'Aung Thura',
    date: '2025-11-09T11:30',
    status: 'Draft',
    featured: false,
    thumbnail:
      'https://images.unsplash.com/photo-1529429617124-aee0a9d2a0aa?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'news-03',
    title: 'Typhoon readiness checklist for agents',
    category: 'Weather',
    author: 'Grace Lee',
    date: '2025-11-05T14:15',
    status: 'Scheduled',
    featured: true,
    thumbnail:
      'https://images.unsplash.com/photo-1520407396222-92734fb79275?auto=format&fit=crop&w=320&q=80',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Badge = ({ status }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
      STATUS_VARIANTS[status] || STATUS_VARIANTS.Draft
    )}
  >
    {status}
  </span>
)

const IconButton = ({ icon, label, tone = 'default', ...props }) => {
  const toneClasses = {
    default:
      'text-admin-muted hover:text-admin-primary border border-admin-border hover:border-admin-primary',
    danger:
      'text-admin-danger border border-admin-border hover:border-admin-danger/70 hover:bg-admin-danger/10',
  }

  return (
    <button
      type="button"
      className={classNames(
        'flex h-9 w-9 items-center justify-center rounded-full text-sm transition',
        toneClasses[tone]
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  )
}

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={classNames(
      'relative flex h-6 w-11 items-center rounded-full transition-colors',
      checked ? 'bg-admin-primary' : 'bg-slate-300'
    )}
  >
    <span
      className={classNames(
        'absolute left-1 h-4 w-4 rounded-full bg-white shadow transition-transform',
        checked && 'translate-x-[20px]'
      )}
    />
  </button>
)

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border/70 bg-white px-10 py-16 text-center shadow-sm">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-admin-accent/60 text-3xl">
      📄
    </div>
    <h3 className="mt-6 text-lg font-semibold text-slate-900">No news yet</h3>
    <p className="mt-2 text-sm text-admin-muted">
      Create your first article to keep your audience updated across KR/MM/EN.
    </p>
    <button
      onClick={onCreate}
      className="mt-6 rounded-full bg-admin-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-admin-primary-hover"
    >
      Create News
    </button>
  </div>
)

const Toast = ({ tone = 'info', title, description, onDismiss }) => {
  const map = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    info: 'border-sky-300 bg-sky-50 text-sky-700',
    danger: 'border-rose-300 bg-rose-50 text-rose-700',
  }

  return (
    <div
      className={classNames(
        'flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/10',
        map[tone]
      )}
    >
      <span className="mt-1 text-lg">•</span>
      <div className="flex-1 text-sm">
        <p className="font-semibold">{title}</p>
        {description && <p className="mt-1 text-xs opacity-80">{description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="text-xs font-semibold uppercase tracking-wide opacity-60 hover:opacity-100"
      >
        Close
      </button>
    </div>
  )
}

const Modal = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur">
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/30">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-admin-border bg-white p-2 text-admin-muted hover:text-admin-primary"
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex items-center gap-2 rounded-full bg-admin-accent/60 p-1 text-sm">
    {tabs.map((tab) => {
      const cleanTab = tab.replace(' ✓', '')
      const isActive = active === cleanTab || active === tab
      return (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={classNames(
            'rounded-full px-4 py-1.5 font-semibold transition',
            isActive
              ? 'bg-white text-admin-primary shadow'
              : 'text-admin-muted hover:bg-white/60'
          )}
        >
          {tab}
        </button>
      )
    })}
  </div>
)

const CreateArticleModal = ({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  onPublish,
  setActiveTab,
  activeTab,
  error,
}) => {
  const [previewMode, setPreviewMode] = useState(false)
  const debounceTimerRef = useRef(null)

  // Load draft on mount
  useEffect(() => {
    if (open) {
      const savedDraft = getDraft()
      if (savedDraft) {
        setFormData(savedDraft)
      }
    }
  }, [open, setFormData])

  // Debounced draft save
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      
      // Save draft after 400ms delay
      debounceTimerRef.current = setTimeout(() => {
        saveDraft(updated)
      }, 400)
      
      return updated
    })
  }, [setFormData])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Word count helper
  const getWordCount = (text) => {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Simple markdown preview (basic rendering)
  const renderPreview = (content) => {
    if (!content) return <p className="text-gray-400 italic">No content yet...</p>
    
    // Basic markdown-like rendering
    return (
      <div className="prose prose-sm max-w-none">
        {content.split('\n').map((line, idx) => {
          if (line.trim().startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>
          }
          if (line.trim().startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold mt-3 mb-2">{line.replace('## ', '')}</h2>
          }
          if (line.trim().startsWith('### ')) {
            return <h3 key={idx} className="text-lg font-bold mt-2 mb-1">{line.replace('### ', '')}</h3>
          }
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            return <li key={idx} className="ml-4">{line.replace(/^[-*] /, '')}</li>
          }
          if (line.trim() === '') {
            return <br key={idx} />
          }
          return <p key={idx} className="mb-2">{line}</p>
        })}
      </div>
    )
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex h-[85vh] flex-col">
        <header className="border-b border-admin-border/60 px-8 py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-admin-muted">
            News
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Create New Article</h2>
              <p className="mt-1 text-sm text-admin-muted">
                Write and publish latest news and updates.
              </p>
            </div>
            <Tabs
              tabs={[
                formData.title && formData.category ? 'Info ✓' : 'Info',
                formData.content?.trim() ? 'Content ✓' : 'Content',
                'SEO',
                'Publish'
              ]}
              active={activeTab}
              onChange={(tab) => {
                // Remove checkmark for tab switching
                const cleanTab = tab.replace(' ✓', '')
                setActiveTab(cleanTab)
              }}
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <section className={classNames(activeTab !== 'Info' && 'hidden')}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                    Title
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                    placeholder="Type the headline"
                    value={formData.title}
                    onChange={(event) => handleChange('title', event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                    Category
                  </label>
                  <select
                    className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                    value={formData.category}
                    onChange={(event) => handleChange('category', event.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                    Author
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                    value={formData.author}
                    onChange={(event) => handleChange('author', event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                    Cover Image
                  </label>
                  <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border/70 bg-admin-accent/40 px-4 py-12 text-center">
                    {formData.thumbnail ? (
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="h-32 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-admin-primary">
                          ⬆️
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          Upload cover image
                        </p>
                        <p className="mt-1 text-xs text-admin-muted">
                          JPG, PNG up to 3MB. Recommended 1200×628px.
                        </p>
                      </>
                    )}
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-admin-primary px-4 py-2 text-xs font-semibold text-white hover:bg-admin-primary-hover">
                      Browse files
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = () => handleChange('thumbnail', reader.result)
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-white px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Featured article</p>
                    <p className="text-xs text-admin-muted">
                      Highlight on homepage and newsletters.
                    </p>
                  </div>
                  <Toggle
                    checked={formData.featured}
                    onChange={() => handleChange('featured', !formData.featured)}
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-6 rounded-xl border border-admin-danger/40 bg-admin-danger/10 px-4 py-3 text-sm font-semibold text-admin-danger">
                {error}
              </p>
            )}
          </section>

          <section className={classNames(activeTab !== 'Content' && 'hidden')}>
            <div className="space-y-5">
              {/* Short Summary */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Short Summary
                  <span className="ml-2 text-xs font-normal normal-case text-admin-muted">
                    (200-300 chars recommended)
                  </span>
                </label>
                <textarea
                  className="mt-2 h-24 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base leading-relaxed focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                  placeholder="Brief summary of the article..."
                  value={formData.summary || ''}
                  onChange={(event) => handleChange('summary', event.target.value)}
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-admin-muted">
                  {formData.summary?.length || 0} / 500 characters
                </p>
              </div>

              {/* Body Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                    Body Content
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-admin-muted">
                      {getWordCount(formData.content || '')} words
                    </span>
                    <div className="flex items-center gap-2 rounded-lg border border-admin-border bg-white p-1">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={classNames(
                          'rounded-md px-3 py-1 text-xs font-semibold transition',
                          !previewMode
                            ? 'bg-admin-primary text-white'
                            : 'text-admin-muted hover:bg-admin-accent'
                        )}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={classNames(
                          'rounded-md px-3 py-1 text-xs font-semibold transition',
                          previewMode
                            ? 'bg-admin-primary text-white'
                            : 'text-admin-muted hover:bg-admin-accent'
                        )}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
                
                {previewMode ? (
                  <div className="mt-2 min-h-[400px] w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base leading-relaxed">
                    {renderPreview(formData.content || '')}
                  </div>
                ) : (
                  <textarea
                    className="mt-2 min-h-[400px] w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base leading-relaxed focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10 font-mono"
                    placeholder="Write the article... Supports Markdown"
                    value={formData.content || ''}
                    onChange={(event) => handleChange('content', event.target.value)}
                  />
                )}
                <p className="mt-2 text-xs text-admin-muted">
                  Supports Markdown formatting (headers, lists, etc.)
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Tags
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                  placeholder="market, trends, real estate"
                  value={formData.tags || ''}
                  onChange={(event) => handleChange('tags', event.target.value)}
                />
                <p className="mt-2 text-xs text-admin-muted">
                  Separate tags with commas to improve internal search.
                </p>
              </div>
            </div>
          </section>

          <section className={classNames(activeTab !== 'SEO' && 'hidden')}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Meta title
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                  value={formData.metaTitle}
                  onChange={(event) => handleChange('metaTitle', event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Slug
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                  value={formData.slug}
                  onChange={(event) => handleChange('slug', event.target.value)}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                Meta description
              </label>
              <textarea
                className="mt-2 h-32 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base leading-relaxed focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                value={formData.metaDescription}
                onChange={(event) => handleChange('metaDescription', event.target.value)}
              />
            </div>
          </section>

          <section className={classNames(activeTab !== 'Publish' && 'hidden')}>
            <div className="space-y-6">
              <div className="rounded-2xl border border-admin-border bg-white px-4 py-5">
                <p className="text-sm font-semibold text-slate-900">Publish status</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {['Draft', 'Scheduled', 'Published'].map((status) => (
                    <label
                      key={status}
                      className={classNames(
                        'flex cursor-pointer items-start gap-3 rounded-xl border border-admin-border/70 bg-admin-accent/40 px-4 py-4 text-sm text-slate-800 transition hover:border-admin-primary',
                        formData.status === status && 'border-admin-primary bg-white shadow'
                      )}
                    >
                      <input
                        type="radio"
                        name="publish-status"
                        className="mt-1 h-4 w-4"
                        value={status}
                        checked={formData.status === status}
                        onChange={(event) => handleChange('status', event.target.value)}
                      />
                      <div>
                        <p className="font-semibold">{status}</p>
                        <p className="text-xs text-admin-muted">
                          {status === 'Draft' && 'Keep editing before releasing.'}
                          {status === 'Scheduled' && 'Pick a date & time to auto-publish.'}
                          {status === 'Published' && 'Go live immediately on all channels.'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {formData.status === 'Scheduled' && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
                    Schedule publish date & time
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-2 w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-base focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                    value={formData.scheduleAt}
                    onChange={(event) => handleChange('scheduleAt', event.target.value)}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
        <footer className="flex flex-col gap-3 border-t border-admin-border/60 bg-slate-50/70 px-8 py-5 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-admin-muted">
            {formData.status === 'Published'
              ? 'Publishing makes the article visible immediately.'
              : 'Save your progress as draft or schedule later.'}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full border border-admin-border bg-white px-5 py-2 text-sm font-semibold text-admin-muted hover:bg-admin-accent"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-full border border-admin-border bg-white px-5 py-2 text-sm font-semibold text-admin-muted hover:bg-admin-accent"
              onClick={onSave}
            >
              Save Draft
            </button>
            <button
              className={classNames(
                'rounded-full px-5 py-2 text-sm font-semibold text-white transition',
                formData.title && formData.category && formData.author && formData.content?.trim()
                  ? 'bg-admin-primary hover:bg-admin-primary-hover'
                  : 'bg-gray-400 cursor-not-allowed'
              )}
              onClick={onPublish}
              disabled={!formData.title || !formData.category || !formData.author || !formData.content?.trim()}
            >
              Publish
            </button>
          </div>
        </footer>
      </div>
    </Modal>
  )
}

const ConfirmDeleteModal = ({ open, onClose, onConfirm, title }) => (
  <Modal open={open} onClose={onClose}>
    <div className="w-full max-w-md rounded-2xl bg-white p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-admin-danger/10 text-2xl text-admin-danger">
        🗑️
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">Delete News Article?</h3>
      <p className="mt-3 text-sm text-admin-muted">
        Are you sure you want to delete ‘{title || 'Selected articles'}’? This action cannot be
        undone.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          className="rounded-full border border-admin-border bg-white px-5 py-2 text-sm font-semibold text-admin-muted hover:bg-admin-accent"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-full bg-admin-danger px-5 py-2 text-sm font-semibold text-white hover:bg-admin-danger/90"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
)

const NewsManagementPage = () => {
  // Load articles from localStorage on mount
  const [newsItems, setNewsItems] = useState(() => {
    const storedArticles = getArticles()
    return storedArticles.length > 0 ? storedArticles : INITIAL_NEWS
  })
  const [selected, setSelected] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Info')
  const [formData, setFormData] = useState(() => ({
    title: '',
    category: '',
    author: 'Yavan Kim',
    thumbnail: '',
    featured: false,
    summary: '',
    content: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'Draft',
    scheduleAt: '',
  }))
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesStatus && matchesSearch
    })
  }, [newsItems, categoryFilter, statusFilter, searchTerm])

  const isAllSelected = filteredNews.length > 0 && selected.length === filteredNews.length

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      author: 'Yavan Kim',
      thumbnail: '',
      featured: false,
      summary: '',
      content: '',
      tags: '',
      metaTitle: '',
      metaDescription: '',
      slug: '',
      status: 'Draft',
      scheduleAt: '',
    })
    setActiveTab('Info')
    setError('')
    clearDraft()
  }

  const handleOpenCreate = () => {
    resetForm()
    setCreateOpen(true)
  }

  const handleCloseCreate = () => {
    setCreateOpen(false)
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required to create a news article.')
      setActiveTab('Info')
      return false
    }
    if (!formData.category) {
      setError('Please choose a category before proceeding.')
      setActiveTab('Info')
      return false
    }
    if (!formData.author.trim()) {
      setError('Author is required to create a news article.')
      setActiveTab('Info')
      return false
    }
    if (!formData.content || !formData.content.trim()) {
      setError('Content is required to publish an article.')
      setActiveTab('Content')
      return false
    }
    setError('')
    return true
  }

  const upsertArticle = (statusOverride) => {
    // For drafts, skip content validation
    if (statusOverride !== 'Draft' && !validateForm()) return
    // For drafts, still validate title and category
    if (statusOverride === 'Draft') {
      if (!formData.title.trim()) {
        setError('Title is required to save a draft.')
        setActiveTab('Info')
        return
      }
      if (!formData.category) {
        setError('Please choose a category before saving.')
        setActiveTab('Info')
        return
      }
      setError('')
    }

    const status = statusOverride || formData.status || 'Draft'
    const now = new Date()
    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const newArticle = {
      id: `news-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      author: formData.author || 'TOFU Admin',
      summary: formData.summary || '',
      content: formData.content || '',
      tags: formData.tags || '',
      date: formData.scheduleAt || now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status,
      featured: formData.featured,
      thumbnail:
        formData.thumbnail ||
        'https://images.unsplash.com/photo-1529429617124-aee0a9d2a0aa?auto=format&fit=crop&w=320&q=80',
      slug,
      seoTitle: formData.metaTitle || '',
      seoDescription: formData.metaDescription || '',
    }

    // Save to localStorage store
    addArticle(newArticle)
    
    // Update local state
    setNewsItems((prev) => [newArticle, ...prev])
    
    // Clear draft on publish
    if (status === 'Published') {
      clearDraft()
    }
    
    setCreateOpen(false)
    setToast({
      tone: status === 'Published' ? 'success' : 'info',
      title:
        status === 'Published'
          ? 'News article published successfully!'
          : 'Draft saved successfully!',
      description: status === 'Published' ? undefined : 'You can publish the article anytime.',
    })
    resetForm()
  }

  const handleBulkDelete = () => {
    if (selected.length === 0) return
    setDeleteTarget(null)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    setNewsItems((prev) =>
      prev.filter((item) => {
        if (deleteTarget) return item.id !== deleteTarget
        return !selected.includes(item.id)
      })
    )
    setSelected([])
    setDeleteModalOpen(false)
    setDeleteTarget(null)
    setToast({
      tone: 'info',
      title: 'Deleted successfully.',
    })
  }

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected([])
    } else {
      setSelected(filteredNews.map((item) => item.id))
    }
  }

  const handleFeaturedToggle = (id) => {
    setNewsItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item))
    )
  }

  const renderDesktopTable = () => (
    <div className="hidden rounded-2xl border border-admin-border/70 bg-white shadow-sm md:block">
      <table className="min-w-full divide-y divide-admin-border/70">
        <thead className="sticky top-0 bg-white">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-admin-muted">
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-admin-border text-admin-primary focus:ring-admin-primary"
                checked={isAllSelected}
                onChange={toggleAll}
              />
            </th>
            <th className="px-3 py-3">Thumbnail</th>
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Category</th>
            <th className="px-3 py-3">Author</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Featured</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border/70 text-sm text-slate-700">
          {filteredNews.map((item) => (
            <tr
              key={item.id}
              className={classNames(
                'transition-colors hover:bg-admin-accent/40',
                selected.includes(item.id) && 'bg-admin-accent/60'
              )}
            >
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-admin-border text-admin-primary focus:ring-admin-primary"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                />
              </td>
              <td className="px-3 py-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-14 w-20 rounded-lg object-cover"
                />
              </td>
              <td className="px-3 py-4">
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-xs text-admin-muted">{item.slug || '—'}</div>
              </td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.category}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.author}</td>
              <td className="px-3 py-4 text-sm text-slate-600">
                {new Date(item.date).toLocaleString()}
              </td>
              <td className="px-3 py-4">
                <Badge status={item.status} />
              </td>
              <td className="px-3 py-4">
                <Toggle checked={item.featured} onChange={() => handleFeaturedToggle(item.id)} />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <IconButton icon="✏️" label="Edit article" />
                  <IconButton icon="👁️" label="Preview article" />
                  <IconButton
                    icon="🗑️"
                    label="Delete article"
                    tone="danger"
                    onClick={() => {
                      setDeleteTarget(item.id)
                      setDeleteModalOpen(true)
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border/70 px-4 py-4 text-sm text-admin-muted">
        <div>
          Showing <strong className="text-slate-900">{filteredNews.length}</strong> of{' '}
          <strong className="text-slate-900">{newsItems.length}</strong> articles
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-admin-border px-3 py-2 text-xs font-semibold hover:bg-admin-accent">
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={classNames(
                  'h-8 w-8 rounded-lg text-xs font-semibold',
                  page === 1
                    ? 'bg-admin-primary text-white'
                    : 'border border-admin-border text-admin-muted hover:bg-admin-accent'
                )}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-admin-border px-3 py-2 text-xs font-semibold hover:bg-admin-accent">
            Next
          </button>
        </div>
      </div>
    </div>
  )

  const renderMobileCards = () => (
    <div className="grid gap-4 md:hidden">
      {filteredNews.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-admin-border/70 bg-white p-4 text-sm shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">{item.title}</div>
              <div className="mt-1 text-xs text-admin-muted">{item.category}</div>
              <div className="mt-1 text-xs text-admin-muted">
                {new Date(item.date).toLocaleDateString()}
              </div>
              <div className="mt-2">
                <Badge status={item.status} />
              </div>
            </div>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-16 w-16 rounded-xl object-cover"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Toggle checked={item.featured} onChange={() => handleFeaturedToggle(item.id)} />
            <div className="flex items-center gap-2">
              <IconButton icon="✏️" label="Edit article" />
              <IconButton icon="👁️" label="Preview article" />
              <IconButton
                icon="🗑️"
                label="Delete article"
                tone="danger"
                onClick={() => {
                  setDeleteTarget(item.id)
                  setDeleteModalOpen(true)
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-admin-background">
      {toast && (
        <div className="fixed right-6 top-24 z-50">
          <Toast
            tone={toast.tone}
            title={toast.title}
            description={toast.description}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-admin-border/70 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-admin-muted">
              Dashboard / News
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">News Management</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={classNames(
                'rounded-full border border-admin-border bg-white px-4 py-2 text-sm font-semibold text-admin-muted transition hover:bg-admin-accent',
                selected.length === 0 && 'opacity-60 cursor-not-allowed'
              )}
              onClick={handleBulkDelete}
              disabled={selected.length === 0}
            >
              Delete Selected
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-admin-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-admin-primary-hover"
              onClick={handleOpenCreate}
            >
              <span className="text-base">＋</span>
              Create News
            </button>
          </div>
        </header>

        <section className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-admin-border/70 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={classNames(
                    'rounded-full px-4 py-1.5 text-sm font-semibold transition',
                    categoryFilter === category
                      ? 'bg-admin-primary text-white shadow'
                      : 'bg-admin-accent text-admin-muted hover:bg-admin-accent/60'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Tabs
                tabs={STATUS_TABS}
                active={statusFilter}
                onChange={setStatusFilter}
              />
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-4 py-2 text-sm font-semibold text-admin-muted hover:bg-admin-accent">
                    <span className="text-base">🗓️</span>
                    Date range
                  </button>
                </div>
                <div className="relative flex-1 sm:max-w-xs">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    placeholder="Search title or author"
                    className="h-11 w-full rounded-full border border-admin-border bg-white pl-10 pr-4 text-sm focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <EmptyState onCreate={handleOpenCreate} />
          ) : (
            <>
              {renderDesktopTable()}
              {renderMobileCards()}
            </>
          )}
        </section>
      </div>

      <CreateArticleModal
        open={createOpen}
        onClose={handleCloseCreate}
        onSave={() => upsertArticle('Draft')}
        onPublish={() => upsertArticle('Published')}
        formData={formData}
        setFormData={setFormData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        error={error}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget
            ? newsItems.find((item) => item.id === deleteTarget)?.title
            : selected.length > 1
            ? `${selected.length} articles`
            : newsItems.find((item) => item.id === selected[0])?.title
        }
      />
    </div>
  )
}

export default NewsManagementPage

