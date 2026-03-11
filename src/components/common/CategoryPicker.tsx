import type { Category } from '../../types'

interface CategoryPickerProps {
  categories: Category[]
  value?: string
  onChange: (id: string | undefined) => void
}

export function CategoryPicker({ categories, value, onChange }: CategoryPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange(undefined)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          !value ? 'bg-accent text-white border-accent' : 'border-border text-muted'
        }`}
      >
        없음
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            value === cat.id ? 'text-white border-transparent' : 'border-border text-muted'
          }`}
          style={value === cat.id ? { backgroundColor: cat.color } : {}}
        >
          <span style={{ color: value !== cat.id ? cat.color : undefined }}>
            {cat.icon} {cat.name}
          </span>
        </button>
      ))}
    </div>
  )
}
