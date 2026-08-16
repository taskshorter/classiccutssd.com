# Deployment

## Host

Vercel static project (CLI-linked locally via `.vercel/`; do not commit project IDs or tokens into Skills).

## Config: `vercel.json`

1. **Redirects** — legacy Weebly HTML filenames → clean paths (301)  
2. **Rewrites** — clean paths → HTML files  
3. **Headers** — long-cache immutable assets; shorter favicon cache  

## Ignore

`.vercelignore` excludes bulky/non-runtime paths (e.g. original video, backups) from deploy artifacts — keep heavy sources out of production uploads.

## Domains

Production hostname used in canonicals/OG: `https://classiccutssd.com`. Preview hostnames may appear in docs (`fpdesigner.com`) — prefer production canonicals in page meta.

## Deploy policy for agents

- Do **not** deploy unless the user explicitly asks  
- Do **not** change DNS  
- Documentation-only work must leave runtime files unchanged  

## Env

Static site needs no runtime secrets. BookLocal publishable configuration lives in `book.html`. Gitignore covers `.env*` and `.vercel`.
