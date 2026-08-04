import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import StoreConfig from '@/models/StoreConfig'

export async function GET() {
  try {
    const publicKeys = [
      'storeName', 'storeEmail', 'storePhone', 'storeAddress',
      'storeVat', 'storeCurrency', 'defaultLanguage',
      'availableLanguages', 'stripePublishableKey',
      'underConstruction',
    ]

    await connectDB()
    const configs = await StoreConfig.find({ chiave: { $in: publicKeys } })
    const result = {}
    configs.forEach((c) => { result[c.chiave] = c.valore })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
