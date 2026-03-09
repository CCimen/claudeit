import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Composer } from '@/components/composer'
import { ExamplePrompts } from '@/components/example-prompts'
import { Footer } from '@/components/footer'
import { HandoffPreview } from '@/components/handoff-preview'
import { HowItWorks } from '@/components/how-it-works'
import { Playback } from '@/components/playback'
import { ShareActions } from '@/components/share-actions'
import { StarburstIcon } from '@/components/starburst-icon'
import { TopBar } from '@/components/top-bar'
import { buildClaudeUrl } from '@/lib/claude'
import { buildShareUrl, getPromptFromSearch, sanitizePrompt } from '@/lib/url'
import { siteConfig } from '@/site-config'

type PageMode = 'compose' | 'share' | 'playback'

function App() {
  const initialPrompt = getPromptFromSearch(window.location.search)
  const [draftPrompt, setDraftPrompt] = useState(initialPrompt ?? '')
  const [activePrompt, setActivePrompt] = useState(initialPrompt)
  const [pageMode, setPageMode] = useState<PageMode>(
    initialPrompt ? 'playback' : 'compose',
  )
  const [composerFocused, setComposerFocused] = useState(false)

  useEffect(() => {
    const onPopState = () => {
      const prompt = getPromptFromSearch(window.location.search)

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

  const handleSubmit = () => {
    const prompt = sanitizePrompt(draftPrompt)

    if (!prompt) {
      toast.error('Write a question first.')
      return
    }

    setDraftPrompt(prompt)
    setActivePrompt(prompt)
    setPageMode('share')
    syncPromptToUrl(prompt)
    toast.success('Share link ready.')
  }

  const handleEdit = () => {
    setPageMode('compose')
    setDraftPrompt(activePrompt ?? draftPrompt)
    setActivePrompt(null)
    syncPromptToUrl(null)
  }

  const handleChooseExample = (prompt: string) => {
    setDraftPrompt(prompt)
  }

  const handleCopyShareLink = async () => {
    if (!activePrompt) {
      return
    }

    await navigator.clipboard.writeText(
      buildShareUrl(activePrompt, window.location.origin),
    )
    toast.success('Share link copied.')
  }

  const handleCopyPrompt = async () => {
    if (!activePrompt) {
      return
    }

    await navigator.clipboard.writeText(activePrompt)
    toast.success('Prompt copied.')
  }

  const handleOpenClaude = () => {
    if (!activePrompt) {
      return
    }

    window.open(buildClaudeUrl(activePrompt), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-shell ambient-glow">
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
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center pt-8 text-center sm:pt-12 xl:pt-14">
          <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-4 sm:mb-10">
            <div className="animate-rise flex flex-col items-center gap-4">
              <div className="animate-ornament flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_14px_40px_rgba(198,100,66,0.18)]">
                <StarburstIcon className="size-8" />
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

            <Alert className="animate-rise-delayed soft-card grain mx-auto max-w-lg rounded-[1.45rem] border-border/70 bg-card/70 text-left shadow-[0_18px_50px_rgba(62,43,31,0.08)] backdrop-blur-md">
              <StarburstIcon className="mt-0.5 size-4 text-primary" />
              <AlertTitle className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase">
                Unofficial fan tool
              </AlertTitle>
              <AlertDescription className="leading-6">
                {siteConfig.shortDisclaimer} {siteConfig.privacyNote}
              </AlertDescription>
            </Alert>
          </div>

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
                  <motion.div className="group/merged" layout>
                    <HandoffPreview compact isPaused={composerFocused} />
                    <div className="mx-5 border-t border-dashed border-border/50 sm:mx-6" />
                    <Composer
                      attached
                      mode={pageMode === 'share' ? 'share' : 'compose'}
                      onFocusChange={setComposerFocused}
                      onPromptChange={setDraftPrompt}
                      onSubmit={handleSubmit}
                      prompt={
                        pageMode === 'compose' ? draftPrompt : activePrompt ?? ''
                      }
                    />
                  </motion.div>

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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <HowItWorks />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
