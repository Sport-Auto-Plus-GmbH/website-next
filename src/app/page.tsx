import { faArrowUpRight, faCircleCheck } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchMediaList } from '@/lib/cms/media/fetch-media-list'

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const

export default async function HomePage() {
  const { totalCount } = await fetchMediaList()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <section className="rounded-xl bg-gradient-to-br from-primary to-primary/70 p-10 text-primary-foreground">
        <p className="text-sm font-medium uppercase tracking-wide opacity-80">website-next</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance">
          Tailwind CSS and shadcn/ui are wired up and working.
        </h1>
        <p className="mt-4 max-w-xl text-primary-foreground/90">
          This page is the scaffold&apos;s proof-of-concept — no brand design applied yet.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>CMS Connection</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="size-4 text-green-600"
              aria-hidden="true"
            />
            Connected to the payload-next CMS — {totalCount} media item
            {totalCount === 1 ? '' : 's'} found.
          </p>
          <Button asChild className="w-fit">
            <a
              href={process.env.PAYLOAD_API_URL || 'http://localhost:3000'}
              target="_blank"
              rel="noreferrer"
            >
              Open CMS Admin
              <FontAwesomeIcon icon={faArrowUpRight} className="ml-2 size-4" aria-hidden="true" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>shadcn/ui Button Variants</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {BUTTON_SIZES.map((size) => (
              <Button key={size} size={size}>
                Size: {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
