"use client";

import Container from "@/components/shared/Container";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      title: "Data Collection",
      icon: Eye,
      content:
        "We collect information that you provide directly to us, including name, email address, phone number, and product preferences. This helps us provide you with personalized product recommendations and improved services.",
    },
    {
      title: "Data Security",
      icon: Lock,
      content:
        "Your data is protected using industry-standard encryption and security measures. We regularly update our security protocols to ensure your information remains safe and confidential during your shopping experience.",
    },
    {
      title: "Data Usage",
      icon: Shield,
      content:
        "We use your information to enhance your product discovery experience, process transactions, and communicate important updates. We never sell your personal data to third parties.",
    },
    {
      title: "Your Rights",
      icon: FileCheck,
      content:
        "You have the right to access, modify, or delete your personal information at any time. Contact our privacy team for any data-related requests or concerns about your account.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Container>
      <motion.div
        className="py-16 space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At Eco Sphere, we take your privacy seriously. This policy outlines
            how we collect, use, and protect your personal information during
            your product discovery journey.
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground"
        >
          Last Updated: January 2024
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          className="grid gap-8 md:grid-cols-2"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <section.icon className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <p className="text-muted-foreground">{section.content}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Information */}
        <motion.div
          variants={itemVariants}
          className="bg-primary/5 rounded-2xl p-8 space-y-4"
        >
          <h2 className="text-2xl font-semibold">Contact Our Privacy Team</h2>
          <p className="text-muted-foreground">
            If you have any questions about our privacy policy or how we handle
            your data during your shopping experience, please contact us at:
          </p>
          <div className="text-primary font-medium">privacy@lagbekichu.com</div>
        </motion.div>

        {/* Compliance Notice */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground"
        >
          This privacy policy complies with all applicable data protection laws
          and e-commerce regulations.
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Privacy;
