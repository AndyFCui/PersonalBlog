import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthor } from '@/hooks/useAuthor'
import { supabase } from '@/lib/supabase'

export function AdminAuthorEdit() {
  const { author, loading } = useAuthor()
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [github, setGithub] = useState('')
  const [email, setEmail] = useState('')
  const [bilibili, setBilibili] = useState('')
  const [wechat, setWechat] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (author) {
      setName(author.name || '')
      setAvatarUrl(author.avatar_url || '')
      setBio(author.bio || '')
      setGithub(author.github || '')
      setEmail(author.email || '')
      setBilibili(author.bilibili || '')
      setWechat(author.wechat || '')
    }
  }, [author])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const data = {
      name,
      avatar_url: avatarUrl || null,
      bio: bio || null,
      github: github || null,
      email: email || null,
      bilibili: bilibili || null,
      wechat: wechat || null,
    }

    if (author) {
      // Update existing
      const { error } = await supabase
        .from('authors')
        .update(data)
        .eq('id', author.id)

      if (!error) setSaved(true)
    } else {
      // Insert new
      const { error } = await supabase.from('authors').insert(data)
      if (!error) setSaved(true)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-secondary rounded" />
            <div className="h-64 bg-secondary rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-3xl font-bold">Author Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-500">Saved!</span>
            )}
            <Button onClick={handleSave} disabled={saving} className="shadow-lg">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarUrl || '/images/profilepic.jpg'} alt={name} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-accent text-white">
                {name.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{name || 'Your Name'}</p>
              <p className="text-sm text-muted-foreground">{bio || 'Your bio...'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio / Motto</label>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short bio or motto"
              />
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-medium mb-4 text-muted-foreground">Social Links</h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    GitHub
                  </label>
                  <Input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    📧 Email
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    📺 Bilibili
                  </label>
                  <Input
                    value={bilibili}
                    onChange={(e) => setBilibili(e.target.value)}
                    placeholder="https://bilibili.com/uid/xxx"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    💬 WeChat
                  </label>
                  <Input
                    value={wechat}
                    onChange={(e) => setWechat(e.target.value)}
                    placeholder="Your WeChat ID"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
