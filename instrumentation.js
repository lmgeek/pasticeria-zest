const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function ensureSeed() {
  const MAX_ATTEMPTS = 5

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { runSeed } = await import('./lib/seed.mjs')
      await runSeed()
      return
    } catch (error) {
      console.error(`[instrumentation] Seed attempt ${attempt}/${MAX_ATTEMPTS} failed:`, error?.message || error)
      if (attempt < MAX_ATTEMPTS) await sleep(5000)
    }
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await ensureSeed()
  }
}
