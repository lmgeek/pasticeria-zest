import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import connectDB from './db.js'

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, ruolo: user.ruolo }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const verifyToken = async (request) => {
  const header = request.headers.get('authorization')
  if (!header || !header.startsWith('Bearer ')) return null

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    await connectDB()
    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.attivo) return null
    return user
  } catch {
    return null
  }
}
