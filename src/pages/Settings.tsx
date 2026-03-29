import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard, 
  Download, 
  Trash2, 
  Eye,
  Database,
  ArrowRight,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auditDataExported, auditDataDeleted } from "@/lib/audit";

const Settings = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account, subscription, and security.</p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold">Parent Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body font-semibold">Full Name</Label>
              <Input defaultValue="Sarah Johnson" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">Email</Label>
              <Input defaultValue="sarah@email.com" className="rounded-xl" />
            </div>
            <Button variant="explorer" size="sm">Save Changes</Button>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-explorer-blue" /> Subscription
          </h2>
          <div className="mb-4 flex items-center justify-between rounded-xl bg-muted p-4">
            <div>
              <p className="font-display font-bold">Yearly Explorer</p>
              <p className="text-sm text-muted-foreground">$79.99/year · Renews Jan 15, 2027</p>
            </div>
            <span className="rounded-full bg-explorer-green/10 px-3 py-1 text-xs font-bold text-explorer-green">Active</span>
          </div>
          <div className="flex gap-3">
            <Link to="/pricing"><Button variant="explorer-outline" size="sm">Change Plan</Button></Link>
            <Button variant="ghost" size="sm" className="text-destructive">Cancel Subscription</Button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-explorer-green" /> Security
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body font-semibold">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">New Password</Label>
              <Input type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
            <Button variant="explorer" size="sm">Update Password</Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-explorer-green" /> Data Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-explorer-blue" />
                <div>
                  <h3 className="font-semibold">Export Your Data</h3>
                  <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
                </div>
              </div>
              <Link to="/data-management">
                <Button variant="outline" size="sm" className="gap-2">
                  Manage Data
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-explorer-coral" />
                <div>
                  <h3 className="font-semibold">Privacy Summary</h3>
                  <p className="text-sm text-muted-foreground">Simple explanation of our privacy practices</p>
                </div>
              </div>
              <Link to="/privacy-summary">
                <Button variant="outline" size="sm" className="gap-2">
                  View Summary
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm"><LogOut className="h-4 w-4" /> Log Out</Button>
          </Link>
          <Link to="/data-management">
            <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /> Delete Account</Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
