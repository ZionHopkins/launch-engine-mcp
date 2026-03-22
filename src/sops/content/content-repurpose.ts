export const CONTENT_REPURPOSE = `# /content-repurpose — Single-Pass Content Repurposing Engine

## What This Does

Takes a single content piece from \`/content-engine\` and generates 7+ platform-native assets in a single pass. Each asset is self-contained, written in the buyer's Language Bank voice, and formatted for its destination platform.

## Trigger Context
After \`/content-engine\` produces pillar or spoke pages. Follows the content calendar — typically runs in Week 2 of each month on that month's published pillar.

## Prerequisites
- At least one pillar or spoke page from \`/content-engine\`
- Buyer Research Package (Language Bank for voice consistency)
- Name Lock Registry (brand attribution in every asset)
- Building Blocks (named frameworks for citation magnets)

## Execution Protocol

**DELEGATE TO SUBAGENT: \`content-strategist\` (task_type: "repurpose")**

### Step 1: Select Source Content
Identify which pillar or spoke to repurpose. Follow the content calendar order. If user specifies a piece, use that.

### Step 2: Invoke Content Strategist Subagent
Pass the source content + buyer research Language Bank + Name Lock Registry + Building Blocks.

The subagent extracts core insights, stats, frameworks, and key arguments, then generates:

### Output Per Source Piece:

**1. Blog Post** (reformatted)
- SEO meta: title (<60 chars), description (<160 chars), OG tags
- Twitter Card tags: twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image
- Article schema JSON-LD: headline, author, datePublished, dateModified, description
- First-200-words rule applied
- Internal links to related content pieces
- Save as \`repurposed/[source-slug]/blog-post.md\`

**2. YouTube Script** (8-15 min)
- Hook (first 15 seconds — must stop the scroll)
- Chapter markers with timestamps
- Transcript-ready format (YouTube indexes transcripts for search)
- CTA placement at 60% mark and end
- Description: first 3 lines follow the first-200-words rule (stat + value prop + brand name) — YouTube descriptions are indexed by AI models for citation. Front-load the most citable information.
- Keywords and links in description
- 3 title variants (curiosity, benefit, contrarian)
- Save as \`repurposed/[source-slug]/youtube-script.md\`

**3. Short-Form Video Scripts** (3-5 scripts, 30-60s each)
- TikTok/Reels/Shorts format
- Each script leads with a different hook angle
- Captions included (text-on-screen style)
- Hashtag recommendations per platform
- Save as \`repurposed/[source-slug]/short-form-scripts.md\`

**4. Reddit Thread**
- Genuine discussion format — NO promotional language
- Written in Language Bank voice (sounds like the buyer, not the seller)
- Relevant subreddit recommendations from buyer research
- Provides genuine value — the post should get upvotes on its own merit
- Brand mention is natural/contextual, not forced
- Save as \`repurposed/[source-slug]/reddit-thread.md\`

**5. LinkedIn Article/Carousel**
- Thought leadership tone with EEAT credentials
- Professional angle — connects to business outcomes
- 3/week cadence recommendation (this piece fits the "value" slot)
- 1,200-1,500 words for article, or 8-12 slide carousel outline
- Save as \`repurposed/[source-slug]/linkedin-article.md\`

**6. Newsletter Edition**
- 500-800 words, value-first structure
- 3 subject line variants (curiosity, benefit, personal)
- Teaser that drives clicks without clickbait
- Clear CTA (reply, click, forward)
- Save as \`repurposed/[source-slug]/newsletter.md\`

**7. Social Posts** (5-8 posts)
- Quote cards (pull quotable lines from source)
- Twitter/X threads (3-7 tweets, standalone value per tweet)
- Image + caption specs (describe the visual, write the caption)
- **Stat card image specs** — for each key statistic from the source content, specify: stat number, context line, brand name, dimensions (1080x1080 for feed, 1080x1920 for stories), font/color guidance
- LinkedIn text posts (hook → insight → CTA format)
- Save as \`repurposed/[source-slug]/social-posts.md\`

**8. Distribution Schedule**
\`\`\`
DISTRIBUTION SCHEDULE — [Source Title]

Week 2, Day 1 (Monday): LinkedIn article + 2 social posts
Week 2, Day 2 (Tuesday): Newsletter edition
Week 2, Day 3 (Wednesday): Reddit thread + 2 social posts
Week 2, Day 4 (Thursday): YouTube script (record/upload)
Week 2, Day 5 (Friday): Short-form video 1 + 2 social posts
Week 2, Day 6-7: Short-form videos 2-3 + remaining social posts
\`\`\`
- Save as \`repurposed/[source-slug]/distribution-schedule.md\`

### Step 3: Save All Assets
Save complete repurposed package to:
\`\`\`
assets/[market-name]/content/repurposed/[source-slug]/
  blog-post.md
  youtube-script.md
  short-form-scripts.md
  reddit-thread.md
  linkedin-article.md
  newsletter.md
  social-posts.md
  distribution-schedule.md
\`\`\`

### Step 4: Update Pipeline State
\`\`\`json
{
  "organic_growth": {
    "content_repurpose": {
      "status": "active",
      "batches_completed": [N],
      "last_batch": {
        "source": "[source-slug]",
        "assets_generated": [N],
        "completed_at": "[timestamp]"
      }
    }
  }
}
\`\`\`

## Autonomy
Tier 1 — Full Auto for content generation.
Tier 2 — Notify & Proceed for presenting the repurposed package.

## Output
7+ platform-native assets + distribution schedule in \`content/repurposed/[source-slug]/\`.

## Next Step
User follows distribution schedule in Week 2 → Next \`/content-repurpose\` runs on next month's pillar → \`/seo-check\` runs at Month end.`;
