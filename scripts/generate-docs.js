const { Octokit } = require('@octokit/rest');
const { Client } = require('@notionhq/client');
const axios = require('axios');

// Initialize clients
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function extractLinksFromPR(prNumber, owner, repo) {
  const { data: pr } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const description = pr.body;
  
  // Extract Productive task link and preview link using regex
  const productiveLinkMatch = description.match(/https:\/\/app\.productive\.io\/\S+/);
  const previewLinkMatch = description.match(/https:\/\/[^\s]+\.myshopify\.com\/\S+/);

  return {
    productiveLink: productiveLinkMatch ? productiveLinkMatch[0] : null,
    previewLink: previewLinkMatch ? previewLinkMatch[0] : null,
    prDescription: description,
  };
}

async function getProductiveTaskDescription(productiveLink) {
  try {
    // Extract task ID from the Productive link and clean it
    const taskId = productiveLink.split('/').pop().replace(/[^0-9]/g, '');
    
    if (!taskId) {
      throw new Error('Invalid Productive task ID');
    }

    // Make API call to Productive
    const response = await axios.get(`https://api.productive.io/api/v2/tasks/${taskId}`, {
      headers: {
        'X-Auth-Token': process.env.PRODUCTIVE_API_KEY,
        'Content-Type': 'application/json',
        'X-Organization-Id': process.env.PRODUCTIVE_ORG_ID // Add organization ID
      },
    });

    if (!response.data || !response.data.data || !response.data.data.attributes) {
      throw new Error('Invalid response from Productive API');
    }

    return response.data.data.attributes.description || 'No description available';
  } catch (error) {
    console.error('Error fetching Productive task:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return 'Error fetching task description from Productive';
  }
}

async function getPRChanges(prNumber, owner, repo) {
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  return files.map(file => ({
    filename: file.filename,
    patch: file.patch,
  }));
}

async function createNotionPage(title, content) {
  const response = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              text: {
                content: content,
              },
            },
          ],
        },
      },
    ],
  });

  return response.url;
}

async function updatePRDescription(prNumber, owner, repo, notionPageUrl) {
  const { data: pr } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const newDescription = `${pr.body}\n\nDocumentation: ${notionPageUrl}`;

  await octokit.pulls.update({
    owner,
    repo,
    pull_number: prNumber,
    body: newDescription,
  });
}

async function main() {
  try {
    // Get PR information from GitHub context
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const prNumber = process.env.GITHUB_REF.split('/')[2];

    // Extract links from PR description
    const { productiveLink, previewLink, prDescription } = await extractLinksFromPR(prNumber, owner, repo);

    if (!productiveLink || !previewLink) {
      console.error('Missing required links in PR description!!!');
      process.exit(1);
    }

    // Get task description from Productive
    const taskDescription = await getProductiveTaskDescription(productiveLink);

    // Get PR changes
    const changes = await getPRChanges(prNumber, owner, repo);

    // Generate documentation content
    const docContent = `
# Shopify Section Documentation

## Task Description
${taskDescription}

## Preview
You can view the changes at: ${previewLink}

## Code Changes
${changes.map(change => `
### ${change.filename}
\`\`\`diff
${change.patch}
\`\`\`
`).join('\n')}
    `;

    // Create Notion page
    const notionPageUrl = await createNotionPage(
      `Documentation for PR #${prNumber}`,
      docContent
    );

    // Update PR description with Notion page link
    await updatePRDescription(prNumber, owner, repo, notionPageUrl);

    console.log('Documentation generated and PR updated successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 