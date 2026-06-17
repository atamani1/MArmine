import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Clock,
  Cake,
  Sparkles,
  Flame,
  ChevronDown,
  Gift,
  Palette,
  Heart,
  Music,
  Maximize2,
  Check
} from 'lucide-react';

import { Envelope } from './components/Envelope';
import { CountdownTimer } from './components/CountdownTimer';
import { RSVPForm } from './components/RSVPForm';
import { AdminPanel } from './components/AdminPanel';
import { LeafDecoration } from './components/LeafDecoration';
import { GuestRSVP } from './types';

// Исправляем импорт изображений
import couple1Image from './assets/images/couple_1_1781684979074.jpg?url';
import couple2Image from './assets/images/couple_2_1781685000637.jpg?url';
import bgMusic from './assets/bg-music.mp3?url';
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
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.3;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
         setIsPlayingMusic(true);
      }).catch((e) => {
         console.warn('Audio play was rejected by browser policy', e);
      });
    }
  };

  const handleEnvelopeOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().then(() => {
          setIsPlayingMusic(true);
        }).catch((e) => {
          console.warn('Audio autoplay failed, user needs to click icon manually', e);
        });
      }
    }, 500);
  };

  const dressCodePalette = [
    { name: 'Пудровый нюд', bg: 'bg-[#f4efe8]', hex: '#f4efe8' },
    { name: 'Дымчатая роза', bg: 'bg-[#e2cdc6]', hex: '#e2cdc6' },
    { name: 'Пыльный шалфей', bg: 'bg-[#b6c5b2]', hex: '#b6c5b2' },
    { name: 'Песочный кварц', bg: 'bg-[#dfcebe]', hex: '#dfcebe' },
    { name: 'Золотой шелк', bg: 'bg-[#e2c1a2]', hex: '#e2c1a2' },
  ];

  return (
    <div className="relative min-h-screen">
      <audio
        ref={audioRef}
        src={bgMusic}
        loop
        preload="auto"
      />

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
            <div className="fixed top-4 right-4 z-40">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleMusic}
                className="p-3 bg-white/80 backdrop-blur-sm border border-gold-300 shadow-md rounded-full text-stone-600 hover:text-tilda-beige cursor-pointer"
              >
                {isPlayingMusic ? (
                  <div className="relative">
                    <Volume2 className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            <header className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <div className="absolute inset-0 w-full h-full scale-105 pointer-events-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                  src="https://b4701886-2e3c-4a60-9e9f-056bd416f1cc.selstorage.ru/IMG_8746.MOV"
                  poster="https://static.tildacdn.com/tild3363-3936-4130-a265-356138616438/Group_2399.jpg"
                />
              </div>
              <div className="relative z-20 text-center text-white px-4 max-w-2xl flex flex-col items-center">
                <p className="text-xs sm:text-sm font-sans tracking-[0.25em] text-gold-100 uppercase mb-4 font-light">
                  Приглашение на свадьбу
                </p>
                <h1 className="font-serif text-5xl sm:text-7xl tracking-wide text-[#fffffa] mb-6 select-none leading-tight drop-shadow-[0_5px_20px_rgba(0,0,0,0.45)]">
                  Мовсес
                  <span className="block italic text-3xl sm:text-4xl text-gold-200 my-2 font-normal">и</span>
                  Армине
                </h1>
                <div className="w-24 h-[1px] bg-gold-200/60 my-2" />
                <p className="text-lg sm:text-xl font-serif tracking-[0.2em] italic text-[#fffffa] mt-3 font-light">
                  10 сентября 2026
                </p>
                <p className="text-[10px] sm:text-xs tracking-[0.15em] font-sans text-stone-200 uppercase mt-1">
                  Четверг, 16:00
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
              <div className="absolute top-0 right-0 w-32 h-32 opacity-25">
                <LeafDecoration rotation={45} />
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 opacity-25">
                <LeafDecoration rotation={225} flip />
              </div>
              <div className="max-w-2xl mx-auto text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mx-1 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mx-1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mx-1 animate-pulse" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#896e4f]/80 block mb-2">
                  Дорогие
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 italic font-light mb-8 px-4 leading-relaxed">
                  {guestName ? guestName : 'Родные и Близкие!'}
                </h2>
                <div className="space-y-6 text-stone-600 font-sans font-light text-sm sm:text-base leading-relaxed px-4 max-w-lg mx-auto">
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

            <section className="relative py-12 pb-24 px-4 bg-[#fffffa]">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="bg-white border border-gold-200/40 p-4 sm:p-5 shadow-[0_20px_50px_rgba(137,110,79,0.045)] rounded-[2rem] relative overflow-hidden group flex flex-col justify-between"
                  >
                    <div className="absolute inset-2 border border-gold-200/25 rounded-[1.8rem] pointer-events-none" />
                    <div className="relative rounded-[1.6rem] overflow-hidden aspect-[4/5] sm:aspect-[4/5]">
                      <img
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-[4s]"
                        src={DEFAULT_COUPLE_1}
                        alt="Мовсес и Армине"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-white border border-gold-200/40 p-4 sm:p-5 shadow-[0_20px_50px_rgba(137,110,79,0.045)] rounded-[2rem] relative overflow-hidden group md:translate-y-8 flex flex-col justify-between"
                  >
                    <div className="absolute inset-2 border border-gold-200/25 rounded-[1.8rem] pointer-events-none" />
                    <div className="relative rounded-[1.6rem] overflow-hidden aspect-[4/5] sm:aspect-[4/5]">
                      <img
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-[4s]"
                        src={DEFAULT_COUPLE_2}
                        alt="Мовсес и Армине"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-24 px-4 bg-[#fcfbf9] border-y border-gold-200/20 overflow-hidden">
              <img src={DEFAULT_COUPLE_2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] sepia mix-blend-multiply pointer-events-none" />
              <div className="max-w-xl mx-auto relative">
                <div className="text-center mb-16">
                  <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-[#896e4f] uppercase block mb-1">
                    Свадебный
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-stone-800 italic font-light">
                    План Дня
                  </h3>
                  <div className="w-12 h-[1px] bg-gold-300 mx-auto mt-4" />
                </div>
                <div className="absolute left-[27px] sm:left-1/2 top-24 bottom-12 w-[1px] bg-gradient-to-b from-gold-300 via-gold-200 to-transparent -translate-x-1/2" />
                <div className="space-y-12">
                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-1/2 w-14 h-14 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-xs uppercase font-semibold text-[#896e4f] leading-none">16:00</span>
                      <span className="text-[8px] text-stone-400 font-medium">Сбор</span>
                    </div>
                    <div className="pl-16 sm:pl-0 sm:w-1/2 sm:pr-12 text-left sm:text-right">
                      <h4 className="font-serif text-lg text-stone-800 font-medium flex items-center gap-1.5 justify-start sm:justify-end">
                        <Clock className="w-4 h-4 text-gold-400" />
                        Сбор гостей
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light leading-relaxed">
                        Приветственный сбор, знакомство приглашённых гостей на веранде ресторана и приятная предпраздничная атмосфера. Время сделать первые памятные кадры.
                      </p>
                    </div>
                    <div className="sm:w-1/2" />
                  </motion.div>

                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-1/2 w-14 h-14 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-xs uppercase font-semibold text-[#896e4f] leading-none">16:30</span>
                      <span className="text-[8px] text-stone-400 font-medium">Начало</span>
                    </div>
                    <div className="sm:w-1/2" />
                    <div className="pl-16 sm:pl-12 sm:w-1/2 text-left">
                      <h4 className="font-serif text-lg text-stone-800 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        Свадебное торжество
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light leading-relaxed">
                        Торжественная церемония и начало официального ужина. Вас ждут тёплые поздравления, изысканный праздничный банкет, живая музыка и трогательные признания.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-1/2 w-14 h-14 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-xs uppercase font-semibold text-[#896e4f] leading-none">21:00</span>
                      <span className="text-[8px] text-stone-400 font-medium">Торт</span>
                    </div>
                    <div className="pl-16 sm:pl-0 sm:w-1/2 sm:pr-12 text-left sm:text-right">
                      <h4 className="font-serif text-lg text-stone-800 font-medium flex items-center gap-1.5 justify-start sm:justify-end">
                        <Cake className="w-4 h-4 text-gold-400" />
                        Вынос торта
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light leading-relaxed">
                        Кульминационный сладкий момент свадебного банкета — эффектное появление и разрезание авторского праздничного торта.
                      </p>
                    </div>
                    <div className="sm:w-1/2" />
                  </motion.div>

                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    initial={{ opacity: 0, y: 30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center relative"
                  >
                    <div className="absolute left-0 sm:left-1/2 w-14 h-14 bg-white border border-gold-300 rounded-full flex flex-col items-center justify-center -translate-x-1/2 shadow-sm z-10">
                      <span className="text-xs uppercase font-semibold text-[#896e4f] leading-none">23:00</span>
                      <span className="text-[8px] text-stone-400 font-medium">Финал</span>
                    </div>
                    <div className="sm:w-1/2" />
                    <div className="pl-16 sm:pl-12 sm:w-1/2 text-left">
                      <h4 className="font-serif text-lg text-stone-800 font-medium flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-gold-400" />
                        Финал вечера
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light leading-relaxed">
                        Завершение прекрасного праздника, теплые слова благодарности и прощальные объятия. Мы от всего сердца благодарим за то, что Вы разделили этот важный день с нами!
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-28 px-4 bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 text-left">
                    <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-[#896e4f] uppercase block">
                      Где все состоится?
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-stone-800 font-light italic leading-tight">
                      Локация и Место
                    </h3>
                    <div className="flex gap-3.5 items-start mt-8">
                      <div className="p-2.5 bg-gold-50 border border-gold-200 text-[#896e4f] rounded-xl flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-stone-800 font-medium">{VENUE_NAME}</h4>
                        <p className="text-sm text-stone-500 font-light mt-1">{VENUE_ADDRESS}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
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
                        <span className="text-[10px] text-stone-500 block mt-1 font-light">
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

            <section className="relative py-24 px-4 bg-gradient-to-b from-[#fcfbf9] to-[#fffffa] border-t border-gold-200/20">
              <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-gold-200/40 p-6 sm:p-12 shadow-[0_15px_40px_-5px_rgba(137,110,79,0.06)] relative overflow-hidden">
                <div className="absolute inset-3 border border-neutral-100 rounded-2xl pointer-events-none" />
                <div className="text-center relative z-10">
                  <div className="inline-flex p-3 bg-gold-50 border border-gold-100 rounded-full text-gold-400 mb-4 items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-stone-800 italic font-light mb-4">
                    Пожелания по Dress-code
                  </h3>
                  <div className="w-12 h-[1px] bg-gold-200 mx-auto mb-6" />
                  <p className="text-stone-600 font-sans font-light text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-10">
                    Нам будет приятно, если вы выберете утонченный наряд в праздничном и элегантном стиле. <span className="font-semibold text-tilda-beige">Ваш комфорт важнее всего!</span> Будем очень рады, если Ваши платья и костюмы будут соответствовать гармоничной цветовой гамме нашего торжества:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mb-10 select-none">
                    {dressCodePalette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.15, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedColor(idx)}
                          className={`w-12 h-12 rounded-full ${color.bg} shadow-inner border border-gold-300/30 transition-all cursor-pointer relative ${selectedColor === idx ? 'ring-2 ring-[#896e4f] ring-offset-2 scale-110' : ''}`}
                        >
                          {selectedColor === idx && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center text-[#896e4f]"
                              >
                                <Check className="w-5 h-5 font-bold" />
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </motion.button>
                        <span className="text-[10px] text-stone-500 font-medium mt-1.5 uppercase tracking-widest">{color.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-stone-100 max-w-md mx-auto">
                    <div className="flex justify-center mb-3">
                      <Gift className="w-5 h-5 text-gold-400" />
                    </div>
                    <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-[#896e4f] block mb-1">
                      О подарках
                    </span>
                    <p className="text-xs text-stone-400 leading-relaxed font-light">
                      Мы будем рады вещам, которые помогут нам обустроить наше новое семейное гнездышко, или Вашим самым душевным поздравлениям в красивом праздничном конверте. Пожалуйста, откажитесь от объемных цветочных букетов – мы улетаем в медовый месяц сразу после торжества! ✈️
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative py-24 px-4 bg-[#fffffa]">
              <div className="absolute top-1/2 left-0 right-0 h-[100px] pointer-events-none -translate-y-1/2 opacity-25 flex justify-between px-10">
                <LeafDecoration rotation={90} />
                <LeafDecoration rotation={270} flip />
              </div>
              <div id="rsvp-section" className="relative z-10 max-w-xl mx-auto">
                <RSVPForm onAddRSVP={handleAddRSVP} targetDate={WEDDING_DATE} />
              </div>
            </section>

            <section className="relative py-28 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
              {/* Video background */}
              <div className="absolute inset-0 z-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="https://b4701886-2e3c-4a60-9e9f-056bd416f1cc.selstorage.ru/IMG_8746.MOV"
                />
                <div className="absolute inset-0 bg-white/60" />
              </div>
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
                <h3 className="font-serif text-3xl sm:text-4xl text-stone-850 italic font-light mb-1">
                  До свадьбы осталось:
                </h3>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-10">
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
              <p className="text-[10px] text-stone-600 mt-2 uppercase tracking-wide">
                Сделано с любовью // Wedding Site Prototype
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}