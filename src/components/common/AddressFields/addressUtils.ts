import type { AddressInput } from '../../../services'

export const emptyAddress: AddressInput = { label: '', fullName: '', address: '', zip: '', city: '', phone: '' }

/** Renvoie un message d'erreur si l'adresse est incomplète, sinon null. */
export function validateAddress(a: AddressInput): string | null {
  if (!a.fullName.trim()) return 'Le nom complet est requis.'
  if (!a.address.trim()) return "L'adresse est requise."
  if (!/^\d{5}$/.test(a.zip.trim())) return 'Le code postal doit comporter 5 chiffres.'
  if (!a.city.trim()) return 'La ville est requise.'
  if (a.phone.trim().length < 8) return 'Le téléphone est requis.'
  return null
}
