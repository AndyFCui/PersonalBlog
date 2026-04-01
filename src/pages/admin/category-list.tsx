import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit2, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconPicker } from '@/components/icon-picker'
import { useCategories, type Category } from '@/hooks/useCategories'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

function CategoryRow({ category, onUpdate }: { category: Category; onUpdate: (cat: Category) => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [icon, setIcon] = useState(category.icon)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    const { error } = await supabase
      .from('categories')
      .update({ name, icon })
      .eq('id', category.id)

    if (!error) {
      onUpdate({ ...category, name, icon })
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    if (!error) {
      window.location.reload()
    }
    setDeleting(false)
  }

  if (editing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50"
      >
        <IconPicker value={icon} onChange={setIcon} />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          placeholder="Category name"
        />
        <Button size="sm" onClick={handleSave} className="bg-primary">
          <Save className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-sm text-muted-foreground">{category.count} articles</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function AdminCategoryList() {
  const { categories, loading, error } = useCategories()
  const { user } = useAuth()
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📄')
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newName, icon: newIcon, count: 0 })
      .select()
      .single()

    if (!error && data) {
      window.location.reload()
    }
    setAdding(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/admin/blogs"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Categories</h1>
            {user && <p className="text-sm text-muted-foreground mt-1">{user.email}</p>}
          </div>
        </div>

        {/* Add New Category */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <IconPicker value={newIcon} onChange={setNewIcon} />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Category name"
                  className="w-full"
                />
              </div>
              <Button onClick={handleAdd} disabled={adding || !newName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                {adding ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">Error: {error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No categories yet. Create your first one above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onUpdate={(updated) => {
                      // Update will trigger reload
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
