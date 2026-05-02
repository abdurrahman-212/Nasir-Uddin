import { motion } from 'motion/react';
import { GraduationCap, Award, Globe, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-24">
      <section className="flex flex-col md:flex-row gap-16 items-start">
        <div className="w-full md:w-1/3">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl mb-8">
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1000" 
                alt="Maulana Nasir Uddin" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Quick Facts</h2>
              <div className="space-y-3">
                <FactItem icon={GraduationCap} label="Alma Mater" value="Al-Azhar University, Egypt" />
                <FactItem icon={Award} label="Focus" value="Islamic Theology & Digital Media" />
                <FactItem icon={Globe} label="Languages" value="Arabic, Bengali, English" />
                <FactItem icon={Heart} label="Interests" value="Humanitarian Work, Photography" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-2/3 space-y-12">
          <header>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif font-bold leading-tight"
            >
              The Story of <br />
              <span className="text-primary font-italic">A Scholar at Heart</span>
            </motion.h1>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-stone-600 dark:text-stone-400">
            <section className="space-y-4">
              <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">Early Life & Education</h2>
              <p>
                Maulana Nasir Uddin Azhari was born with a natural inclination towards knowledge and spirituality. His journey took him from his local roots to the prestigious halls of Al-Azhar University in Cairo, Egypt—the oldest and most renowned institution for Islamic studies in the world.
              </p>
              <p>
                During his time in Egypt, he immersed himself in the rich traditions of Islamic scholarship, mastering the nuances of theology, jurisprudence, and language. This period was not just about academic excellence but also about cultural exchange and personal growth.
              </p>
            </section>

            <section className="space-y-4 bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/10 dark:border-primary/30">
              <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">Vision & Mission</h2>
              <p className="italic">
                "My mission is to present the timeless truths of Islam in a way that resonates with the modern mind. We must use every tool at our disposal—be it a camera, a keyboard, or a microphone—to spread peace and understanding."
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">The Digital Frontier</h2>
              <p>
                Recognizing the shift in how people consume information, Maulana Nasir Uddin Azhari has expanded his reach to digital platforms. His Facebook through which he shares videos, photos, and insights, has become a hub for a growing community of seekers.
              </p>
              <p>
                He believes that digital media, when used ethically, can be a powerful force for dawah and education. His visual storytelling combines artistic photography with spiritual depth, creating a unique aesthetic that appeals to both the heart and the eye.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="p-6 border border-stone-200 dark:border-stone-800 rounded-2xl">
                <h4 className="font-bold mb-2">Academic Excellence</h4>
                <p className="text-sm">Rigorous training in traditional disciplines from world-class masters.</p>
              </div>
              <div className="p-6 border border-stone-200 dark:border-stone-800 rounded-2xl">
                <h4 className="font-bold mb-2">Community Leadership</h4>
                <p className="text-sm">Guiding and inspiring thousands through digital and physical platforms.</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-stone-100 dark:bg-stone-900 rounded-xl">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-stone-800 shadow-sm">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
