/**
 * Renders the CI/CD notice. Every value here arrives from the workflow
 * environment - a branch name, a commit subject, an actor - and a branch or a
 * commit message is free text that someone chose, so it is fenced exactly the
 * way visitor input is in `discord.ts`. A commit subject reading
 * `@everyone ship it` must land as characters, not as a ping.
 */

import { code } from './discord'

export type DeployStatus = 'success' | 'failure' | 'cancelled'

export type DeployInfo = {
  status: DeployStatus
  repository: string
  branch: string
  sha: string
  actor: string
  subject: string
  runUrl: string
  /** Absent when the gate failed before anything was uploaded. */
  deploymentUrl: string | null
}

/** A commit subject has no length limit; an embed field does. */
const SUBJECT_MAX = 160

/** Green and red carry the meaning here, so they are read from convention
 *  rather than the site palette. Cancelled reuses the slate already used for
 *  the quieter visitor message. */
const COLOURS: Record<DeployStatus, number> = {
  success: 0x3f9d5a,
  failure: 0xd93025,
  cancelled: 0x64748b,
}

const TITLES: Record<DeployStatus, string> = {
  success: '✅ Deployed',
  failure: '❌ Deploy failed',
  cancelled: '⚪ Deploy cancelled',
}

/** `main` is the project's production branch; anything else lands as a preview. */
export function environmentOf(branch: string): 'Production' | 'Preview' {
  return branch === 'main' ? 'Production' : 'Preview'
}

export function shortSha(sha: string): string {
  return sha.slice(0, 7)
}

function subjectOf(raw: string): string {
  // Only the first line: a commit body would push every other field off screen.
  const first = raw.split('\n')[0]?.trim() ?? ''
  if (!first) return '(no commit subject)'
  return first.length > SUBJECT_MAX ? `${first.slice(0, SUBJECT_MAX)}...` : first
}

export function deployEmbed(info: DeployInfo) {
  const fields = [
    { name: 'Environment', value: environmentOf(info.branch), inline: true },
    { name: 'Branch', value: code(info.branch), inline: true },
    { name: 'By', value: code(info.actor), inline: true },
    {
      name: 'Commit',
      value: `${code(shortSha(info.sha))} ${code(subjectOf(info.subject))}`,
      inline: false,
    },
  ]

  // A link is only worth printing when there is something behind it. On a
  // failed gate nothing was uploaded, so the run log is the only useful place
  // to go.
  if (info.deploymentUrl) {
    fields.push({ name: 'Deployment', value: info.deploymentUrl, inline: false })
  }
  fields.push({ name: 'Run', value: info.runUrl, inline: false })

  return {
    title: TITLES[info.status],
    color: COLOURS[info.status],
    fields,
    footer: { text: info.repository },
    timestamp: new Date().toISOString(),
  }
}
