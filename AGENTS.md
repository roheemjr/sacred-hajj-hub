<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Centralize confirmed business content, service data, validation and page metadata in the browser-safe travel module so changes remain consistent across pages.
- Use shared travel presentation components and the root header/footer across all six public content routes to keep navigation and enquiry access consistent.
- Store enquiries via a validated insert-only public server function; protect all app reads with server-side admin-role checks and private RLS, while preserving review access through Lovable Cloud.
- Keep downloaded destination photographs in CDN asset pointers with source attribution; the homepage uses a static photograph without playback controls.
- The server bundle sets nitro rollupConfig output.strictExecutionOrder in vite.config.ts; without it shared CommonJS helpers load out of order and every published page 500s.

- Use lightweight opaque surfaces and one shared IntersectionObserver for scroll reveals; avoid panel blur to keep mobile scrolling fast.
- Use distinct courtyard images for package cards instead of reusing the homepage hero or introduction image.
