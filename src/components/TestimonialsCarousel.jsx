import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah L.",
    avatar: "https://ui-avatars.com/api/?name=Sarah+L.&background=0D8ABC&color=fff",
    rating: 5,
    quote: "RefStack.me helped me turn my scattered referral links into a sleek landing page. I tripled my engagement in a week.",
  },
  {
    name: "Jay R.",
    avatar: "https://ui-avatars.com/api/?name=Jay+R.&background=6366F1&color=fff",
    rating: 4,
    quote: "Finally a tool that makes affiliate links look good. My click-through rate jumped from 2% to over 7%.",
  },
  {
    name: "Melody T.",
    avatar: "https://ui-avatars.com/api/?name=Melody+T.&background=DC2626&color=fff",
    rating: 5,
    quote: "The analytics dashboard is 🔥. I can see exactly which links convert best and optimize without guessing.",
  },
  {
    name: "Liam G.",
    avatar: "https://ui-avatars.com/api/?name=Liam+G.&background=10B981&color=fff",
    rating: 5,
    quote: "Setting up my custom page took 10 minutes. It's now my most-clicked link on socials.",
  },
  {
    name: "Aria N.",
    avatar: "https://ui-avatars.com/api/?name=Aria+N.&background=9333EA&color=fff",
    rating: 4,
    quote: "Support is fantastic. I had a setup issue and got help within an hour. Highly recommend going Pro.",
  },
  {
    name: "Trevor C.",
    avatar: "https://ui-avatars.com/api/?name=Trevor+C.&background=F59E0B&color=fff",
    rating: 5,
    quote: "Love the link scheduling feature! Makes managing promo campaigns so much easier.",
  },
];

export default function TestimonialsCarousel() {
  return (
    <section className="bg-white dark:bg-slate-900 py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-10">
          What People Are Saying
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-sm snap-start bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-md flex-shrink-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic">"{t.quote}"</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 