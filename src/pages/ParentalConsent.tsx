import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users, Eye, Lock, ArrowRight, Calendar, FileText, Database, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auditConsentGiven } from "@/lib/audit";
import { requiresParentalConsent } from "@/lib/auth";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ParentalConsent = () => {
  const [consents, setConsents] = useState({
    dataCollection: false,
    analytics: false,
    emailCommunication: false,
    termsOfService: false,
    privacyPolicy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsentChange = (key: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [key]: checked }));
  };

  const allRequiredConsents = consents.termsOfService && consents.privacyPolicy && consents.dataCollection;

  const handleSubmit = async () => {
    if (!allRequiredConsents) return;

    setIsSubmitting(true);
    
    try {
      // Log consent for audit trail
      const userId = localStorage.getItem('temp_user_id') || 'unknown';
      auditConsentGiven(userId, 'parental_consent_complete');
      
      // Store consent timestamp
      localStorage.setItem('parental_consent', JSON.stringify({
        given: true,
        timestamp: new Date().toISOString(),
        consents
      }));
      
      // Redirect to next step
      window.location.href = '/create-child';
    } catch (error) {
      console.error('Failed to save consent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const consentItems = [
    {
      key: 'dataCollection',
      title: 'Essential Data Collection',
      description: 'We collect only what\'s necessary: your email, child names, ages, and learning progress. No personal data is shared with third parties.',
      icon: Database,
      required: true,
    },
    {
      key: 'analytics',
      title: 'Learning Analytics',
      description: 'Anonymous usage data helps us improve lessons. We never track personal information or share data with advertisers.',
      icon: BarChart3,
      required: false,
    },
    {
      key: 'emailCommunication',
      title: 'Email Updates',
      description: 'Progress reports and important account updates. You can unsubscribe anytime.',
      icon: FileText,
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div
          className="mb-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-green">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-4 font-display text-3xl font-bold">Parental Consent</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We take children's privacy seriously. Please review and consent to how we handle your family's data.
          </p>
        </motion.div>

        <motion.div
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <h2 className="mb-6 font-display text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-explorer-green" />
            What We Collect
          </h2>
          
          <div className="space-y-4">
            {consentItems.map((item, index) => (
              <motion.div
                key={item.key}
                className="flex items-start gap-4 p-4 rounded-xl border border-border"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index + 2}
              >
                <item.icon className="h-5 w-5 text-explorer-blue mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.required && (
                      <span className="text-xs bg-explorer-coral/10 text-explorer-coral px-2 py-1 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Checkbox
                  id={item.key}
                  checked={consents[item.key as keyof typeof consents]}
                  onCheckedChange={(checked) => handleConsentChange(item.key, checked as boolean)}
                  className="mt-1"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          <h2 className="mb-4 font-display text-xl font-bold flex items-center gap-2">
            <Eye className="h-5 w-5 text-explorer-blue" />
            Legal Agreements
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-semibold mb-1">Terms of Service</h3>
                <p className="text-sm text-muted-foreground">
                  Our terms explain how the service works and your responsibilities.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  View Terms
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-semibold mb-1">Privacy Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed explanation of our data practices and your rights.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  View Privacy
                </a>
              </Button>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="termsOfService"
                checked={consents.termsOfService}
                onCheckedChange={(checked) => handleConsentChange('termsOfService', checked as boolean)}
              />
              <label htmlFor="termsOfService" className="text-sm">
                I agree to the Terms of Service
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <Checkbox
                id="privacyPolicy"
                checked={consents.privacyPolicy}
                onCheckedChange={(checked) => handleConsentChange('privacyPolicy', checked as boolean)}
              />
              <label htmlFor="privacyPolicy" className="text-sm">
                I agree to the Privacy Policy
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <div className="rounded-2xl bg-gradient-green/10 border border-explorer-green/20 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-explorer-green mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-explorer-green mb-1">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  You can withdraw consent, export your data, or delete your account at any time from Settings.
                  We'll always prioritize your child's privacy and safety.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!allRequiredConsents || isSubmitting}
            variant="explorer"
            size="lg"
            className="w-full gap-2"
          >
            {isSubmitting ? 'Processing...' : 'Continue to Setup'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentalConsent;
