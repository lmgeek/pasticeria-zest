export const rbac = (user, ...allowedRoles) => {
  if (!user) return { allowed: false, message: 'Accesso negato. Autenticazione richiesta.' }
  if (!allowedRoles.includes(user.ruolo)) return { allowed: false, message: 'Permessi insufficienti.' }
  return { allowed: true }
}
