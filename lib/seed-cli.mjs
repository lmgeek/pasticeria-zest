import 'dotenv/config'
import { runSeed } from './seed.mjs'

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[seed] Seed error:', error)
    process.exit(1)
  })
