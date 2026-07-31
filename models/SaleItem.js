import mongoose from 'mongoose'

const saleItemSchema = new mongoose.Schema(
  {
    prodotto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nome: { type: String, required: true },
    quantita: { type: Number, required: true, min: 1 },
    prezzoUnitario: { type: Number, required: true, min: 0 },
    subtotale: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.SaleItem || mongoose.model('SaleItem', saleItemSchema)
