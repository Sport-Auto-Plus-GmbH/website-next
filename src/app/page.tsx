import { Button } from '@/components/ui/button'
import { fetchMediaList } from '@/lib/cms/media/fetch-media-list'

export default async function HomePage() {
  const { totalCount } = await fetchMediaList()

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">website-next</h1>
      <p className="max-w-md text-muted-foreground">
        Connected to the payload-next CMS — {totalCount} media item
        {totalCount === 1 ? '' : 's'} found.
      </p>
      <Button asChild>
        <a
          href={process.env.PAYLOAD_API_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noreferrer"
        >
          Open CMS Admin
        </a>
      </Button>
    </main>
  )
}
