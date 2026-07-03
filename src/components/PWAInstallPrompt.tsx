"use client";

import React, { useEffect, useState } from 'react';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';

/**
 * TM UNIVERSAL PWA INSTALLER — V2.0
 * Supports Android (Auto) & iOS (Manual Instructions)
 */

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Detect Platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) return; // Don't show if already installed

    if (isIOS) {
      setPlatform('ios');
      // Show iOS prompt after 5 seconds to not overwhelm the user
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }

    // 2. Listen for Chrome/Android Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    });

    // 3. Clean up
    return () => window.removeEventListener('beforeinstallprompt', () => {});
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('TM App Installed Successfully');
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    setIsVisible(false);
    // Optional: Save to session storage to not show again this visit
    sessionStorage.setItem('eml_pwa_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[100] md:max-w-md md:left-auto md:right-6 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-zinc-900 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
        
        {/* Header Area */}
        <div className="bg-emerald-600 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">TM Mobile Hub</span>
          </div>
          <button onClick={closePrompt} className="text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {platform === 'ios' ? (
            /* --- iOS MANUAL INSTRUCTIONS --- */
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">ታማኝ ማሽነሪን በስልክዎ ይጫኑ</h3>
                <p className="text-xs text-zinc-400">Install TM on your iPhone for instant access.</p>
              </div>
              
              <div className="bg-black/40 p-4 rounded-xl space-y-3 border border-white/5">
                <div className="flex items-center gap-3 text-[11px] text-zinc-300">
                  <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-blue-400">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <span>Tap the <strong className="text-white">Share</strong> button in Safari</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-300">
                  <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-emerald-400">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <span>Select <strong className="text-white">Add to Home Screen</strong></span>
                </div>
              </div>
            </div>
          ) : (
            /* --- ANDROID/CHROME AUTO INSTALL --- */
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <Download className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Install TM App</h3>
                <p className="text-[11px] text-zinc-500 leading-tight mt-1">
                  የታማኝ ማሽነሪ መተግበሪያን በመጫን ፈጣን እና ቀልጣፋ አገልግሎት ያግኙ።
                </p>
                <button 
                  onClick={handleInstallClick}
                  className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase rounded-lg transition-all shadow-lg shadow-emerald-900/20"
                >
                  Install Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar (Purely aesthetic for industrial feel) */}
        <div className="h-1 w-full bg-zinc-800">
          <div className="h-full bg-emerald-500 w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}