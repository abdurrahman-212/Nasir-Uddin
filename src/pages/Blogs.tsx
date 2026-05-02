import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Video, Image as ImageIcon, Facebook, Youtube, ExternalLink, Calendar } from 'lucide-react';
import { api } from '@/lib/api.ts';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderMedia = (url: string, type: string) => {
    if (!url) return null;

    if (type === 'youtube') {
      const vid = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return (
        <div className="aspect-video">
          <iframe 
            src={`https://www.youtube.com/embed/${vid}`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      );
    }

    if (type === 'facebook') {
      return (
        <div className="aspect-video bg-stone-100 dark:bg-stone-800 flex items-center justify-center relative overflow-hidden">
          <Facebook className="h-12 w-12 text-blue-600 opacity-20 absolute" />
          <div className="z-10 text-center p-4">
            <p className="text-xs font-bold uppercase mb-2">Watch on Facebook</p>
            <a href={url} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline">Open Facebook Video</Button>
            </a>
          </div>
        </div>
      );
    }

    return (
      <img src={url} alt="Blog header" className="w-full h-64 object-cover" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <header className="max-w-2xl mb-16">
        <h1 className="text-5xl font-serif font-bold mb-4">Latest <span className="text-primary italic">Lectures & Insights</span></h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">
          Scholarly reflections, educational videos, and spiritual guidance shared directly from Maulana Nasir Uddin Azhari.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, i) => (
            <motion.article 
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all"
            >
              <div className="relative">
                {renderMedia(blog.media_url, blog.media_type)}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm">
                    {blog.media_type === 'youtube' && <Youtube className="h-3 w-3 mr-1 text-red-600" />}
                    {blog.media_type === 'facebook' && <Facebook className="h-3 w-3 mr-1 text-blue-600" />}
                    {blog.media_type === 'image' && <ImageIcon className="h-3 w-3 mr-1 text-primary" />}
                    <span className="capitalize">{blog.media_type}</span>
                  </Badge>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(blog.created_at), 'MMMM dd, yyyy')}
                </div>
                <h2 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed line-clamp-4">
                  {blog.content}
                </p>
                <div className="pt-4 flex justify-between items-center">
                  <Button variant="ghost" className="p-0 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-transparent">
                    Read Full Article <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl">
          <p className="text-stone-500 text-lg">No posts yet. Stay tuned for updates.</p>
        </div>
      )}
    </div>
  );
}
