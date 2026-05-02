import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Camera, Video, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Home() {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    api.getBlogs().then(data => setRecentBlogs(data.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-stone-900/40 dark:bg-stone-950/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=2070" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-primary/20 backdrop-blur-md border border-white/20 rounded-full">
              Al-Azhar Al-Sharif Scholar
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-[1.1]">
              Deeply Rooted in Tradition, <br />
              <span className="text-amber-500">Leading the Future.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 mb-10 font-light leading-relaxed max-w-2xl">
              Spreading spiritual wisdom and moderate Islamic thought through deep scholarship and contemporary media.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button size="lg" className="bg-primary hover:bg-accent text-white px-8 h-12 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                  Scholarly Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 h-12 rounded-full text-sm font-bold uppercase tracking-wider">
                  Contact Office
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: 'Deep Scholarship', desc: 'Authentic knowledge grounded in the centuries-old tradition of Al-Azhar University.' },
            { icon: Camera, title: 'Visual Media', desc: 'Capturing the beauty of creation through a spiritual and professional artistic lens.' },
            { icon: Video, title: 'Digital Insights', desc: 'Connecting with the global community via high-quality digital content.' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-primary/30 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-primary">{item.title}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Blogs Teaser */}
      <section className="bg-white dark:bg-stone-900/50 py-24 border-y border-stone-100 dark:border-stone-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-3">Latest Insights</div>
              <h2 className="text-5xl font-serif font-bold text-primary">Scholarly <span className="italic text-stone-400">Reflections</span></h2>
            </div>
            <Link to="/blogs">
              <Button variant="outline" className="rounded-full px-8 border-stone-200 hover:border-primary hover:text-primary text-[11px] font-bold uppercase tracking-widest">
                The Archive <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <motion.div 
                  key={blog.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                >
                  {blog.media_url && blog.media_type === 'image' ? (
                    <img src={blog.media_url} className="w-full h-56 object-cover" alt={blog.title} />
                  ) : (
                    <div className="w-full h-56 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                       <Video className="h-8 w-8 text-stone-300" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-serif font-bold mb-4 line-clamp-2 leading-snug">{blog.title}</h3>
                    <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed mb-6">
                      {blog.content}
                    </p>
                    <div className="mt-auto">
                      <Link to="/blogs" className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                        Read Full Article →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-stone-400 font-serif italic py-24 border border-dashed rounded-3xl">Patience... more knowledge is being prepared.</p>
            )}
          </div>
        </div>
      </section>

      {/* Profile Summary / About Mini */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-center gap-24">
          <div className="w-full md:w-5/12">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full border border-primary/20 rounded-3xl z-0" />
              <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1000" 
                  alt="Maulana Nasir Uddin" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-7/12 space-y-8">
            <div>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">The Person Behind the Path</div>
              <h2 className="text-5xl font-serif font-bold text-primary leading-tight">Authentic Roots, <br /><span className="italic text-stone-400 font-medium">Global Perspective.</span></h2>
            </div>
            
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg font-serif italic">
               "Knowledge is the inheritance of the soul, and its dissemination is the highest form of service."
            </p>
            
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
              An alumnus of the world-renowned Al-Azhar University, Maulana Nasir Uddin Azhari brings a unique blend of traditional authority and contemporary relevance to every interaction.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {[
                'Al-Azhar University Alumnus',
                'Digital Literacy Advocate',
                'Visual Content Creator',
                'Strategic Thought Leader'
              ].map((point, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{point}</span>
                </div>
              ))}
            </div>

            <Link to="/about">
              <Button className="rounded-full px-10 h-14 bg-primary hover:bg-accent text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                The Detailed Biography
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
