import mongoose from 'mongoose'
import User from '../models/User.js'
import Category from '../models/Category.js'
import StoreConfig from '../models/StoreConfig.js'

const DEFAULT_ADMIN = {
  email: 'luismarin@usa.com',
  password: 'LuisMarin.123',
  nome: 'Luis Marin',
  ruolo: 'admin',
}

const DEFAULT_CATEGORIES = [
  { nome: 'Torte', slug: 'torte', descrizione: 'Torte artigianali', ordine: 1 },
  { nome: 'Dolci', slug: 'dolci', descrizione: 'Dolci da forno', ordine: 2 },
  { nome: 'Biscotti', slug: 'biscotti', descrizione: 'Biscotti artigianali', ordine: 3 },
  { nome: 'Bevande', slug: 'bevande', descrizione: "Caffè, tè e cioccolate", ordine: 4 },
]

const DEFAULT_CONFIGS = {
  storeName: 'Zest Pasticceria',
  storeEmail: 'info@zestpasticceria.com',
  storePhone: '',
  storeAddress: '',
  storeVat: '',
  storeCurrency: 'eur',
  defaultLanguage: 'it',
  availableLanguages: ['it', 'es', 'en'],
  underConstruction: false,
  stripePublishableKey: '',
  stripeSecretKey: '',
  stripeWebhookSecret: '',
}

async function ensureConfigs() {
  const ops = Object.entries(DEFAULT_CONFIGS).map(([chiave, valore]) => ({
    updateOne: {
      filter: { chiave },
      update: { $setOnInsert: { chiave, valore } },
      upsert: true,
    },
  }))
  const result = await StoreConfig.bulkWrite(ops)
  console.log(`[seed] Configs upserted (inserted: ${result.upsertedCount})`)
}

async function ensureCategories() {
  let created = 0
  for (const cat of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ slug: cat.slug })
    if (!exists) {
      await Category.create(cat)
      created++
    }
  }
  console.log(`[seed] Categories ensured (created: ${created})`)
}

async function ensureAdmin() {
  const adminExists = await User.findOne({ email: DEFAULT_ADMIN.email })
  if (!adminExists) {
    await User.create(DEFAULT_ADMIN)
    console.log('[seed] Admin user created (luismarin@usa.com)')
  } else {
    console.log('[seed] Admin user already exists')
  }
}

export async function runSeed() {
  if (!process.env.MONGODB_URI) {
    console.warn('[seed] MONGODB_URI no configurada, se omite el seed.')
    return
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  console.log('[seed] Connected to MongoDB')

  await ensureAdmin()
  await ensureCategories()
  await ensureConfigs()

  console.log('[seed] Seed completed successfully')
}

export async function runSeedAndClose() {
  try {
    await runSeed()
  } finally {
    await mongoose.disconnect()
  }
}
