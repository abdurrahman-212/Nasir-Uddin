import { Facebook, Youtube, Twitter, Instagram, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-serif italic text-sm">A</div>
              <h3 className="text-xl font-serif font-bold text-primary">Nasir Uddin Azhari</h3>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-xs italic">
              Dedicated to the dissemination of spiritual wisdom and moderate Islamic thought through contemporary media.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Directory</h4>
            <ul className="space-y-3 text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Biography</Link></li>
              <li><Link to="/blogs" className="hover:text-primary transition-colors">Lectures</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li className="pt-2">
                <Link to="/admin/login" className="flex items-center gap-2 group text-stone-400 hover:text-primary transition-colors">
                  <Lock className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Digital Hubs</h4>
            <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-all">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Facebook
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-all">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span> YouTube
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-all">
                <span className="w-2 h-2 bg-black rounded-full"></span> X / Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} Maulana Nasir Uddin Azhari • All Rights Reserved</p>
          <div className="flex gap-4 opacity-50">
            <span>Al-Azhar University Alumnus</span>
            <span>Cairo • Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
