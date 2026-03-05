/**
 * Patches the CAFY Content Audit workflow via n8n REST API.
 * Fixes: Apify tokens, Claude AI node config, Switch node wiring.
 */

// Load from .env.local or environment variables
import { readFileSync } from 'fs';
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=').map(s => s.trim())).filter(([k]) => k));

const N8N_API_URL = env.N8N_API_URL || process.env.N8N_API_URL;
const N8N_API_KEY = env.N8N_API_KEY || process.env.N8N_API_KEY;
const WORKFLOW_ID = 'ZW5gaomGLVB70O3J';
const APIFY_TOKEN = env.APIFY_API_TOKEN || process.env.APIFY_API_TOKEN;
const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

async function main() {
  // 1. Fetch current workflow
  console.log('Fetching workflow...');
  const res = await fetch(`${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY }
  });
  if (!res.ok) {
    console.error('Failed to fetch workflow:', res.status, await res.text());
    process.exit(1);
  }
  const workflow = await res.json();
  console.log(`Got workflow: "${workflow.name}" with ${workflow.nodes.length} nodes`);

  // 2. Fix Apify tokens in all scraper + fetch nodes
  const apifyNodes = [
    'Scrape LinkedIn', 'Scrape Instagram', 'Scrape TikTok',
    'Scrape YouTube', 'Scrape Facebook', 'Scrape Twitter',
    'Fetch Scraped Data'
  ];

  for (const node of workflow.nodes) {
    if (apifyNodes.includes(node.name) && node.parameters.url) {
      const oldUrl = node.parameters.url;
      node.parameters.url = oldUrl.replace(/YOUR_APIFY_TOKEN_HERE/g, APIFY_TOKEN);
      if (oldUrl !== node.parameters.url) {
        console.log(`  ✓ Fixed Apify token in: ${node.name}`);
      }
    }
  }

  // 3. Configure Claude AI Analysis node
  const claudeNode = workflow.nodes.find(n => n.name === 'Claude AI Analysis');
  if (claudeNode) {
    claudeNode.parameters = {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      jsonParameters: true,
      options: {
        timeout: 120000
      },
      headerParametersJson: JSON.stringify({
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }),
      bodyParametersJson: `={
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "messages": [
    {
      "role": "user",
      "content": "You are CAFY, an expert content strategist and auditor. Analyze this creator's content data and return a structured JSON audit.\\n\\nCreator: {{ $json.name }}\\nPlatform: {{ $json.platform }}\\nProfile URL: {{ $json.profile_url }}\\nNiche: {{ $json.niche }}\\nContent Goal: {{ $json.content_goal }}\\nBiggest Frustration: {{ $json.frustration }}\\n\\nProfile Info:\\n- Followers: {{ $json.profile.followers }}\\n- Bio: {{ $json.profile.bio }}\\n\\nContent Metrics (last 20 posts):\\n- Posts analyzed: {{ $json.metrics.total_posts_analyzed }}\\n- Avg engagement per post: {{ $json.metrics.avg_engagement_per_post }}\\n- Most used format: {{ $json.metrics.most_used_format }}\\n- Total likes: {{ $json.metrics.total_likes }}\\n- Total comments: {{ $json.metrics.total_comments }}\\n- Total views: {{ $json.metrics.total_views }}\\n\\nRecent posts data:\\n{{ JSON.stringify($json.posts, null, 2) }}\\n\\nReturn ONLY valid JSON (no markdown fences, no explanation) with this exact structure:\\n{\\n  \\"current_reality\\": \\"2-3 sentence honest assessment of where this creator stands right now based on the data\\",\\n  \\"pain_points\\": [\\n    {\\"title\\": \\"short title\\", \\"evidence\\": \\"specific data point from their content\\", \\"impact\\": \\"what this is costing them in reach/growth/revenue\\"}\\n  ],\\n  \\"content_gaps\\": [\\n    {\\"topic\\": \\"content topic they are missing\\", \\"reason\\": \\"why this matters for their specific niche\\", \\"opportunity\\": \\"concrete outcome if they fill this gap\\"}\\n  ],\\n  \\"upscale_roadmap\\": {\\n    \\"week_1\\": \\"specific actionable task for week 1\\",\\n    \\"week_2\\": \\"specific actionable task for week 2\\",\\n    \\"week_3\\": \\"specific actionable task for week 3\\",\\n    \\"week_4\\": \\"specific actionable task for week 4\\",\\n    \\"recommended_formats\\": [\\"format1\\", \\"format2\\"],\\n    \\"posting_frequency\\": \\"X times per week for maximum reach\\"\\n  },\\n  \\"automation_opportunity\\": \\"2-3 sentences about how content automation could transform their workflow. End with a soft pitch: imagine having topics researched, content drafted, visuals generated, and posts scheduled automatically — that is what CAFY builds.\\"\\n}\\n\\nProvide exactly 3 pain_points and exactly 5 content_gaps. Make everything hyper-specific to their niche ({{ $json.niche }}), platform ({{ $json.platform }}), and actual performance data. Do not be generic."
    }
  ]
}`
    };
    console.log('  ✓ Configured Claude AI Analysis node');
  }

  // 4. Wire Facebook (output 4) and Twitter (output 5) in Switch connections
  const switchConns = workflow.connections['Route by Platform'];
  if (switchConns && switchConns.main) {
    // Ensure we have 6 outputs (0-5)
    while (switchConns.main.length < 6) {
      switchConns.main.push([]);
    }
    // Output 4 → Scrape Facebook
    if (!switchConns.main[4] || switchConns.main[4].length === 0) {
      switchConns.main[4] = [{ node: 'Scrape Facebook', type: 'main', index: 0 }];
      console.log('  ✓ Wired Switch output 4 → Scrape Facebook');
    }
    // Output 5 → Scrape Twitter
    if (!switchConns.main[5] || switchConns.main[5].length === 0) {
      switchConns.main[5] = [{ node: 'Scrape Twitter', type: 'main', index: 0 }];
      console.log('  ✓ Wired Switch output 5 → Scrape Twitter');
    }
  }

  // 5. Push updated workflow
  console.log('\nPushing updated workflow...');
  const updateRes = await fetch(`${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
    method: 'PUT',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: { executionOrder: 'v1' }
    })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    console.error('Failed to update workflow:', updateRes.status, errText);
    process.exit(1);
  }

  const updated = await updateRes.json();
  console.log(`✓ Workflow updated successfully! Version: ${updated.versionId}`);
  console.log('\nRemaining manual steps:');
  console.log('  - Create Google Sheet and set ID in "Save to Google Sheets" node');
  console.log('  - Attach Gmail OAuth credentials to 3 Gmail nodes');
  console.log('  - Activate the workflow');
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
