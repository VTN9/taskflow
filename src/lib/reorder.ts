import { arrayMove } from '@dnd-kit/sortable'

export function reorderWithinFullList(
  fullOrder: string[],
  displayed: string[],
  oldIndex: number,
  newIndex: number,
): string[] {
  const moved = arrayMove(displayed, oldIndex, newIndex)
  const displayedSet = new Set(displayed)
  let index = 0
  return fullOrder.map((id) => (displayedSet.has(id) ? moved[index++] : id))
}
