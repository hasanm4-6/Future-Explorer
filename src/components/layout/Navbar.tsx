import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Menu, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = [
    "/dashboard",
    "/lessons",
    "/create-child",
    "/downloads",
    "/settings",
  ].some((p) => location.pathname.startsWith(p));
  const isTeacher = location.pathname.startsWith("/teacher");

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-coral">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Future Explorer
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {isTeacher ? (
            <>
              <Link
                to="/teacher"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </>
          ) : isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/lessons"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Lessons
              </Link>
              <Link
                to="/downloads"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Downloads
              </Link>
              <Link
                to="/settings"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/pricing"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <a
                href="#features"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-body text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            // <Link to="/" asChild>
            <Button
              onClick={async () => {
                await api.logout();
              }}
              variant="explorer-outline"
              size="sm"
            >
              <Link to="/">Log Out</Link>
            </Button>
          ) : (
            // </Link>
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="explorer" size="sm">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-body font-semibold text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/lessons"
                  className="font-body font-semibold text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Lessons
                </Link>
                <Link
                  to="/downloads"
                  className="font-body font-semibold text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Downloads
                </Link>
                <Link
                  to="/settings"
                  className="font-body font-semibold text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="font-body font-semibold text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </Link>
              </>
            )}
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="explorer" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
