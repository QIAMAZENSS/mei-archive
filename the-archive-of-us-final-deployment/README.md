# The Archive of Us - For Mei
## Project Birthday
This repository contains the complete interactive cinematic digital experience.

### Deployment Instructions (Vercel)
1. Push this repository to GitHub.
2. Log into Vercel and click "Add New Project".
3. Import your GitHub repository.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**. The included `vercel.json` will automatically handle client-side routing.

### Final Content Checklist (Before Giving to Mei)
- [ ] **Audio**: Place your chosen background music in `public/bgm.mp3`.
- [ ] **Photos**: Place real photos in `public/images/` and update `src/data/content.ts` to reference them.
- [ ] **Letters**: Replace the placeholder text in `src/data/content.ts` with your actual writing.
- [ ] **Password**: The current password is set to "archive" in `src/pages/Entrance/index.tsx`. Change it if desired.
