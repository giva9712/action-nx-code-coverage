import {
  error as logError,
  getInput,
  info as logInfo,
  setFailed
} from '@actions/core'
import {MainInputs} from './interfaces'
import {main} from './main'

async function run(): Promise<void> {
  try {
    const noCoverageRan = getInput('no-coverage-ran') === 'true' || false
    const token = getInput('github-token')
    const coverageFolder = getInput('coverage-folder') || 'coverage'
    const coverageBaseFolder =
      getInput('coverage-base-folder') || 'coverage-base'

    const githubWorkspace = process.env.GITHUB_WORKSPACE
    logInfo(`githubWorkspace:  ${githubWorkspace}`)

    if (!githubWorkspace) {
      throw new Error('process.env.GITHUB_WORKSPACE cannot be empty')
    }

    const gistToken = getInput('gist-token')
    const gistId = getInput('gist-id')

    const mainInputs: MainInputs = {
      coverageRan: !noCoverageRan,
      coverageFolder,
      coverageBaseFolder,
      token,
      githubWorkspace,
      gistToken,
      gistId
    }

    await main(mainInputs)
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFailed((error as any).message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,github/no-then
run().catch((err: any) => {
  logError(err)
  setFailed(err.message)
})
