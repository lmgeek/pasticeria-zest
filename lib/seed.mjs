import mongoose from 'mongoose'
import User from '../models/User.js'
import Category from '../models/Category.js'
import StoreConfig from '../models/StoreConfig.js'

export async function runSeed() {
  if (!process.env.MONGODB_URI) {
    console.warn('[seed] MONGODB_URI no configurada, se omite el seed.')
    return
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  console.log('[seed] Connected to MongoDB')

  const adminExists = await User.findOne({ email: 'luismarin@usa.com' })
  if (!adminExists) {
    await User.create({
      email: 'luismarin@usa.com',
      password: 'LuisMarin.123',
      nome: 'Luis Marin',
      ruolo: 'admin',
    })
    console.log('[seed] Admin user created (luismarin@usa.com)')
  } else {
    console.log('[seed] Admin user already exists')
  }

  const categories = [
    { nome: 'Torte', slug: 'torte', descrizione: 'Torte artigianali', ordine: 1 },
    { nome: 'Dolci', slug: 'dolci', descrizione: 'Dolci da forno', ordine: 2 },
    { nome: 'Biscotti', slug: 'biscotti', descrizione: 'Biscotti artigianali', ordine: 3 },
    { nome: 'Bevande', slug: 'bevande', descrizione: "Caffè, tè e cioccolate", ordine: 4 },
  ]

  for (const cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug })
    if (!exists) {
      await Category.create(cat)
      console.log(`[seed] Category "${cat.nome}" created`)
    }
  }

  const configs = [
    { chiave: 'storeName', valore: 'Zest Pasticceria' },
    { chiave: 'storeEmail', valore: 'info@zestpasticceria.com' },
    { chiave: 'storePhone', valore: '' },
    { chiave: 'storeAddress', valore: '' },
    { chiave: 'storeVat', valore: '' },
    { chiave: 'storeCurrency', valore: 'eur' },
    { chiave: 'defaultLanguage', valore: 'it' },
    { chiave: 'availableLanguages', valore: ['it', 'es', 'en'] },
    { chiave: 'stripePublishableKey', valore: '' },
    { chiave: 'stripeSecretKey', valore: '' },
    { chiave: 'stripeWebhookSecret', valore: '' },
  ]

  for (const cfg of configs) {
    const exists = await StoreConfig.findOne({ chiave: cfg.chiave })
    if (!exists) {
      await StoreConfig.create(cfg)
      console.log(`[seed] Config "${cfg.chiave}" created`)
    }
  }

  console.log('[seed] Seed completed successfully')
}
