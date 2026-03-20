import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'

import { AuroraBackground } from '@/components/aurora-background'
import { Composer } from '@/components/composer'
import { ExamplePrompts } from '@/components/example-prompts'
import { Footer } from '@/components/footer'
import { HandoffPreview } from '@/components/handoff-preview'
import { Playback } from '@/components/playback'
import { ShareActions } from '@/components/share-actions'
import { HeroStarburst } from '@/components/hero-starburst'
import { TopBar } from '@/components/top-bar'
import { buildClaudeUrl } from '@/lib/claude'
import { burstConfetti } from '@/lib/confetti'
import { buildShareUrl, getPromptFromUrl, sanitizePrompt } from '@/lib/url'
import { siteConfig } from '@/site-config'

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

const shareCopiedToasts = [
  'Link copied. Go forth and delegate.',
  'Copied! Time to hit send and walk away.',
  'Link in your clipboard. Their problem now.',
  'Copied. Claude will take it from here.',
  'Link ready. You\'re doing them a favor, really.',
]

const linkCopiedToasts = [
  'Copied again. They must really need the hint.',
  'Share link copied.',
  'Got it. Go paste it somewhere meaningful.',
]

const promptCopiedToasts = [
  'Prompt copied.',
  'Copied. Do with it what you will.',
]

type PageMode = 'compose' | 'share' | 'playback'

function App() {
  const initialPrompt = getPromptFromUrl(window.location.search, window.location.hash)
  const [draftPrompt, setDraftPrompt] = useState(initialPrompt ?? '')
  const [activePrompt, setActivePrompt] = useState(initialPrompt)
  const [pageMode, setPageMode] = useState<PageMode>(
    initialPrompt ? 'playback' : 'compose',
  )
  const [composerFocused, setComposerFocused] = useState(false)
  const [starburstFlare, setStarburstFlare] = useState(false)

  useEffect(() => {
    if (pageMode === 'compose' && window.matchMedia('(min-width: 768px)').matches) {
      setTimeout(() => {
        document.querySelector<HTMLTextAreaElement>('#composer textarea')?.focus()
      }, 800)
    }
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const prompt = getPromptFromUrl(window.location.search, window.location.hash)

      setActivePrompt(prompt)
      setDraftPrompt(prompt ?? '')
      setPageMode(prompt ? 'playback' : 'compose')
    }

    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const syncPromptToUrl = (prompt: string | null) => {
    const nextUrl = prompt
      ? new URL(buildShareUrl(prompt, window.location.origin))
      : new URL(window.location.origin)

    window.history.pushState({}, '', nextUrl)
  }

  const handleSubmit = async () => {
    const prompt = sanitizePrompt(draftPrompt)

    if (!prompt) {
      toast.error('Write a question first.')
      return
    }

    const shareUrl = buildShareUrl(prompt, window.location.origin)

    setDraftPrompt(prompt)
    setActivePrompt(prompt)
    setPageMode('share')
    syncPromptToUrl(prompt)

    setStarburstFlare(true)
    setTimeout(() => setStarburstFlare(false), 600)

    burstConfetti()

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(pick(shareCopiedToasts))
    } catch {
      toast.success('Link ready — copy it from the page below.')
    }

    setTimeout(() => {
      document.getElementById('share-actions')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleEdit = () => {
    setPageMode('compose')
    setDraftPrompt(activePrompt ?? draftPrompt)
    setActivePrompt(null)
    syncPromptToUrl(null)
  }

  const handleChooseExample = (prompt: string) => {
    setDraftPrompt(prompt)
    document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>('#composer textarea')?.focus()
    }, 300)
  }

  const handleCopyShareLink = async () => {
    if (!activePrompt) {
      return
    }

    await navigator.clipboard.writeText(
      buildShareUrl(activePrompt, window.location.origin),
    )
    toast.success(pick(linkCopiedToasts))
  }

  const handleCopyPrompt = async () => {
    if (!activePrompt) {
      return
    }

    await navigator.clipboard.writeText(activePrompt)
    toast.success(pick(promptCopiedToasts))
  }

  const handleOpenClaude = () => {
    if (!activePrompt) {
      return
    }

    window.open(buildClaudeUrl(activePrompt), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-shell ambient-glow">
      <AuroraBackground />
      <a
        className="sr-only font-medium focus:not-sr-only focus:absolute focus:z-50 focus:rounded-br-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
        href="#main-content"
      >
        Skip to main content
      </a>
      <TopBar />
      <main
        className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-12 pt-6 sm:px-8 xl:px-12 2xl:px-16"
        id="main-content"
      >
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center pt-4 text-center sm:pt-12 xl:pt-14 landscape:pt-4 landscape:sm:pt-12">
          {pageMode !== 'playback' && (
            <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center gap-3 sm:mb-10 sm:gap-4">
              <div className="animate-rise flex flex-col items-center gap-4">
                <div className="animate-ornament flex size-16 items-center justify-center overflow-visible rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_14px_40px_rgba(198,100,66,0.18)]">
                  <HeroStarburst
                    className="size-8"
                    flare={starburstFlare}
                    promptLength={draftPrompt.length}
                  />
                </div>
                <div className="space-y-3">
                  <h1 className="text-balance font-display text-4xl leading-[0.92] font-semibold tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                    Let me Claude it for you
                  </h1>
                  <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Create a link. Share it. Let Claude handle the question they
                    probably could have asked themselves.
                  </p>
                </div>
              </div>

              <p className="animate-rise-delayed mx-auto max-w-lg text-center text-xs leading-5 text-muted-foreground/70">
                {siteConfig.shortDisclaimer} {siteConfig.privacyNote}
              </p>
            </div>
          )}

          <motion.div className="w-full min-h-[420px]" layout>
            <AnimatePresence mode="wait">
              {pageMode === 'playback' && activePrompt ? (
                <motion.div
                  key="playback"
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Playback
                    prompt={activePrompt}
                    onCopyPrompt={handleCopyPrompt}
                    onCreateYourOwn={handleEdit}
                    onOpenClaude={handleOpenClaude}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="compose-share"
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                  exit={{ opacity: 0, y: -18 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div id="composer">
                    <Composer
                      mode={pageMode === 'share' ? 'share' : 'compose'}
                      onFocusChange={setComposerFocused}
                      onPromptChange={setDraftPrompt}
                      onSubmit={handleSubmit}
                      prompt={
                        pageMode === 'compose' ? draftPrompt : activePrompt ?? ''
                      }
                    />
                  </div>

                  <AnimatePresence>
                    {pageMode === 'compose' ? (
                      <motion.div
                        key="examples"
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.28 }}
                      >
                        <ExamplePrompts onSelect={handleChooseExample} />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {pageMode === 'share' && activePrompt ? (
                      <motion.div
                        key="share-actions"
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        id="share-actions"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ShareActions
                          onCopyShareLink={handleCopyShareLink}
                          onEdit={handleEdit}
                          onOpenClaude={handleOpenClaude}
                          prompt={activePrompt}
                          shareUrl={buildShareUrl(
                            activePrompt,
                            window.location.origin,
                          )}
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {pageMode === 'compose' && (
                    <div className="mt-10">
                      <HandoffPreview isPaused={composerFocused} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
