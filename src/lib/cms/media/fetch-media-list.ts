import { PAYLOAD_API_URL } from '@/lib/cms/config'
import type { MediaItem } from '@/types/cms/media/media.types'

interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
}

interface PayloadMediaDoc {
  id: number
  alt: string
  url?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
}

function mapMediaDoc(doc: PayloadMediaDoc): MediaItem {
  return {
    id: doc.id,
    alt: doc.alt,
    url: doc.url ?? null,
    width: doc.width ?? null,
    height: doc.height ?? null,
    mimeType: doc.mimeType ?? null,
  }
}

export async function fetchMediaList(): Promise<{ items: MediaItem[]; totalCount: number }> {
  const response = await fetch(`${PAYLOAD_API_URL}/api/media?limit=10`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch media list: ${response.status}`)
  }

  const data: PayloadListResponse<PayloadMediaDoc> = await response.json()

  return {
    items: data.docs.map(mapMediaDoc),
    totalCount: data.totalDocs,
  }
}
