import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { api } from '@/lib/api.ts';
import { toast } from 'sonner';

export default function Contact() {
  const [settings, setSettings] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Message sent successfully!');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <header className="max-w-2xl mb-16">
        <h1 className="text-5xl font-serif font-bold mb-4">Connect with <span className="text-primary italic">Our Office</span></h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">
          For inquiries about lectures, photography assignments, or scholarly discussions, please reach out via the official channels.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-12">
          <section className="grid grid-cols-1 gap-8">
            <ContactInfoItem 
              icon={Mail} 
              title="Email Address" 
              value={settings.contact_email || 'nasiruddin@azhar.eg'} 
            />
            <ContactInfoItem 
              icon={Phone} 
              title="Phone Number" 
              value="+20 123 456 7890 (Egypt)" 
            />
            <ContactInfoItem 
              icon={MapPin} 
              title="Location" 
              value="Cairo, Egypt / Dhaka, Bangladesh" 
            />
          </section>

          <div className="p-8 bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10 dark:border-primary/30">
            <h4 className="font-serif font-bold text-xl mb-4 text-primary">Office Hours</h4>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
              <li className="flex justify-between"><span>Mon - Thu:</span> <span>10:00 AM - 05:00 PM</span></li>
              <li className="flex justify-between"><span>Sat - Sun:</span> <span>11:00 AM - 03:00 PM</span></li>
              <li className="flex justify-between font-bold text-primary"><span>Friday:</span> <span>Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 space-y-4"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold">Message Received!</h2>
              <p className="text-stone-500">
                Thank you for reaching out. Maulana Nasir Uddin or his team will get back to you shortly.
              </p>
              <Button variant="outline" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Full Name</label>
                  <Input placeholder="John Doe" required className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Email Address</label>
                  <Input type="email" placeholder="john@example.com" required className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Subject</label>
                <Input placeholder="Lecture Inquiry" required className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Your Message</label>
                <Textarea 
                  placeholder="Tell us about your inquiry..." 
                  className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 min-h-[160px] resize-none" 
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 text-sm font-bold uppercase tracking-widest bg-primary hover:bg-accent text-white rounded-full shadow-lg shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : (
                  <>Send Message <Send className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, title, value }: { icon: any, title: string, value: string }) {
  return (
    <div className="flex items-start space-x-6 group">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-800 group-hover:border-primary transition-colors shadow-sm">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-1">{title}</h4>
        <p className="text-xl text-stone-800 dark:text-stone-200 font-serif leading-none">{value}</p>
      </div>
    </div>
  );
}
