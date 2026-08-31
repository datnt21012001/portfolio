import { describe, expect, it } from 'vitest'
import { deployEmbed, environmentOf, shortSha, type DeployInfo } from './deploy'

const BASE: DeployInfo = {
  status: 'success',
  repository: 'datnt21012001/portfolio',
  branch: 'main',
  sha: '50cafcfa540e1ecb98a0fb26437e1e5cd3fb7abc',
  actor: 'datnt21012001',
  subject: 'Pin wrangler and add the deploy workflow',
  runUrl: 'https://github.com/datnt21012001/portfolio/actions/runs/1',
  deploymentUrl: 'https://cd0955f1.portfolio-datnt.pages.dev',
}

const valueOf = (embed: ReturnType<typeof deployEmbed>, name: string) =>
  embed.fields.find((f) => f.name === name)?.value

describe('environmentOf', () => {
  it('maps the production branch and nothing else', () => {
    expect(environmentOf('main')).toBe('Production')
    expect(environmentOf('feature/x')).toBe('Preview')
    expect(environmentOf('mains')).toBe('Preview')
  })
})

describe('shortSha', () => {
  it('takes the usual seven', () => {
    expect(shortSha(BASE.sha)).toBe('50cafcf')
  })
})

describe('deployEmbed', () => {
  it('titles and colours by status', () => {
    expect(deployEmbed(BASE).title).toBe('✅ Deployed')
    expect(deployEmbed({ ...BASE, status: 'failure' }).title).toBe('❌ Deploy failed')
    expect(deployEmbed({ ...BASE, status: 'cancelled' }).color).toBe(0x64748b)
    expect(deployEmbed(BASE).color).not.toBe(deployEmbed({ ...BASE, status: 'failure' }).color)
  })

  it('omits the deployment field when nothing was uploaded', () => {
    const embed = deployEmbed({ ...BASE, status: 'failure', deploymentUrl: null })
    expect(valueOf(embed, 'Deployment')).toBeUndefined()
    // The run link is the only place left to go, so it must survive.
    expect(valueOf(embed, 'Run')).toBe(BASE.runUrl)
  })

  it('fences a commit subject that would otherwise ping the channel', () => {
    const embed = deployEmbed({ ...BASE, subject: '@everyone ship it' })
    expect(valueOf(embed, 'Commit')).toBe('`50cafcf` `@everyone ship it`')
  })

  it('strips backticks rather than leaving a value that can escape its span', () => {
    const embed = deployEmbed({ ...BASE, subject: 'fix `code` path' })
    expect(valueOf(embed, 'Commit')).not.toContain('`fix `')
    expect(valueOf(embed, 'Commit')).toContain("fix 'code' path")
  })

  it('fences the branch too, since a branch name is free text', () => {
    expect(valueOf(deployEmbed({ ...BASE, branch: '@here' }), 'Branch')).toBe('`@here`')
  })

  it('keeps only the first line of a commit message', () => {
    const embed = deployEmbed({ ...BASE, subject: 'Subject line\n\nA body paragraph.' })
    expect(valueOf(embed, 'Commit')).toBe('`50cafcf` `Subject line`')
  })

  it('truncates a subject that would overflow the field', () => {
    const embed = deployEmbed({ ...BASE, subject: 'x'.repeat(400) })
    const value = valueOf(embed, 'Commit') ?? ''
    expect(value.length).toBeLessThan(200)
    expect(value).toContain('...')
  })

  it('says so rather than rendering an empty span for an empty subject', () => {
    expect(valueOf(deployEmbed({ ...BASE, subject: '   ' }), 'Commit')).toContain(
      '(no commit subject)',
    )
  })
})
