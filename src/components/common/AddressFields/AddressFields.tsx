import type { AddressInput } from '../../../services'
import { Input } from '../Input'
import './AddressFields.scss'

interface Props {
  value: AddressInput
  onChange: (next: AddressInput) => void
}

/** Champs partagés du formulaire d'adresse (profil + commande). */
export function AddressFields({ value, onChange }: Props) {
  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value })

  return (
    <div className="addr-fields">
      <Input label="Libellé (optionnel)" value={value.label ?? ''} onChange={set('label')} placeholder="ex. Maison, Bureau" fullWidth />
      <Input label="Nom complet" value={value.fullName} onChange={set('fullName')} placeholder="Jean Dupont" fullWidth />
      <Input label="Adresse" value={value.address} onChange={set('address')} placeholder="12 rue des Lilas" fullWidth />
      <div className="addr-fields__row">
        <Input label="Code postal" value={value.zip} onChange={set('zip')} placeholder="75011" inputMode="numeric" maxLength={5} fullWidth />
        <Input label="Ville" value={value.city} onChange={set('city')} placeholder="Paris" fullWidth />
      </div>
      <Input label="Téléphone" type="tel" value={value.phone} onChange={set('phone')} placeholder="06 12 34 56 78" inputMode="tel" fullWidth />
    </div>
  )
}

export default AddressFields
