const fs = require('node:fs')

const commitMsgFile = process.argv[2]
const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim()
const pattern =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,100}$/

if (!pattern.test(commitMsg)) {
  console.error(
    '❌ Commit message does not follow Conventional Commits format.',
  )
  console.error('   Expected: <type>(<scope>): <description>')
  console.error(
    '   Types: feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert',
  )
  console.error('   Example: feat(auth): add login page')
  process.exit(1)
}
