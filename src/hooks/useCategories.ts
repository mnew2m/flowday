import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Category } from '../types'

const orderKey = (userId: string) => `category_order_${userId}`

function applyOrder(cats: Category[], userId: string): Category[] {
  const raw = localStorage.getItem(orderKey(userId))
  if (!raw) return cats
  try {
    const ids: string[] = JSON.parse(raw)
    const map = new Map(cats.map(c => [c.id, c]))
    const ordered = ids.flatMap(id => map.has(id) ? [map.get(id)!] : [])
    const rest = cats.filter(c => !ids.includes(c.id))
    return [...ordered, ...rest]
  } catch {
    return cats
  }
}

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (data) {
      setCategories(applyOrder(data.map(mapCategory), user.id))
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const addCategory = async (input: { name: string; color: string; icon?: string }) => {
    if (!user) return
    const now = new Date().toISOString()
    const newCat: Category = {
      id: uuidv4(),
      userId: user.id,
      name: input.name,
      color: input.color,
      icon: input.icon,
      createdAt: now,
    }
    setCategories(prev => [...prev, newCat])
    await supabase.from('categories').insert({
      id: newCat.id,
      user_id: newCat.userId,
      name: newCat.name,
      color: newCat.color,
      icon: newCat.icon,
      created_at: newCat.createdAt,
    })
  }

  const updateCategory = async (id: string, input: Partial<Pick<Category, 'name' | 'color' | 'icon'>>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...input } : c))
    await supabase.from('categories').update(input).eq('id', id)
  }

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    await supabase.from('categories').delete().eq('id', id)
  }

  const reorderCategories = (newOrder: Category[]) => {
    if (!user) return
    setCategories(newOrder)
    localStorage.setItem(orderKey(user.id), JSON.stringify(newOrder.map(c => c.id)))
  }

  return { categories, loading, addCategory, updateCategory, deleteCategory, reorderCategories, refetch: fetchCategories }
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    color: row.color as string,
    icon: row.icon as string | undefined,
    createdAt: row.created_at as string,
  }
}
