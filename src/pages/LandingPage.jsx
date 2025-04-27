import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="flex flex-col items-center text-center px-4 py-24"
      >
        <h1 className="text-5xl font-extrabold mb-6">Welcome to <br /> ReferralStack</h1>
        <p className="text-gray-600 text-xl mb-8">Manage and share your referral links in one place</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "🗂️", title: "Stack Links", desc: "Organize all your referral links with ease." },
              { icon: "🔗", title: "Share Easily", desc: "Quickly share your links with a few clicks." },
              { icon: "📈", title: "Grow Rewards", desc: "Boost your growth and earn rewards." }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05 }} 
                className="p-8 border rounded-lg text-center shadow-sm hover:shadow-lg transition"
              >
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
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
      <section className="bg-white py-20 px-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-2xl italic mb-6">“ReferralStack has made managing my links so much easier and more effective.”</p>
          <p className="font-bold">John Doe</p>
        </motion.div>
      </section>

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