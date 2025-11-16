import { Menu, Moon, Sun, Search, Monitor, Apple, SquareTerminal } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usePreferences } from '@/hooks/usePreferences';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { preferences, toggleDarkMode, setOperatingSystem } = usePreferences();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">GK</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-none">GitKraken Guide</h1>
              <span className="text-xs text-muted-foreground">Master the Legendary Git Client</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search guide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
              />
            </div>
          </form>
          <Select value={preferences.operatingSystem} onValueChange={setOperatingSystem}>
            <SelectTrigger className="w-[140px] hidden sm:flex" title="Select your operating system">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="windows">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Windows</span>
                </div>
              </SelectItem>
              <SelectItem value="mac">
                <div className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  <span>macOS</span>
                </div>
              </SelectItem>
              <SelectItem value="linux">
                <div className="flex items-center gap-2">
                  <SquareTerminal className="h-4 w-4" />
                  <span>Linux</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            title="Toggle dark mode"
          >
            {preferences.darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
