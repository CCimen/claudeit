import { CopyIcon, ExternalLinkIcon, PenSquareIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type ShareActionsProps = {
  onCopyShareLink: () => Promise<void>
  onEdit: () => void
  onOpenClaude: () => void
  prompt: string
  shareUrl: string
}

export function ShareActions({
  onCopyShareLink,
  onEdit,
  onOpenClaude,
  prompt,
  shareUrl,
}: ShareActionsProps) {
  return (
    <Card className="soft-card grain mx-auto mt-6 w-full max-w-5xl rounded-2xl sm:rounded-[2rem] border border-border/70 bg-card/90">
      <CardHeader className="gap-2">
        <span className="editorial-label text-[0.68rem] text-muted-foreground">
          Share it
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
          Your link is ready
        </h2>
        <CardDescription>
          Send the link, or open Claude yourself if you're feeling generous.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="share-link rounded-xl sm:rounded-[1.3rem] border border-border/70 bg-background/80 px-3 py-2.5 sm:px-4 sm:py-3 text-left text-xs sm:text-sm text-muted-foreground">
          {shareUrl}
        </div>
        <p className="text-left text-sm leading-6 text-muted-foreground">
          Shared prompt: <span className="text-foreground">{prompt}</span>
        </p>
      </CardContent>
      <Separator className="mx-4 opacity-50 md:mx-6" />
      <CardFooter className="flex flex-col gap-3 bg-transparent px-4 py-4 sm:flex-row md:px-6">
        <Button className="flex-1" onClick={() => void onCopyShareLink()}>
          <CopyIcon data-icon="inline-start" />
          Copy share link
        </Button>
        <Button className="flex-1" variant="outline" onClick={onOpenClaude}>
          <ExternalLinkIcon data-icon="inline-start" />
          Open in Claude
        </Button>
        <Button className="flex-1" variant="secondary" onClick={onEdit}>
          <PenSquareIcon data-icon="inline-start" />
          Edit prompt
        </Button>
      </CardFooter>
    </Card>
  )
}
