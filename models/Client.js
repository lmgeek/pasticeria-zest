import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    telefono: { type: String, trim: true },
    indirizzo: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.models.Client || mongoose.model('Client', clientSchema)
