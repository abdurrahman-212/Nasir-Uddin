import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { api } from '@/lib/api.ts';

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    api.getGallery()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <header className="max-w-2xl mb-16 text-center mx-auto">
        <h1 className="text-5xl font-serif font-bold mb-4">The <span className="text-primary italic">Visual Gallery</span></h1>
        <p className="text-stone-500 dark:text-stone-400">
          A collection of spiritual and artistic moments captured through the professional lens of Maulana Nasir Uddin Azhari.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-square bg-stone-200 dark:bg-stone-800 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              onClick={() => setSelectedImage(item.image_url)}
            >
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex justify-between items-center text-white">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60">{item.category}</p>
                    <p className="font-serif italic">{item.title}</p>
                  </div>
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl">
          <ImageIcon className="h-12 w-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500 text-lg">No gallery items yet.</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </motion.button>
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
