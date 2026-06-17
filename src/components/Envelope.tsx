import React from 'react';
import { motion } from 'motion/react';
import { Heart, MailOpen } from 'lucide-react';

import coupleImage from '../assets/images/couple_1_1781684979074.jpg?url';

const DEFAULT_COUPLE = coupleImage || 'https://via.placeholder.com/800x1000/ead8b1/896e4f?text=Мовсес+&+Армине';

interface EnvelopeProps {
  guestName: string;
  onOpen: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({ guestName, onOpen }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f5f0] px-4 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(219,190,140,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#a3b899]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-lg w-full bg-white border border-gold-200/40 rounded-2xl shadow-[0_20px_50px_rgba(137,110,79,0.12)] p-6 sm:p-10 text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none select-none">
          <img 
            src={DEFAULT_COUPLE} 
            alt="Мовсес и Армине" 
            className="w-full h-full object-cover object-center opacity-[0.14] mix-blend-multiply filter contrast-[0.95]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff]/70 via-transparent to-[#ffffff]/75" />
        </div>

        <div className="absolute inset-3 border border-dashed border-gold-300/30 rounded-xl pointer-events-none z-20" />

        <div className="flex justify-center mb-6 relative z-10">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-gold-300/60 bg-gold-50/50">
            <Heart className="w-5 h-5 text-gold-400 fill-gold-400/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-dashed border-gold-400/30 animate-[spin_20s_linear_infinite]" />
          </div>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#3e3830] mb-2 relative z-10">
          Мовсес & Армине
        </h2>
        <div className="text-xs uppercase font-medium tracking-widest text-[#896e4f]/80 mb-8 relative z-10">
          10.09.2026 // ПРИГЛАШЕНИЕ
        </div>

        <div className="mb-10 px-4 relative z-10">
          <span className="text-stone-400 font-serif italic text-sm block mb-1">
            Дорогой гость,
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-tilda-beige italic leading-relaxed">
            {guestName ? guestName : "Дорогие Родные и Близкие!"}
          </h1>
          <p className="text-xs font-light tracking-wide text-stone-500 mt-4 leading-relaxed max-w-sm mx-auto">
            Мы приглашаем Вас прикоснуться к нашей истории любви и разделить с нами этот неповторимый день. Нажмите на печать, чтобы открыть приглашение.
          </p>
        </div>

        <div className="flex justify-center mb-4 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="group relative flex items-center justify-center cursor-pointer"
          >
            <div className="absolute -inset-2 bg-gold-100 rounded-full opacity-60 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#b12c2c] to-[#8d1d1d] shadow-[0_10px_20px_rgba(141,29,29,0.3)] border-2 border-[#6f1515] flex flex-col items-center justify-center text-white">
              <MailOpen className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[9px] uppercase font-semibold tracking-widest mt-1">ОТКРЫТЬ</span>
              <div className="absolute inset-1 rounded-full border border-dashed border-white/25 pointer-events-none" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};