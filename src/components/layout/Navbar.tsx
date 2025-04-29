
import React, { useState, useEffect } from 'react';
import { Menu, MicrophoneIcon, Bell, SunMoon, Home, User, Book, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = {
  name: string;
  code: string;
  flag?: string;
};

const languages: Language[] = [
  { name: 'English', code: 'en', flag: '🇬🇧' },
  { name: 'हिन्दी (Hindi)', code: 'hi', flag: '🇮🇳' },
  { name: 'தமிழ் (Tamil)', code: 'ta', flag: '🇮🇳' },
  { name: 'తెలుగు (Telugu)', code: 'te', flag: '🇮🇳' },
  { name: 'ಕನ್ನಡ (Kannada)', code: 'kn', flag: '🇮🇳' },
  { name: 'বাংলা (Bengali)', code: 'bn', flag: '🇮🇳' },
];

const Navbar = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition functionality would be implemented here
  };

  const changeLang = (lang: Language) => {
    setCurrentLang(lang);
    // Language change logic would be implemented here
  };

  return (
    <>
      {!isOnline && (
        <div className="offline-indicator" role="alert">
          You are currently offline. Some features may be limited.
        </div>
      )}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <button 
            className="mr-2 px-2 lg:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-maternal-primary font-bold text-xl md:text-2xl">
                Maa Sathi Seva
              </span>
            </Link>
          </div>
          
          <div className="flex-1" />
          
          <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-maternal-primary">
              Home
            </Link>
            <Link to="/profile" className="text-sm font-medium transition-colors hover:text-maternal-primary">
              My Profile
            </Link>
            <Link to="/resources" className="text-sm font-medium transition-colors hover:text-maternal-primary">
              Resources
            </Link>
            <Link to="/chat" className="text-sm font-medium transition-colors hover:text-maternal-primary">
              Chat Support
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleVoiceInput}
              aria-label="Voice Input"
              className={isListening ? "bg-red-100 text-red-500 animate-pulse-soft" : ""}
            >
              <MicrophoneIcon className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex items-center gap-1">
                  <span className="text-sm hidden sm:inline-block">{currentLang.flag}</span>
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => changeLang(lang)}
                    className="cursor-pointer"
                  >
                    {lang.flag} {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" aria-label="Toggle theme">
              <SunMoon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
          <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl text-maternal-primary">Maa Sathi Seva</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-8 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 py-2 text-lg font-medium hover:text-maternal-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 py-2 text-lg font-medium hover:text-maternal-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                My Profile
              </Link>
              <Link 
                to="/resources" 
                className="flex items-center gap-2 py-2 text-lg font-medium hover:text-maternal-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Book className="h-5 w-5" />
                Resources
              </Link>
              <Link 
                to="/chat" 
                className="flex items-center gap-2 py-2 text-lg font-medium hover:text-maternal-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <MicrophoneIcon className="h-5 w-5" />
                Chat Support
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
