# SAT-DISCOVERY Deployment Guide

## 🚨 Why Production Shows No Changes

### Current Situation

Your production site at **sat-index.online** is showing outdated content because:

1. **Vercel Production Branch**: Connected to `main` branch
2. **Your New Work**: All commits are on `copilot/implement-data-processing-integration` (PR branch)
3. **Result**: Production deploys from `main`, which doesn't have your new code yet

### Branch Status

```
main (production) ←─────────── Vercel Production
  ↓ (outdated)
  - Old index.html with Chinese comments
  - Missing: Resources catalog, Algorithms section, STAC verification
  
copilot/implement-data-processing-integration (PR branch) ← Your work is HERE
  ↓ (6 new commits)
  - ✅ English localization
  - ✅ Resources catalog (48 entries with filters)
  - ✅ Algorithms & Tools section
  - ✅ STAC map integration verified
  - ✅ Complete refactor
```

---

## 📋 Step-by-Step Deployment Instructions

### Option 1: Merge via GitHub UI (Recommended)

This is the safest and most straightforward method.

#### 1. Navigate to Pull Request
```
1. Go to: https://github.com/vicky10844132-a11y/sat-discovery-platform/pulls
2. Find your PR: "Implement data processing integration" (or similar)
3. Review the changes one last time
```

#### 2. Merge the Pull Request
```
1. Click the green "Merge pull request" button
2. Select merge method:
   - ✅ "Create a merge commit" (recommended - preserves history)
   - "Squash and merge" (combines all commits into one)
   - "Rebase and merge" (linear history)
3. Click "Confirm merge"
4. Optionally delete the PR branch after merging
```

#### 3. Verify Deployment
```
1. Vercel will automatically detect the new commits on main
2. Check Vercel dashboard: https://vercel.com/dashboard
3. Look for deployment in progress on "sat-discovery-platform"
4. Wait 1-2 minutes for deployment to complete
5. Visit: https://sat-index.online to see changes
```

---

### Option 2: Merge via Command Line

If you prefer Git CLI or need more control:

#### 1. Switch to Main Branch
```bash
git checkout main
git pull origin main
```

#### 2. Merge PR Branch
```bash
# Merge with commit message
git merge copilot/implement-data-processing-integration -m "Merge: Complete refactor with resources catalog and algorithms section"

# If there are conflicts, resolve them and:
git add .
git commit -m "Resolve merge conflicts"
```

#### 3. Push to Main
```bash
git push origin main
```

#### 4. Verify Deployment
- Vercel will auto-deploy within 1-2 minutes
- Check: https://sat-index.online

---

## 🔧 Vercel Production Branch Configuration

### Verify Production Branch Setting

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/vicky10844132-a11y/sat-discovery-platform/settings/git
   ```

2. **Check "Production Branch"**
   - Should be set to: `main`
   - If not, update it to `main`

3. **Save Changes**
   - Click "Save" if you made any changes
   - Next deployment will use the correct branch

### Manual Production Deployment (if needed)

If Vercel doesn't auto-deploy after merge:

```
1. Go to: https://vercel.com/vicky10844132-a11y/sat-discovery-platform
2. Click "Deployments" tab
3. Find the latest commit on main branch
4. Click "..." menu → "Redeploy"
5. Select "Use existing Build Cache" (optional)
6. Click "Redeploy"
```

---

## 🛡️ Prevent Unwanted Preview Deployments (Optional)

Preview deployments can be useful for testing, but if you want to control them:

### Method 1: Ignored Build Step (Recommended)

Add this script to prevent specific branches from deploying:

**Create `vercel-ignore-build.sh`:**
```bash
#!/bin/bash

# Exit codes:
# 0 = Proceed with build
# 1 = Skip build

# Only build main branch and explicit preview branches
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  echo "✅ Building main branch"
  exit 0
fi

# Allow preview for branches starting with "preview/"
if [[ "$VERCEL_GIT_COMMIT_REF" == preview/* ]] ; then
  echo "✅ Building preview branch: $VERCEL_GIT_COMMIT_REF"
  exit 0
fi

# Skip all other branches
echo "🛑 Skipping build for: $VERCEL_GIT_COMMIT_REF"
exit 1
```

**Update `vercel.json`:**
```json
{
  "ignoreCommand": "bash vercel-ignore-build.sh"
}
```

### Method 2: Disable Preview Deployments Completely

In Vercel Dashboard:
```
1. Go to: Settings → Git
2. Scroll to "Deploy Hooks"
3. Under "Automatic Deployments":
   - Uncheck "Deploy previews for all branches"
   - Keep "Deploy production branch" checked
4. Save
```

### Method 3: Branch Protection (Strict)

Configure in GitHub + Vercel:
```
1. GitHub: Settings → Branches → Add rule
   - Branch name pattern: main
   - Require pull request reviews before merging
   
2. Vercel: Settings → Git
   - Only deploy from: main
   - Ignore other branches
```

---

## 📊 Deployment Checklist

Before merging to production:

- [ ] All commits pushed to PR branch
- [ ] PR reviewed (if working with team)
- [ ] No console errors in development
- [ ] All pages load correctly
- [ ] Navigation works between all pages
- [ ] STAC map app functional
- [ ] Resources catalog loads and filters work
- [ ] Tools page renders algorithms and GDB cleaner
- [ ] Mobile responsive (test on phone/tablet)

After merging to main:

- [ ] Verify Vercel deployment started
- [ ] Check deployment logs (no errors)
- [ ] Visit sat-index.online and test:
  - [ ] Homepage loads
  - [ ] Map Search accessible
  - [ ] Resources page with filters
  - [ ] Tools page with algorithms
  - [ ] About page
  - [ ] All navigation links work
- [ ] Test on different browsers
- [ ] Verify domain resolves correctly

---

## 🐛 Troubleshooting

### Production Still Shows Old Content After Merge

**Solution:**
```
1. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check Vercel deployment status
4. Wait 2-3 minutes (CDN propagation)
5. Try incognito/private window
```

### Vercel Not Auto-Deploying

**Solution:**
```
1. Check Vercel dashboard for errors
2. Verify webhook is enabled (Settings → Git → GitHub App)
3. Manually trigger deployment (see "Manual Production Deployment" above)
4. Check GitHub Actions (if any) aren't blocking
```

### Merge Conflicts

**Solution:**
```bash
# If conflicts occur during merge:
git status                    # See conflicted files
git diff                      # Review conflicts

# Edit conflicted files manually, then:
git add <resolved-files>
git commit -m "Resolve merge conflicts"
git push origin main
```

### Wrong Branch Deployed

**Solution:**
```
1. Go to Vercel: Settings → Git
2. Update "Production Branch" to: main
3. Save
4. Redeploy latest main commit
```

---

## 📈 Post-Deployment Monitoring

### Check Site Health

```bash
# Test homepage
curl -I https://sat-index.online

# Test navigation
curl -I https://sat-index.online/app.html
curl -I https://sat-index.online/resources.html
curl -I https://sat-index.online/tools.html

# Should all return: HTTP/2 200
```

### Verify Analytics (if configured)

- Check Vercel Analytics dashboard
- Monitor error rates
- Check page load times
- Review user paths

### Monitor GitHub Deployments

```
Repository → Environments → Production
- Shows deployment history
- Build times
- Deployment status
```

---

## 🎯 Quick Reference

### Current Branches
- **Production**: `main` → https://sat-index.online
- **Preview**: `copilot/implement-data-processing-integration` → (Vercel preview URL)

### Key Commands
```bash
# Merge PR to main
git checkout main
git pull origin main
git merge copilot/implement-data-processing-integration
git push origin main

# Check deployment
vercel list            # If Vercel CLI installed
# Or visit: https://vercel.com/dashboard

# Rollback if needed
git revert HEAD
git push origin main
```

### Important URLs
- **Production Site**: https://sat-index.online
- **GitHub Repo**: https://github.com/vicky10844132-a11y/sat-discovery-platform
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Pull Requests**: https://github.com/vicky10844132-a11y/sat-discovery-platform/pulls

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Production site loads at sat-index.online
2. ✅ Homepage shows "SAT-DISCOVERY" with hero section
3. ✅ Navigation includes: Home | Map Search | Resources | Tools | About
4. ✅ Resources page shows 48+ entries with working filters
5. ✅ Tools page displays algorithm families and GDB Cleaner code
6. ✅ Map Search (app.html) opens STAC interface
7. ✅ All text is in English (no Chinese characters)
8. ✅ No console errors in browser DevTools
9. ✅ Mobile responsive design works
10. ✅ Domain sat-index.online resolves correctly

---

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Review GitHub Actions (if any)
3. Verify DNS settings for sat-index.online
4. Check Vercel project settings
5. Contact Vercel support if platform issues

---

**Last Updated**: 2026-02-22  
**Version**: 1.0  
**Status**: Ready for deployment
