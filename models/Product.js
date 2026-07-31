import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descrizione: { type: String, default: '' },
    prezzo: { type: Number, required: true, min: 0 },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    immagine: { type: String, default: '' },
    attivo: { type: Boolean, default: true },
    disponibile: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model('Product', productSchema)
