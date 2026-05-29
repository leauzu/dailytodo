# Very Specific Vercel Deploy Guide

## Correct Vercel project settings

Use these settings when importing the repository:

- Framework Preset: Next.js
- Root Directory: `./` if `package.json` is in the repository root
- Install Command: leave default, or use `npm install`
- Build Command: leave default, or use `npm run build`
- Output Directory: leave empty / default

Do not set Output Directory to `dist`.
Do not choose "Other" as framework.
Do not deploy the parent folder if `package.json` is inside a child folder.

## Environment variable

Optional for demo mode, required for real database saving:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

Add it to:
- Production
- Preview
- Development

After adding or changing an environment variable, redeploy.
