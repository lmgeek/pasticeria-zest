import mongoose from 'mongoose'

const saleSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleItem' }],
    totale: { type: Number, required: true, min: 0 },
    stato: { type: String, enum: ['pendente', 'pagato', 'cancellato'], default: 'pendente' },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema)
