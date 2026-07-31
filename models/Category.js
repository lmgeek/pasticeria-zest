import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descrizione: { type: String, default: '' },
    ordine: { type: Number, default: 0 },
    attivo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Category || mongoose.model('Category', categorySchema)
