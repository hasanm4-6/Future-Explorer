import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Menu, X } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthContext();

  const isTeacher = user?.role === "teacher";
  const isParent = user?.role === "parent";

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

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

        <div className="hidden items-center gap-6 md:flex">
          {isTeacher ? (
            <>
              <Link
                to="/teacher"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Settings
              </Link>
            </>
          ) : isParent ? (
            <>
              <Link
                to="/dashboard"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/lessons"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Lessons
              </Link>
              <Link
                to="/downloads"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Downloads
              </Link>
              <Link
                to="/settings"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/pricing"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <a
                href="#features"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button
              onClick={handleLogout}
              variant="explorer-outline"
              size="sm"
            >
              Log Out
            </Button>
          ) : (
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

        <button className="md:hidden" onClick={() => setMobileOpen((open) => !open)}>
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-slide-up border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
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
                <Button
                  variant="explorer-outline"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Log Out
                </Button>
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
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="explorer" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
