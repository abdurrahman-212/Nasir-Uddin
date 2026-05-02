import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  BarChart3, LayoutGrid, Image as ImageIcon, Settings as SettingsIcon, 
  Plus, Trash2, LogOut, Loader2, Save, Globe, Video as VideoIcon, 
  Facebook as FacebookIcon, CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/lib/api.ts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      try {
        const [b, g, s] = await Promise.all([
          api.getBlogs(),
          api.getGallery(),
          api.getSettings()
        ]);
        setBlogs(b);
        setGallery(g);
        setSettings(s);
      } catch (err) {
        toast.error('Session expired. Please login again.');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold">Admin <span className="text-amber-600">Dashboard</span></h1>
          <p className="text-stone-500">Manage your scholarly content and digital presence.</p>
        </div>
        <Button variant="ghost" className="text-stone-500 hover:text-red-500" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>

      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList className="bg-stone-100 dark:bg-stone-900 grid grid-cols-3 max-w-md">
          <TabsTrigger value="blogs"><LayoutGrid className="h-4 w-4 mr-2" /> Blogs</TabsTrigger>
          <TabsTrigger value="gallery"><ImageIcon className="h-4 w-4 mr-2" /> Gallery</TabsTrigger>
          <TabsTrigger value="settings"><SettingsIcon className="h-4 w-4 mr-2" /> Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs">
          <BlogsTab blogs={blogs} setBlogs={setBlogs} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryTab items={gallery} setItems={setGallery} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- TAB COMPONENTS ---

function BlogsTab({ blogs, setBlogs }: any) {
  const [newBlog, setNewBlog] = useState({ title: '', content: '', media_url: '', media_type: 'image' });

  const addBlog = async () => {
    if (!newBlog.title || !newBlog.content) return toast.error('Fill in required fields');
    try {
      const res = await api.createBlog(newBlog);
      setBlogs([{ ...newBlog, id: res.id, created_at: new Date().toISOString() }, ...blogs]);
      setNewBlog({ title: '', content: '', media_url: '', media_type: 'image' });
      toast.success('Blog created successfully');
    } catch (err) {
      toast.error('Failed to create blog');
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      await api.deleteBlog(id);
      setBlogs(blogs.filter((b: any) => b.id !== id));
      toast.success('Blog deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 dark:border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2 h-5 w-5" /> New Blog Post</CardTitle>
          <CardDescription>Add informative articles or link social media videos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Title of your post" 
              value={newBlog.title} 
              onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} 
            />
            <div className="flex gap-2">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newBlog.media_type}
                onChange={e => setNewBlog({ ...newBlog, media_type: e.target.value })}
              >
                <option value="image">Image URL</option>
                <option value="youtube">YouTube Link</option>
                <option value="facebook">Facebook Link</option>
              </select>
            </div>
          </div>
          <Input 
            placeholder="Media URL (Image URL, YouTube full link, or Facebook video link)" 
            value={newBlog.media_url} 
            onChange={e => setNewBlog({ ...newBlog, media_url: e.target.value })} 
          />
          <Textarea 
            placeholder="Detailed content of your blog post..." 
            className="min-h-[150px]"
            value={newBlog.content}
            onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
          />
          <Button className="w-full bg-primary hover:bg-accent h-12" onClick={addBlog}>
            Publish Content
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {blogs.map((b: any) => (
          <div key={b.id} className="flex items-center justify-between p-4 border rounded-xl dark:border-stone-800 bg-white dark:bg-stone-900 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
                {b.media_type === 'youtube' ? <VideoIcon className="text-red-500" /> : b.media_type === 'facebook' ? <FacebookIcon className="text-blue-500" /> : <ImageIcon className="text-primary" />}
              </div>
              <div>
                <h4 className="font-bold">{b.title}</h4>
                <p className="text-xs text-stone-500">Published on {new Date(b.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 opacity-0 group-hover:opacity-100" onClick={() => deleteBlog(b.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ items, setItems }: any) {
  const [newItem, setNewItem] = useState({ title: '', image_url: '', category: 'General' });

  const addItem = async () => {
    if (!newItem.image_url) return toast.error('Image URL is required');
    try {
      const res = await api.createGallery(newItem);
      setItems([{ ...newItem, id: res.id, created_at: new Date().toISOString() }, ...items]);
      setNewItem({ title: '', image_url: '', category: 'General' });
      toast.success('Gallery item added');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await api.deleteGallery(id);
      setItems(items.filter((i: any) => i.id !== id));
      toast.success('Item removed');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle>Add to Gallery</CardTitle>
          <CardDescription>Share your scholarly and artistic photography.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Alt Text / Title" className="md:col-span-1" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
          <Input placeholder="Category" className="md:col-span-1" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} />
          <Input placeholder="Direct Image URL" className="md:col-span-2" value={newItem.image_url} onChange={e => setNewItem({ ...newItem, image_url: e.target.value })} />
          <Button className="md:col-span-4" onClick={addItem}>Add Image</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border dark:border-stone-800">
            <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button variant="ghost" size="icon" className="text-white" onClick={() => deleteItem(item.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ settings }: any) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.updateSettings(localSettings);
      toast.success('Settings synchronized!');
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary" /> Public Identity
          </h3>
          <Separator />
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-stone-500">Contact Email (Form Submissions Display)</label>
            <Input 
              value={localSettings.contact_email} 
              onChange={e => setLocalSettings({ ...localSettings, contact_email: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-stone-500">Main Biography / Intro</label>
            <Textarea 
              className="min-h-[150px]"
              value={localSettings.bio} 
              onChange={e => setLocalSettings({ ...localSettings, bio: e.target.value })} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold flex items-center">
            <FacebookIcon className="mr-2 h-5 w-5 text-blue-600" /> Social Integrations
          </h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500">Facebook URL</label>
              <Input placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500">YouTube Channel</label>
              <Input placeholder="https://youtube.com/c/..." />
            </div>
          </div>
        </div>

        <Button 
          className="w-full h-14 bg-stone-900 dark:bg-stone-100 dark:text-black mt-8 text-lg"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
          Apply Changes Globally
        </Button>
      </div>
    </div>
  );
}
