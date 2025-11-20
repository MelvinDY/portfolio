# Vercel Deployment Guide

Your Next.js portfolio is **already configured** and ready for Vercel deployment! No backend configuration needed - Next.js API routes automatically work as serverless functions on Vercel.

## ✅ What's Already Configured

- ✅ Next.js 15 with App Router
- ✅ API Routes (`/api/email` and `/api/chat`) - will work as serverless functions
- ✅ Correct build scripts in `package.json`
- ✅ Environment variables properly structured
- ✅ Static and dynamic routes configured correctly

## 🚀 Deployment Steps

### 1. Push to GitHub (if not already done)

```bash
git add .
git commit -m "feat: add AI chatbox and prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Vercel Dashboard (Recommended)**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel
```

### 3. Configure Environment Variables in Vercel

After deployment, add these environment variables in the Vercel Dashboard:

**Path:** Project Settings → Environment Variables

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `RESEND_API_KEY` | `re_XwksCNNE_HQkkfdd2FahSptVmqFUkv3UQ` | Production, Preview, Development |
| `FROM_EMAIL` | `onboarding@resend.dev` | Production, Preview, Development |
| `TO_EMAIL` | `melvindarialyogiana@gmail.com` | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-proj-N60xi...` (your full key) | Production, Preview, Development |

**Important:** Select all three environments (Production, Preview, Development) for each variable.

### 4. Redeploy After Adding Environment Variables

After adding environment variables:
1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache"

## 🔧 How Your API Routes Work on Vercel

### `/api/email` (Contact Form)
- Runs as serverless function
- Uses Resend API
- No additional configuration needed
- Function timeout: 10s (default)

### `/api/chat` (AI Chatbox)
- Runs as serverless function
- Uses OpenAI API (gpt-4o-mini)
- No additional configuration needed
- Function timeout: 10s (default)

## 📝 Optional: Vercel Configuration

Your app doesn't need a `vercel.json` file, but if you want to customize settings, you can create one:

```json
{
  "functions": {
    "api/chat.ts": {
      "maxDuration": 30
    }
  }
}
```

This would increase the timeout for the chat API to 30 seconds (useful for slower AI responses).

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - ✅ Already in `.gitignore`
2. **Use Vercel's Environment Variables** - Add secrets in the dashboard
3. **Rotate API keys** if they're ever exposed
4. **Use Preview deployments** to test before production

## 🌐 Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update your DNS records as instructed by Vercel

## 📊 Monitoring

After deployment, monitor:
- **Function Logs:** Vercel Dashboard → Functions
- **Analytics:** Vercel Dashboard → Analytics
- **API Usage:**
  - OpenAI: https://platform.openai.com/usage
  - Resend: https://resend.com/emails

## 🐛 Troubleshooting

### API Routes Not Working
- Check environment variables are set for "Production"
- Redeploy after adding env vars
- Check function logs in Vercel dashboard

### Build Errors
- Run `npm run build` locally first
- Check that all dependencies are in `package.json`
- Review build logs in Vercel

### OpenAI Timeout
- AI responses may take 5-10 seconds
- Consider increasing function timeout in `vercel.json`
- Check your OpenAI API quota

## ✅ Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] Contact form works (test sending an email)
- [ ] AI chatbox responds (test asking a question)
- [ ] All sections render properly
- [ ] Mobile responsive
- [ ] Dark/light theme works
- [ ] Three.js hero section loads
- [ ] All links work

## 🎉 You're Done!

Your portfolio with the AI chatbox will be live on Vercel. The serverless architecture means:
- Zero server management
- Automatic scaling
- Global CDN
- Free SSL/HTTPS
- Instant rollbacks

Enjoy your deployed portfolio! 🚀
