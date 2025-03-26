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

  const FeatureCard = ({ icon: Icon, title, description, color }) => {
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
        className="bg-base-100 text-base-content p-8 rounded-lg shadow-md"
        initial="hidden"
        animate={controls}
        variants={fadeIn}
      >
        <Icon className={`h-16 w-16 ${color} mb-6`} />
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <p>{description}</p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Hero Section */}
      <motion.div
        className="container mx-auto flex flex-col-reverse md:flex-row items-center py-15 md:pt-10 md:pb-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="md:w-1/2 text-center md:text-left" variants={fadeIn}>
          <h1 className="text-2xl md:text-4xl font-bold mb-6">Chat, Connect & Enjoy!</h1>
          <p className="text-md mb-8">Experience seamless, real-time conversations with people around the world. Make new friends and stay connected effortlessly.</p>
          <motion.button
            className="bg-base-100 text-blue-600 px-8 py-3 rounded-full font-semibold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={()=>navigate('/login')}
          >
            Get Started
          </motion.button>
        </motion.div>
        <motion.div className="w-60  md:w-1/2" variants={fadeIn}>
          <motion.img src={chatingImage} alt="Chat Illustration" className="rounded-xl" whileHover={{ scale: 1.05 }} />
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div className="container mx-auto py-16" initial="hidden" animate="visible" variants={staggerContainer}>
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose ChatWithFriend?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={ChatBubbleLeftEllipsisIcon} 
            title="Real-Time Chat" 
            description="Engage in smooth, instant conversations with your friends anytime." 
            color="text-blue-600" 
          />
          <FeatureCard 
            icon={UsersIcon} 
            title="Global Community" 
            description="Expand your social circle and meet people from all over the world." 
            color="text-purple-600" 
          />
          <FeatureCard 
            icon={DocumentTextIcon} 
            title="Chat Summary" 
            description="Generate AI-powered summaries of your conversations for easy review." 
            color="text-purple-600" 
          />
        </div>
      </motion.div>

      {/* Footer Section */}
      <footer className="bg-base-100 py-12 text-center">
        <p className="text-gray-500">&copy; 2024 ChatWithFriend. Connect. Chat. Enjoy.</p>
        <motion.p
          className="text-lg font-semibold text-blue-600 mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Developed and Designed by Mohd Mizna Ansari
        </motion.p>
      </footer>
    </div>
  );
};

export default Hero;