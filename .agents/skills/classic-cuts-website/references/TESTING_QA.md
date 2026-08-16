# Testing & QA

## Automated

**None.** No `package.json`, lint, typecheck, or test runner.

## Manual QA checklist (meaningful UI changes)

1. Home first viewport: logo, line, Book + Call, no horizontal scroll  
2. Mobile ≤767: hamburger, drawer links, Book/Call actions, hero poster (no video)  
3. Desktop ≥768: mega Barbers panel open/close, Escape  
4. `/services`, `/gallery`, `/barbers`, one profile, `/contact`, `/apply` render  
5. `/book`: loading → embed **or** phone fallback; aside/stack responsive  
6. Announce wrap does not cover hero controls  
7. Reduced motion: no reveal jank / no autoplay video  
8. Spot-check footer NAP vs `cc-business.js`  
9. Legacy URL 301 (e.g. `/book.html` → `/book`) on deployed/preview  

## Regression hotspots

- Duplicated nav markup  
- `vercel.json` rewrite/redirect asymmetry  
- BookLocal origin/key misconfiguration  
- New images without dimensions or compression  

## Preview

Use Vercel preview or local static server; do not deploy from agents unless user requests.
