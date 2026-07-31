import mongoose from 'mongoose'

const storeConfigSchema = new mongoose.Schema(
  {
    chiave: { type: String, required: true, unique: true },
    valore: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.StoreConfig || mongoose.model('StoreConfig', storeConfigSchema)
