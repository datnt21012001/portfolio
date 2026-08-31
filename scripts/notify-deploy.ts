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
  // Not configured is a choice, not a failure, so this does not fail the run.
  // It is a workflow annotation rather than a log line because a run that
  // announces nothing is indistinguishable from a step that never fired, and
  // guessing which one you are looking at costs more than the warning does.
  console.log(
    '::warning title=Deploy not announced::DISCORD_DEPLOY_WEBHOOK_URL is not set, so no Discord notice was sent for this run.',
  )
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
    // "skipped" means the gate rejected the commit and the upload was never
    // reached; anything else means the deploy step actually ran.
    deployAttempted: process.env.DEPLOY_OUTCOME !== 'skipped',
  }),
)
