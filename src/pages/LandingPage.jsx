import React from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { Layers, LayoutPanelLeft, BarChart3, CalendarClock, Paintbrush, TrendingUp } from 'lucide-react';
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import { IconName } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { 
      icon: <Layers size={32} className="text-blue-600" />,
      title: "Stack Unlimited Links", 
      desc: "Group and manage all your referral links with ease. Stay organized and never miss an opportunity."
    },
    { 
      icon: <LayoutPanelLeft size={32} className="text-blue-600" />,
      title: "Custom Landing Pages", 
      desc: "Showcase your links with a branded profile page, avatar, social links, and custom slugs."
    },
    { 
      icon: <BarChart3 size={32} className="text-blue-600" />,
      title: "Track Clicks & Conversions", 
      desc: "Monitor engagement with detailed analytics including CTR, location heatmaps, and top-performers."
    },
    { 
      icon: <CalendarClock size={32} className="text-blue-600" />,
      title: "Schedule or Expire Links", 
      desc: "Time your offers like a pro. Auto-activate or expire links based on your launch schedule."
    },
    { 
      icon: <Paintbrush size={32} className="text-blue-600" />,
      title: "Customize Your Design", 
      desc: "Make it yours with custom colors, themes, and layouts. Match your brand and style."
    },
    { 
      icon: <TrendingUp size={32} className="text-blue-600" />,
      title: "Built for Growth", 
      desc: "Earn rewards, unlock affiliate bonuses, and boost your stacking performance with Pro tools."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="flex flex-col items-center text-center px-4 py-24"
      >
        <h1 className="text-5xl font-extrabold mb-6">Welcome to <br /> RefStack  </h1>
        <p className="text-gray-600 text-xl mb-8"> Manage and share your referral links in one place </p>
        <Link to="/register">
          <Button>Get Started</Button>
        </Link>
      </motion.section>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="text-3xl font-bold text-center mb-16"
          >Features</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} 
                className="p-8 border border-gray-200 rounded-xl text-center shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="mb-5 flex justify-center items-center h-16 w-16 rounded-full bg-blue-100 mx-auto">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="text-3xl font-bold text-center mb-16"
          >How it Works</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account in just seconds." },
              { step: "2", title: "Stack", desc: "Add all your referral links to your dashboard." },
              { step: "3", title: "Share", desc: "Start sharing your links and earn rewards." }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05 }} 
                className="text-center"
              >
                <div className="text-3xl font-bold mb-4">{item.step}</div>
                <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        className="py-20 px-6 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
        <p className="text-gray-600 mb-8">Sign up now and take control of your referral links</p>
        <Link to="/register">
          <Button className="px-8 py-4 text-lg">Get Started</Button>
        </Link>
      </motion.section>
    </div>
  );
} 