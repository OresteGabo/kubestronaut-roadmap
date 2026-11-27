# Kubestronaut Roadmap

A standalone Next.js App Router tracker for the five core CNCF Kubernetes
certifications and four AWS credentials. The production site is intended for `k8s.orestegabo.dev`.

## Open in WebStorm

Clone the repository with WebStorm’s **Get from Version Control**, or open the
repository root if you already have a checkout.
[OresteGabo/kubestronaut-roadmap](https://github.com/OresteGabo/kubestronaut-roadmap)

Use **Node.js 24 LTS** with its bundled npm. The installed Next.js 16.4.6 requires
Node.js **20.9.0 or later**. Set the Node.js interpreter in WebStorm to your local
installation, then run these commands from the repository root.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks and local production build

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Stop the development server, then serve the production build locally with
`npm start`. Open [http://localhost:3000](http://localhost:3000) again.

## Roadmap and progress

- [`src/data/roadmapData.ts`](src/data/roadmapData.ts) defines the five stages,
  exam logistics, weighted syllabus domains, checklist steps, and official
  resource links. Keep stage and task IDs stable so existing saves and backups
  can still find their entries.
- [`src/data/learningData.ts`](src/data/learningData.ts) defines the AWS certification
  roadmap. AWS checklist progress and exam passes have their own counts and
  are saved alongside Kubernetes progress.
- The overall percentage is checked steps divided by total steps. The
  certification counter is separate. Checking a stage’s exam-pass task or
  selecting **Mark Cert Passed** records one pass for that certification.
  Clearing the manual override leaves the checklist intact. A passed stage
  with unchecked tasks still appears in **In Progress / Remaining**.
- The forecast starts on the selected target date or the viewer’s local
  calendar date. Each stage contributes the unchecked fraction of its low and
  high week and hour estimates. Completion windows add up remaining weeks in
  roadmap order and round cumulative offsets up to a calendar day. Stages with
  every step checked consume zero time and have no forecast window.
- All checklists, notes, date, and theme are saved in the current browser
  profile and origin and sync across open tabs there. To move them to another
  device or from localhost to the deployed app, select **Export JSON**, copy
  the file, then select **Import JSON** and confirm on the destination. Import
  replaces tracker data. Version 1 backups restore the Kubernetes tracker and
  start the AWS checklist empty. Version 2 backups restore both certification
  roadmaps and skip entries for retired tasks. **Reset Progress** clears both
  checklists, pass overrides, notes, and the saved date.
  It keeps the theme.
- CNCF awards the Kubestronaut title after its active-certification and
  onboarding requirements are met. CKNE becomes an additional eligibility
  requirement on February 15, 2027. The tracker counts the five core
  certifications on this roadmap. [CNCF Kubestronaut FAQ](https://www.cncf.io/training/kubestronaut/kubestronaut-faq/)

## Deploy to Vercel

1. In Vercel, create a dedicated project by importing
   [OresteGabo/kubestronaut-roadmap](https://github.com/OresteGabo/kubestronaut-roadmap)
   through the GitHub integration. Use the **Next.js** preset and the repository
   root. Confirm the project’s production branch under **Settings → Environments
   → Production → Branch Tracking**. Git pushes to that branch create production
   deployments. [Vercel Git deployments](https://vercel.com/docs/git)
2. Under **Settings → Environment Variables**, enable **Automatically expose
   System Environment Variables**. During Preview builds, `VERCEL_ENV=preview`
   makes the app return `X-Robots-Tag: noindex`, including on a custom
   branch-preview domain. Production builds allow indexing. Both builds
   declare `https://k8s.orestegabo.dev/` as the canonical URL.
   [System environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
   · [Vercel response headers](https://vercel.com/docs/headers/response-headers)
3. Open the roadmap project’s **Settings → Domains**, add
   `k8s.orestegabo.dev`, and assign it to Production. Copy the record type,
   name, and target shown for this domain in Vercel. For a subdomain this is
   normally a `CNAME`. If ownership verification is requested, copy the
   corresponding `TXT` record too.
   [Vercel custom-domain setup](https://vercel.com/docs/domains/set-up-custom-domain)
4. Add those records at the authoritative DNS provider for `orestegabo.dev`.
   Use the existing DNS zone and limit edits to the records Vercel specifies
   for this subdomain. Many providers use `k8s` for a relative record name and
   append `orestegabo.dev` automatically. If you need to find the provider,
   run `dig +short NS orestegabo.dev`.
5. Refresh **Settings → Domains** to confirm that Vercel has verified the
   configuration. Once Vercel finishes issuing its TLS certificate, open
   [https://k8s.orestegabo.dev/](https://k8s.orestegabo.dev/) and confirm it serves
   the roadmap with a valid certificate. Inspect the production HTML for the
   canonical URL and confirm the response has no `noindex` directive. Check
   the Preview response headers for `X-Robots-Tag: noindex` using your preview URL
   from **Deployments**. For a protected preview, inspect the document request
   in browser DevTools after signing in.

```sh
curl -fsSI https://k8s.orestegabo.dev/
```

### Domain troubleshooting

- **Pending verification** — Check any required TXT value at the authoritative
  provider. Allow cached DNS answers to expire, then refresh the domain status
  in Vercel.
- **Invalid configuration** — For a CNAME, run
  `dig +short CNAME k8s.orestegabo.dev` and compare the result with the exact
  target in the project’s domain settings. Check for a doubled DNS suffix or a
  conflicting record at the same hostname.
- **HTTPS still pending** — Check that Vercel has verified the domain and review
  its certificate status. If verification is complete and issuance still
  fails, check whether an existing CAA record restricts the certificate
  issuer. [Vercel domain troubleshooting](https://vercel.com/docs/domains/troubleshooting)
