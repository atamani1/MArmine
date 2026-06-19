import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  Cake,
  Sparkles,
  ChevronDown,
  Heart,
  Music,
  VolumeX,
} from 'lucide-react';

import { Envelope } from './components/Envelope';
import { CountdownTimer } from './components/CountdownTimer';
import { RSVPForm } from './components/RSVPForm';
import { AdminPanel } from './components/AdminPanel';

import { GuestRSVP } from './types';

// Исправляем импорт изображений
import couple1Image from './assets/images/couple_1_1781684979074.jpg?url';
import couple2Image from './assets/images/couple_2_1781685000637.jpg?url';
import newPhoto1 from './assets/images/couple_1_new.jpg?url';
import newPhoto2 from './assets/images/couple_2_new.jpg?url';

const DEFAULT_COUPLE_1 = newPhoto1 || couple1Image || 'https://via.placeholder.com/800x1000/ead8b1/896e4f?text=Мовсес+&+Армине';
const DEFAULT_COUPLE_2 = newPhoto2 || couple2Image || 'https://via.placeholder.com/800x1000/dcb980/896e4f?text=Мовсес+&+Армине';

const WEDDING_DATE = '2026-09-10T16:00:00';
const VENUE_NAME = 'Ресторан «Робинзон Крузо»';
const VENUE_ADDRESS = 'г. Краснодар, ул. Тепличная, 78/1';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [rsvps, setRsvps] = useState<GuestRSVP[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    if (toParam) {
      setGuestName(decodeURIComponent(toParam));
    }

    const savedRSVPs = localStorage.getItem('wedding_rsvps');
    if (savedRSVPs) {
      try {
        setRsvps(JSON.parse(savedRSVPs));
      } catch (e) {
        console.error('Error loading RSVPs from localStorage', e);
      }
    }
  }, []);

  const handleAddRSVP = (newRSVP: GuestRSVP) => {
    const updated = [newRSVP, ...rsvps];
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  const handleDeleteRSVP = (id: string) => {
    const updated = rsvps.filter((r) => r.id !== id);
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setRsvps([]);
    localStorage.removeItem('wedding_rsvps');
  };

  const handleEnvelopeOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }, 500);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative min-h-screen">
      <audio ref={audioRef} src="./svadba.mp3" loop />
      <AnimatePresence>
        {!isOpened ? (
          <Envelope guestName={guestName} onOpen={handleEnvelopeOpen} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full relative"
          >
            <button
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-md border border-gold-200 rounded-full shadow-lg flex items-center justify-center text-[#896e4f] hover:bg-gold-50 transition-colors"
            >
              {isPlaying ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <header className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <div className="absolute inset-0 w-full h-full scale-105 pointer-events-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center"
                  src="./0618.mp4"
                />
              </div>
              <div className="relative z-20 text-center text-white px-4 max-w-2xl flex flex-col items-center">
                <p className="text-sm sm:text-base font-sans tracking-[0.25em] text-gold-100 uppercase mb-4 font-light">
                  Приглашение на свадьбу
                </p>
                <h1 className="font-serif text-5xl sm:text-7xl tracking-[0.15em] uppercase text-[#fffffa] mb-6 select-none leading-tight drop-shadow-[0_5px_20px_rgba(0,0,0,0.45)]">
                  Мовсес
                  <span className="block italic text-3xl sm:text-4xl text-gold-200 my-2 font-normal lowercase tracking-widest">и</span>
                  Армине
                </h1>
                <div className="w-24 h-[1px] bg-gold-200/60 my-2" />
                <p className="text-lg sm:text-xl font-serif tracking-[0.2em] italic text-[#fffffa] mt-3 font-light">
                  10 сентября 2026
                </p>
                <p className="text-[10px] sm:text-xs tracking-[0.15em] font-sans text-stone-200 uppercase mt-1">
                  Четверг, 16:30
                </p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors cursor-pointer flex flex-col items-center gap-1"
                  onClick={() => {
                    const welcome = document.getElementById('welcome-section');
                    welcome?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="text-[9px] uppercase tracking-widest font-light">Листайте вниз</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
            </header>

            <section id="welcome-section" className="relative py-20 px-4 bg-[#fffffa] overflow-hidden">
              <img src={DEFAULT_COUPLE_1} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] sepia mix-blend-multiply pointer-events-none" />

              <div className="max-w-2xl mx-auto text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mx-1 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mx-1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mx-1 animate-pulse" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest text-[#896e4f] block mb-2">
                  Дорогие
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-stone-800 italic font-light mb-8 px-4 leading-relaxed">
                  {guestName ? guestName : 'Родные и Близкие!'}
                </h2>
                <div className="space-y-6 text-stone-800 font-sans font-light text-base sm:text-lg leading-relaxed px-4 max-w-lg mx-auto">
                  <p>
                    В нашей жизни состоится долгожданное событие —{' '}
                    <span className="font-medium text-tilda-beige">День нашей свадьбы!</span> 🌹
                  </p>
                  <p>
                    В этот особенный день мы хотим оказаться в окружении самых близких и дорогих нам людей.
                  </p>
                  <p>
                    С огромным удовольствием приглашаем Вас разделить с нами этот прекрасный праздник в честь создания нашей семьи! Наше счастье будет неполным без Вашего присутствия!
                  </p>
                </div>
                <div className="mt-10 flex justify-center">
                  <Heart className="w-4 h-4 text-gold-400/80 fill-gold-400/10" />
                </div>
              </div>
            </section>

            <section className="relative py-24 px-6 sm:px-8 bg-[#fcfbf9] border-y border-gold-200/20 overflow-hidden">
              <img src={DEFAULT_COUPLE_2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] sepia mix-blend-multiply pointer-events-none" />
              <div className="max-w-2xl mx-auto relative">
                <div className="text-center mb-16">
                  <span className="text-sm tracking-[0.25em] font-sans font-semibold text-[#896e4f] uppercase block mb-1">
                    Свадебный
                  </span>
                  <h3 className="font-serif text-4xl sm:text-5xl text-stone-800 italic font-light">
                    План Дня
                  </h3>
                  <div className="w-12 h-[1px] bg-gold-300 mx-auto mt-4" />
                </div>
                <div className="absolute left-[35px] sm:left-[45%] top-24 bottom-12 w-[1px] bg-gradient-to-b from-gold-300 via-gold-200 to-transparent -translate-x-1/2" />
                <div className="space-y-14">
                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-[45%] w-16 h-16 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-sm uppercase font-semibold text-[#896e4f] leading-none">16:30</span>
                      <span className="text-[9px] text-stone-500 font-medium">Сбор</span>
                    </div>
                    <div className="pl-20 sm:pl-0 sm:w-[calc(50%-2rem)] sm:pr-12 text-left sm:text-right">
                      <h4 className="font-serif text-xl sm:text-2xl text-stone-800 font-medium flex items-center gap-1.5 justify-start sm:justify-end">
                        Сбор гостей
                        <Clock className="w-5 h-5 text-gold-400" />
                      </h4>
                      <p className="text-sm sm:text-base text-stone-700 mt-2 font-light leading-relaxed">
                        Приветственный сбор на веранде ресторана и приятная предпраздничная атмосфера.
                      </p>
                    </div>
                    <div className="sm:w-[calc(50%-2rem)]" />
                  </motion.div>

                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-[45%] w-16 h-16 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-sm uppercase font-semibold text-[#896e4f] leading-none">17:30</span>
                      <span className="text-[9px] text-stone-500 font-medium">Венчание</span>
                    </div>
                    <div className="sm:w-[calc(50%-2rem)]" />
                    <div className="pl-20 sm:pl-12 sm:w-[calc(50%-2rem)] text-left">
                      <h4 className="font-serif text-xl sm:text-2xl text-stone-800 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-gold-400" />
                        Венчание
                      </h4>
                      <p className="text-sm sm:text-base text-stone-700 mt-2 font-light leading-relaxed">
                        Торжественная церемония бракосочетания.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-[45%] w-16 h-16 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-sm uppercase font-semibold text-[#896e4f] leading-none">18:00</span>
                      <span className="text-[9px] text-stone-500 font-medium">Банкет</span>
                    </div>
                    <div className="pl-20 sm:pl-0 sm:w-[calc(50%-2rem)] sm:pr-12 text-left sm:text-right">
                      <h4 className="font-serif text-xl sm:text-2xl text-stone-800 font-medium flex items-center gap-1.5 justify-start sm:justify-end">
                        Банкет
                        <Cake className="w-5 h-5 text-gold-400" />
                      </h4>
                      <p className="text-sm sm:text-base text-stone-700 mt-2 font-light leading-relaxed">
                        Праздничный ужин, поздравления и тёплые моменты.
                      </p>
                    </div>
                    <div className="sm:w-[calc(50%-2rem)]" />
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-28 px-4 bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 text-left">
                    <span className="text-sm tracking-[0.25em] font-sans font-semibold text-[#896e4f] uppercase block">
                      Где все состоится?
                    </span>
                    <h3 className="font-serif text-4xl sm:text-5xl text-stone-800 font-light italic leading-tight">
                      Локация и Место
                    </h3>
                    <div className="flex gap-3.5 items-start mt-8">
                      <div className="p-2.5 bg-gold-50 border border-gold-200 text-[#896e4f] rounded-xl flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl text-stone-800 font-medium">{VENUE_NAME}</h4>
                        <p className="text-base text-stone-700 font-light mt-1">{VENUE_ADDRESS}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light">
                      Мы выбрали замечательный ресторан «Робинзон Крузо» — прекрасный оазис уюта и великолепной кухни. Будем безмерно рады видеть Вас здесь на нашем свадебном ужине!
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-4">
                      <a
                        href="https://yandex.ru/maps/?text=Ресторан+Робинзон+Крузо+Краснодар+Тепличная+78/1"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 border border-gold-300 text-xs font-medium text-[#896e4f] hover:bg-gold-50 rounded-xl transition-all shadow-sm"
                      >
                        Яндекс Карты 🗺️
                      </a>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Ресторан+Робинзон+Крузо+Краснодар+Тепличная+78/1"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 border border-neutral-200 text-neutral-600 font-medium hover:bg-stone-50 text-xs rounded-xl transition-all"
                      >
                        Google Maps 📍
                      </a>
                    </div>
                  </div>

                  <div className="relative group rounded-3xl overflow-hidden shadow-xl border border-gold-100 p-2 bg-white">
                    <div className="relative aspect-square sm:aspect-video md:aspect-square bg-gradient-to-tr from-neutral-200 via-neutral-100 to-neutral-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#896e4f_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="relative z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gold-300 flex items-center justify-center mb-3"
                      >
                        <MapPin className="w-6 h-6 text-red-500 fill-red-100" />
                        <span className="absolute -bottom-1 w-2.5 h-1 bg-black/10 rounded-full blur-[1px]" />
                      </motion.div>
                      <div className="relative z-10 text-center max-w-[200px]">
                        <span className="text-xs uppercase font-sans font-semibold tracking-widest text-[#896e4f] block">
                          Робинзон Крузо
                        </span>
                        <span className="text-[10px] text-stone-600 block mt-1 font-light">
                          Краснодар, ул. Тепличная, 78/1
                        </span>
                      </div>
                      <a
                        href="https://yandex.ru/maps/?text=Ресторан+Робинзон+Крузо+Краснодар+Тепличная+78/1"
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-x-4 bottom-4 bg-[#896e4f] text-white py-2 rounded-xl text-xs font-semibold text-center select-none shadow hover:bg-gold-600 transition-colors uppercase tracking-widest"
                      >
                        Маршрут к ресторану
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative py-24 px-4 bg-[#fffffa]">

              <div id="rsvp-section" className="relative z-10 max-w-xl mx-auto">
                <RSVPForm onAddRSVP={handleAddRSVP} targetDate={WEDDING_DATE} />
              </div>
            </section>

            <section className="relative py-28 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[450px] bg-[#e8e1d9]">
              {/* Transparent couple photo */}
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <img
                  src={DEFAULT_COUPLE_1}
                  alt=""
                  className="h-full w-full object-cover opacity-[0.07] mix-blend-multiply"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-stone-100/10 via-transparent to-stone-900/10 pointer-events-none z-[1]" />
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="flex items-center gap-1.5 justify-center mb-6">
                  <div className="w-7 h-[1px] bg-stone-400" />
                  <Heart className="w-4 h-4 text-tilda-beige fill-[#896e4f]/20 animate-pulse" />
                  <div className="w-7 h-[1px] bg-stone-400" />
                </div>
                <h3 className="font-serif text-4xl sm:text-5xl text-stone-800 italic font-light mb-1">
                  До свадьбы осталось:
                </h3>
                <p className="text-sm text-stone-700 uppercase tracking-widest mb-10">
                  Мовсес & Армине // 10 сентября 2026
                </p>
                <CountdownTimer targetDate={WEDDING_DATE} />
                <div className="mt-14 max-w-xs mx-auto text-xs text-stone-400 italic">
                  «Более же всего облекитесь в любовь, которая есть совокупность совершенства»
                </div>
              </div>
            </section>

            <AdminPanel
              rsvps={rsvps}
              onAddRSVP={handleAddRSVP}
              onDeleteRSVP={handleDeleteRSVP}
              onClearAll={handleClearAll}
            />

            <footer className="bg-stone-950 text-white/50 text-center py-10 text-xs font-light tracking-widest border-t border-stone-900">
              <p>© МОВСЕС & АРМИНЕ, 2026. ВСЕ ПРАВА ЗАЩИЩЕНЫ</p>
              <p className="text-[10px] text-stone-700 mt-2 uppercase tracking-wide">
                Сделано с любовью // Wedding Site Prototype
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}