import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguageStore, SUPPORTED_LANGUAGES, LanguageCode } from '../../localization';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
          compact
            ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white text-[11px]'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold'
        }`}
        title="Change Regional Language"
      >
        <Globe className={`w-3.5 h-3.5 ${compact ? 'text-[#D4A017]' : 'text-primary'}`} />
        <span className="font-semibold">{currentOption.flag}</span>
        <span className="font-bold hidden sm:inline">{currentOption.nativeLabel}</span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2.5 py-1.5 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Select Language / भाषा चुनें
            </div>
            <div className="py-1 space-y-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary-50 text-primary-900 font-black'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <div className="text-left leading-tight">
                        <span className="block">{lang.nativeLabel}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{lang.label}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
