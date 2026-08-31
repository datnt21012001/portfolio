/**
 * Posts the CI/CD notice. This runs after the deploy step whatever happened,
 * so it must tolerate a half-finished run: the deployment URL is absent when
 * the gate failed, and `send` already swallows a webhook that is down. A
 * Discord outage must never be what turns a green deploy red.
 *
 * All of the rendering lives in `server/deploy.ts`, where the test suite can
 * reach it. This file only marshals the workflow environment into it.
 */

import { send } from '../server/discord'
import { deployEmbed, type DeployStatus } from '../server/deploy'

const webhook = process.env.DISCORD_DEPLOY_WEBHOOK_URL
if (!webhook) {
  // Not configured is a choice, not a failure: the workflow stays usable for
  // anyone who has not set the secret.
  console.log('DISCORD_DEPLOY_WEBHOOK_URL is not set; deploy not announced')
  process.exit(0)
}

const raw = process.env.DEPLOY_STATUS
const status: DeployStatus =
  raw === 'success' || raw === 'failure' || raw === 'cancelled' ? raw : 'failure'

await send(
  webhook,
  deployEmbed({
    status,
    repository: process.env.GITHUB_REPOSITORY ?? 'unknown',
    branch: process.env.GITHUB_REF_NAME ?? 'unknown',
    sha: process.env.GITHUB_SHA ?? '',
    actor: process.env.GITHUB_ACTOR ?? 'unknown',
    subject: process.env.COMMIT_SUBJECT ?? '',
    runUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
    deploymentUrl: process.env.DEPLOYMENT_URL || null,
  }),
)
