# Validation

Rules for input/data validation in this project. Use Zod.

---

# Validate at Every Boundary

Validate data wherever it crosses a trust boundary:

- user input in forms, before it reaches a Server Action
- a Server Action's input, again, server-side (never trust the client did it)
- CMS responses, where a missing/malformed field would otherwise crash rendering deep in a
  component tree

---

# Schema Location and Naming

```
lib/validation/<domain>/contact-form.schema.ts
```

Schema files end with `.schema.ts` and export both the Zod schema and its inferred type:

```ts
export const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
```

Do not hand-write a matching TypeScript `interface` next to a Zod schema — infer it, so the
two can never drift.

---

# CMS Response Validation

For CMS responses, prefer a lightweight parse-and-map step in `lib/cms/` (checking required
fields exist, coercing known-safe shapes) over a full Zod schema for every response, unless a
field genuinely has complex/variant shape (e.g. Payload blocks with a discriminated `blockType`)
— that case is a good fit for a Zod discriminated union.

This is exactly what `lib/cms/page/blocks/` does: each block exports its own Zod schema
(`payload<Block>BlockSchema`) right next to its `map<Block>Block()` function, with the
block's own raw TS type derived from the schema (`z.infer`, never declared separately —
one source of truth). `lib/cms/page/blocks/index.ts` combines every block's schema into one
`z.discriminatedUnion('blockType', [...])`, and `fetch-page-by-slug.ts`'s `mapBlock` parses
each raw block against it before looking up a mapper — an unrecognized `blockType` and a
malformed known one both simply fail to parse and get skipped, never crash the page. Follow
this same shape (schema-first, `z.infer`, one schema per block, combined into one
discriminated union) for any other block-based domain, rather than reaching for a plain TS
interface plus manual null-checks like earlier blocks in this project once did.

---

# Form Validation UX

- Validate on submit at minimum; validate on blur for a better UX where the design calls for
  it.
- Surface field-level errors next to the field (see `frontend/ACCESSIBILITY.md` for
  `aria-describedby`), not only as a generic banner.

---

# Never Trust, Always Narrow

Do not use `as` to force a type onto unvalidated external data (CMS response, form data,
query params). Parse it with Zod (or an explicit runtime check) and let TypeScript infer the
narrowed type from that.
