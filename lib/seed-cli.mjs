import 'dotenv/config'
import { runSeedAndClose } from './seed.mjs'

runSeedAndClose()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[seed] Seed error:', error)
    process.exit(1)
  })
