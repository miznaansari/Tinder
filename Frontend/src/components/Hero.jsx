import React from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ChatBubbleLeftEllipsisIcon, UsersIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import chatingImage from '../assets/chating.png';
import { useNavigate } from 'react-router';

const Hero = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };

  const FeatureCard = ({ icon: Icon, title, description, accentClass, index }) => {
    const controls = useAnimation();
    const ref = React.useRef(null);
    const inView = useInView(ref);

    React.useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        className="group relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 p-8 text-base-content shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        initial="hidden"
        animate={controls}
        variants={fadeIn}
        whileHover={{ y: -6 }}
      >
        <div className="pointer-events-none absolute right-4 top-4 text-5xl font-black text-base-content/5">
          0{index}
        </div>

        <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accentClass}`}>
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="mb-3 text-xl font-extrabold tracking-tight">{title}</h3>
        <p className="text-sm leading-7 text-base-content/75">{description}</p>
      </motion.div>
    );
  };

  const features = [
    {
      icon: ChatBubbleLeftEllipsisIcon,
      title: 'Instant Conversations',
      description: 'Send and receive messages in real time with smooth delivery and clear chat flows.',
      accentClass: 'bg-cyan-500/15 text-cyan-500',
    },
    {
      icon: UsersIcon,
      title: 'Global Connections',
      description: 'Discover people with shared interests and build meaningful friendships worldwide.',
      accentClass: 'bg-emerald-500/15 text-emerald-500',
    },
    {
      icon: DocumentTextIcon,
      title: 'Smart Summaries',
      description: 'Review important conversation highlights quickly with AI assisted summaries.',
      accentClass: 'bg-amber-500/15 text-amber-500',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-200 text-base-content">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-36 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-10 md:gap-16 md:px-6 md:pb-24 md:pt-16 lg:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="text-center md:text-left" variants={fadeIn}>
          <span className="mb-5 inline-flex rounded-full border border-base-300/70 bg-base-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/70 shadow-sm">
            Fast. Secure. Social.
          </span>

          <h1 className="text-3xl font-black leading-tight md:text-2xl lg:text-5xl">
            Build Real Connections Through
            <span className="block bg-gradient-to-r from-cyan-500 via-primary to-amber-500 bg-clip-text text-transparent">
              Better Conversations
            </span>
          </h1>

          <p className="mx-auto mb-8 mt-6 max-w-xl text-base leading-8 text-base-content/75 md:mx-0 md:text-lg">
            ChatWithFriend gives you a refined messaging experience, a global community to explore,
            and smart tools that help every conversation feel clear, personal, and engaging.
          </p>

          <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row md:items-start">
            <motion.button
              className="btn h-12 rounded-full border-none bg-primary px-8 text-primary-content shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/login')}
            >
              Get Started
            </motion.button>

            <motion.button
              className="btn h-12 rounded-full border border-base-300/70 bg-base-100 px-8 text-base-content shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup')}
            >
              Create Account
            </motion.button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-base-300/70 bg-base-100 p-4 text-left shadow-sm">
              <p className="text-2xl font-black text-cyan-500">10K+</p>
              <p className="text-xs uppercase tracking-wider text-base-content/55">Active Chats Daily</p>
            </div>
            <div className="rounded-xl border border-base-300/70 bg-base-100 p-4 text-left shadow-sm">
              <p className="text-2xl font-black text-emerald-500">95%</p>
              <p className="text-xs uppercase tracking-wider text-base-content/55">Fast Reply Rate</p>
            </div>
            <div className="rounded-xl border border-base-300/70 bg-base-100 p-4 text-left shadow-sm">
              <p className="text-2xl font-black text-amber-500">120+</p>
              <p className="text-xs uppercase tracking-wider text-base-content/55">Countries Reached</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="relative mx-auto w-full max-w-lg" variants={fadeIn}>
          <div className="rounded-3xl border border-base-300/70 bg-base-100 p-4 shadow-2xl">
            <motion.img
              src={chatingImage}
              alt="People chatting together"
              className="w-full rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.div
            className="absolute -left-4 bottom-6 rounded-xl border border-base-300/70 bg-base-100 px-4 py-3 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/55">Live Status</p>
            <p className="text-sm font-bold text-emerald-500">2,300 users online now</p>
          </motion.div>

          <motion.button
            className="absolute -right-4 top-6 rounded-xl border border-base-300/70 bg-base-100 px-4 py-3 text-left shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/search')}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/55">Discovery</p>
            <p className="text-sm font-bold">Find new friends now</p>
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.section
        className="relative mx-auto w-full max-w-7xl px-4 pb-16 md:px-6 md:pb-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/55">Core Experience</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Why ChatWithFriend Feels Different</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
            Every part of the platform is designed for comfort, speed, and trust so conversations remain effortless.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentClass={feature.accentClass}
              index={idx + 1}
            />
          ))}
        </div>
      </motion.section>

      <footer className="border-t border-base-300/60 bg-base-100/95 py-10 text-center">
        <p className="text-sm text-base-content/60">(c) 2026 ChatWithFriend. Connect. Chat. Enjoy.</p>
        <motion.p
          className="mt-3 text-sm font-semibold uppercase tracking-wider text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Crafted with care by Mohd Mizna Ansari
        </motion.p>
      </footer>
    </div>
  );
};

export default Hero;