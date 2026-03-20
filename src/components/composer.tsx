import { ArrowUpRightIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

type ComposerProps = {
  mode: 'compose' | 'share'
  onFocusChange?: (focused: boolean) => void
  onPromptChange: (value: string) => void
  onSubmit: () => void
  prompt: string
}

export function Composer({
  mode,
  onFocusChange,
  onPromptChange,
  onSubmit,
  prompt,
}: ComposerProps) {
  const isComposeMode = mode === 'compose'

  const cardClassName = 'soft-card grain mx-auto w-full max-w-5xl rounded-2xl sm:rounded-[2rem] border border-border/70 bg-card/90'

  return (
    <Card className={cardClassName}>
      <CardHeader className="gap-3 text-left">
        <span className="editorial-label text-[0.68rem] text-muted-foreground">
          {isComposeMode ? 'Prompt composer' : 'Ready to share'}
        </span>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-foreground">
          {isComposeMode ? 'Write the question they should ask.' : 'Your link is ready.'}
        </h2>
        <CardDescription className="max-w-2xl text-sm leading-6">
          {isComposeMode
            ? 'Keep it crisp. The prompt lives in the URL, so shorter is cleaner.'
            : 'Copy the link and share it. When they open it, Claude gets the question automatically.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          aria-label={isComposeMode ? 'Type your prompt' : 'Shared prompt'}
          className="min-h-[130px] resize-none rounded-xl sm:rounded-[1.5rem] border-border/70 bg-background/75 px-4 py-3 sm:px-5 sm:py-4 text-base leading-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-[border-color,box-shadow,background-color] duration-200 focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/20 md:min-h-[180px] md:text-base"
          maxLength={1500}
          onBlur={() => onFocusChange?.(false)}
          onChange={(event) => onPromptChange(event.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && isComposeMode) {
              event.preventDefault()
              onSubmit()
            }
          }}
          placeholder="How do I center a div without asking in Slack first…"
          readOnly={!isComposeMode}
          value={prompt}
        />
      </CardContent>
      <Separator className="mx-4 opacity-50 md:mx-6" />
      <CardFooter className="flex flex-col gap-3 bg-transparent px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex flex-col gap-1 text-left">
          <p className={`text-sm tabular-nums transition-colors ${prompt.length > 1400 ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
            {prompt.length} / 1500 characters
          </p>
          {isComposeMode && (
            <p className="text-sm text-muted-foreground">
              Shorter prompts make cleaner links and better previews in chat.
            </p>
          )}
        </div>
        {isComposeMode ? (
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <kbd className="hidden text-xs text-muted-foreground sm:inline">⌘↵</kbd>
            <Button
              className={`group/btn h-10 w-full transition-transform active:scale-[0.97] hover:shadow-lg sm:w-auto sm:min-w-56 sm:px-6 ${prompt.length > 0 ? 'animate-cta-ready' : ''}`}
              onClick={onSubmit}
              title="Submit (Cmd+Enter)"
            >
              Let me Claude it
              <ArrowUpRightIcon className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" data-icon="inline-end" />
            </Button>
          </div>
        ) : (
          <Badge className="rounded-full px-4 py-1.5">Share link ready</Badge>
        )}
      </CardFooter>
    </Card>
  )
}
