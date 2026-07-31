import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import StoreConfig from '@/models/StoreConfig'
import fs from 'fs'
import path from 'path'

export async function POST() {
  const envPath = path.join(process.cwd(), '.env.local')

  let envVars = {}

  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      envVars[key] = val
    }
  }

  const envKeys = {
    stripeSecretKey: envVars.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY,
    stripePublishableKey: envVars.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY,
    stripeWebhookSecret: envVars.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET,
  }

  const missing = Object.entries(envKeys)
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length > 0) {
    return NextResponse.json({
      message: `Variabili mancanti in .env.local: ${missing.join(', ')}`,
    }, { status: 400 })
  }

  try {
    await connectDB()

    for (const [chiave, valore] of Object.entries(envKeys)) {
      await StoreConfig.findOneAndUpdate(
        { chiave },
        { valore },
        { upsert: true }
      )
    }

    return NextResponse.json({ message: 'Configurazioni Stripe caricate con successo!' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
