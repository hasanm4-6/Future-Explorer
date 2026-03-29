import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-coral">
              <Compass className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Future Explorer</span>
          </Link>
          <p className="text-sm text-muted-foreground">Making AI fun and safe for young explorers ages 6–9.</p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Platform</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/lessons" className="hover:text-foreground transition-colors">Lessons</Link>
            <Link to="/downloads" className="hover:text-foreground transition-colors">Downloads</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Parents</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Safety & Privacy</Link>
            <span className="hover:text-foreground transition-colors cursor-pointer">FAQ</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Support</span>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">COPPA Compliance</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 Future Explorer. All rights reserved. Built with ❤️ for curious kids.
      </div>
    </div>
  </footer>
);

export default Footer;
