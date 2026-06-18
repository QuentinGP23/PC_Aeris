import {
  Cpu,
  Circuitry,
  Cube,
  Memory,
  GraphicsCard,
  HardDrive,
  Fan,
  Lightning,
  type Icon,
  type IconProps,
} from '@phosphor-icons/react'
import type { CategoryKey } from '../../types'

/**
 * Icône Phosphor associée à chaque catégorie de composant.
 * Source unique de vérité : à utiliser partout via <CategoryIcon> plutôt que des emojis.
 */
const CATEGORY_ICONS: Record<CategoryKey, Icon> = {
  cpu: Cpu,
  motherboard: Circuitry,
  pc_case: Cube,
  ram: Memory,
  gpu: GraphicsCard,
  storage: HardDrive,
  cpu_cooler: Fan,
  psu: Lightning,
}

interface CategoryIconProps extends IconProps {
  cat: CategoryKey
}

/** Rend l'icône de la catégorie. Accepte toutes les props Phosphor (size, weight, color…). */
export function CategoryIcon({ cat, ...props }: CategoryIconProps) {
  const Ico = CATEGORY_ICONS[cat]
  return <Ico aria-hidden {...props} />
}
