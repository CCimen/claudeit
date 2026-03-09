import { siteConfig } from '@/site-config'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/35">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-6 text-sm leading-6 text-muted-foreground sm:px-8 xl:px-12 2xl:px-16">
        <p>{siteConfig.fullDisclaimer}</p>
        <p>{siteConfig.privacyNote}</p>
        <p>
          Contact:{' '}
          <a
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href={`mailto:${siteConfig.contactEmail}`}
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </div>
    </footer>
  )
}
