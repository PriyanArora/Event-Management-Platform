import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Logo } from './Logo';
import { ButtonLink } from '../ui/Button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm transition-colors ${
    isActive ? 'bg-white/[0.07] font-medium text-ink' : 'text-zinc-500 hover:text-ink'
  }`;

export function SiteHeader() {
  const { isAuthenticated, isOrganizer, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-paper/60 backdrop-blur-xl backdrop-saturate-150">
      {/* Full-width translucent bar: the page shows through the blur. */}
      <div className="mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/events" className={navLinkClass}>
                Browse events
              </NavLink>
              {isAuthenticated && !isOrganizer && (
                <NavLink to="/my/registrations" className={navLinkClass}>
                  My tickets
                </NavLink>
              )}
              {isOrganizer && (
                <NavLink to="/organizer" className={navLinkClass}>
                  Organizer
                </NavLink>
              )}
            </nav>
          </div>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-2 text-sm font-medium text-zinc-500 transition-colors hover:text-ink"
                >
                  Sign in
                </Link>
                <ButtonLink to="/signup" size="sm">
                  Get started
                </ButtonLink>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2.5 transition-colors hover:border-white/25"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft font-mono text-[10px] font-medium text-accent-ink">
                    {initials(user?.displayName || user?.email || '?')}
                  </span>
                  <span className="max-w-[120px] truncate text-[13px] font-medium text-ink">
                    {user?.displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </button>
                {menuOpen && (
                  <div className="glass-heavy absolute right-0 mt-2 w-60 overflow-hidden rounded-xl p-1 shadow-pop animate-scale-in">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium text-ink">{user?.displayName}</p>
                      <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                      <span className="mt-1.5 inline-block rounded border border-accent/40 bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-accent-ink">
                        {user?.role === 'ORGANIZER' ? 'Organizer' : 'Attendee'}
                      </span>
                    </div>
                    <div className="my-1 h-px bg-white/10" />
                    {isOrganizer ? (
                      <MenuItem to="/organizer" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setMenuOpen(false)}>
                        Organizer dashboard
                      </MenuItem>
                    ) : (
                      <MenuItem to="/my/registrations" icon={<Ticket className="h-4 w-4" />} onClick={() => setMenuOpen(false)}>
                        My tickets
                      </MenuItem>
                    )}
                    <MenuItem to="/events" icon={<CalendarDays className="h-4 w-4" />} onClick={() => setMenuOpen(false)}>
                      Browse events
                    </MenuItem>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-white/[0.07] hover:text-ink"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile sheet */}
        {mobileOpen && (
          <div className="border-t border-white/10 px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              <MobileLink to="/events" onClick={() => setMobileOpen(false)}>Browse events</MobileLink>
              {isAuthenticated && !isOrganizer && (
                <MobileLink to="/my/registrations" onClick={() => setMobileOpen(false)}>My tickets</MobileLink>
              )}
              {isOrganizer && (
                <MobileLink to="/organizer" onClick={() => setMobileOpen(false)}>Organizer dashboard</MobileLink>
              )}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              {!isAuthenticated ? (
                <>
                  <ButtonLink to="/login" variant="outline" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </ButtonLink>
                  <ButtonLink to="/signup" onClick={() => setMobileOpen(false)}>
                    Get started
                  </ButtonLink>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] font-medium text-accent-ink">
                      {initials(user?.displayName || '?')}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{user?.displayName}</p>
                      <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.07]" aria-label="Sign out">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuItem({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-white/[0.07] hover:text-ink"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] ${
          isActive ? 'bg-white/[0.07] font-medium text-ink' : 'text-zinc-600'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
