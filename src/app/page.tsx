import { PageRenderer } from '@/components/landing/page-renderer/page-renderer'
import { fetchRawPageBySlug } from '@/lib/cms/page/fetch-page-by-slug'

const HOMEPAGE_SLUG = 'home'

export default async function HomePage() {
  const rawPage = await fetchRawPageBySlug(HOMEPAGE_SLUG)

  if (!rawPage) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-muted-foreground">
          Keine Startseite konfiguriert. Lege in Payload unter &bdquo;Seiten&rdquo; eine Seite mit
          dem Slug &bdquo;home&rdquo; an.
        </p>
      </main>
    )
  }

  return <PageRenderer initialRawPage={rawPage} />
}
