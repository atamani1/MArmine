import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Plus,
  Share2,
  Lock,
  Compass,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { GuestRSVP } from '../types';

interface AdminPanelProps {
  rsvps: GuestRSVP[];
  onAddRSVP: (rsvp: GuestRSVP) => void;
  onDeleteRSVP: (id: string) => void;
  onClearAll: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  rsvps,
  onAddRSVP,
  onDeleteRSVP,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [linkGuestName, setLinkGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-generate invite links
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkGuestName.trim()) return;

    const domain = window.location.origin + window.location.pathname;
    const encoded = encodeURIComponent(linkGuestName.trim());
    setGeneratedLink(`${domain}?to=${encoded}`);
    setCopiedLink(false);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026' || passcode === 'admin') {
      setIsUnlocked(true);
    } else {
      alert('Неверный пин-код. Попробуйте "2026" (указан в подсказке)');
    }
  };

  const handleAddMockData = () => {
    const mockNames = [
      'Артур и Алина Геворгян',
      'Екатерина Смирнова',
      'Тигран Кочарян',
      'Маргарита Петросян',
      'Никита и Анна',
    ];
    const mockAttendances = ['yes', 'yes_partner', 'yes', 'no', 'yes_partner'] as const;
    const mockDrinks = [
      ['red_wine', 'champagne'],
      ['white_wine', 'non_alc'],
      ['whiskey_cognac'],
      [],
      ['red_wine', 'white_wine', 'whiskey_cognac'],
    ];
    const mockComments = [
      'Очень ждем этого события!',
      'Аллергия на арахис 🥜',
      '',
      'К сожалению буду в командировке 😔 Поздравляю вас!',
      'Веганское меню если возможно 🌱',
    ];

    const randomIndex = Math.floor(Math.random() * mockNames.length);
    const mockRSVP: GuestRSVP = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: mockNames[randomIndex] + ' ' + (Math.floor(Math.random() * 90) + 10),
      attendance: mockAttendances[randomIndex],
      drinks: mockDrinks[randomIndex],
      comment: mockComments[randomIndex] || undefined,
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    };

    onAddRSVP(mockRSVP);
  };

  // Stats calculation
  const totalGuests = rsvps.reduce((acc, r) => {
    if (r.attendance === 'yes') return acc + 1;
    if (r.attendance === 'yes_partner') return acc + 2;
    return acc;
  }, 0);

  const attendingCount = rsvps.filter((r) => r.attendance !== 'no').length;
  const decliningCount = rsvps.filter((r) => r.attendance === 'no').length;

  const drinkStats = rsvps.reduce((acc: { [key: string]: number }, r) => {
    if (r.attendance !== 'no') {
      r.drinks.forEach((d) => {
        acc[d] = (acc[d] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const filteredRsvps = rsvps.filter((r) =>
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Subtle Admin Trigger in bottom right */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-3 bg-white/90 backdrop-blur border border-gold-300 shadow-[0_4px_12px_rgba(137,110,79,0.15)] rounded-full text-stone-600 hover:text-[#896e4f] cursor-pointer hover:border-[#896e4f]"
          title="Панель организатора"
        >
          <Compass className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
            {/* Overlay click closer */}
            <div className="absolute inset-x-0 inset-y-0" onClick={() => setIsOpen(false)} />

            {/* Sidebar panel content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-[#fdfcf9] border-l border-gold-200 shadow-2xl p-6 overflow-y-auto flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-lg text-stone-800 font-semibold flex items-center gap-1.5">
                    <Compass className="w-5 h-5 text-gold-500" />
                    Панель Организатора
                  </h3>
                  <p className="text-[11px] text-stone-400">Прототип управления ответами гостей</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg text-xs"
                >
                  Закрыть
                </button>
              </div>

              {!isUnlocked ? (
                /* Password Entry Screen */
                <form onSubmit={handleUnlock} className="flex-1 flex flex-col justify-center max-w-sm mx-auto space-y-4">
                  <div className="text-center">
                    <div className="mx-auto w-10 h-10 bg-gold-50 border border-gold-200 text-gold-500 rounded-full flex items-center justify-center mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-medium text-stone-700">Вход защищен кодом</h4>
                    <p className="text-xs text-stone-400 mt-1">Панель для просмотра статистики в реальном времени</p>
                  </div>
                  
                  <div className="space-y-1">
                    <input
                      type="password"
                      placeholder="Введите пароль"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full border border-stone-200 bg-white rounded-xl px-4 py-2 text-center text-sm outline-none focus:border-gold-400"
                    />
                    <span className="block text-[10px] text-stone-400 text-center">
                      Подсказка: введите <b>2026</b> или <b>admin</b>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-tilda-beige hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                  >
                    Разблокировать
                  </button>
                </form>
              ) : (
                /* Real Dashboard Content */
                <div className="flex-1 flex flex-col space-y-6 mt-4 pb-20">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white border rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-gold-500 mx-auto mb-1.5" />
                      <span className="block text-xl font-serif font-semibold text-stone-800">{totalGuests}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Гостей придет</span>
                    </div>

                    <div className="bg-white border rounded-xl p-3 text-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                      <span className="block text-xl font-serif font-semibold text-stone-800">{attendingCount}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Анкет «да»</span>
                    </div>

                    <div className="bg-white border rounded-xl p-3 text-center">
                      <XCircle className="w-5 h-5 text-rose-500 mx-auto mb-1.5" />
                      <span className="block text-xl font-serif font-semibold text-stone-800">{decliningCount}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Отказов</span>
                    </div>
                  </div>

                  {/* Personal invite URL generator */}
                  <div className="bg-white/80 border border-gold-200/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-[#896e4f] mb-2 flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      Генератор личных приглашений
                    </h4>
                    <p className="text-[10px] text-stone-500 mb-3">
                      Впишите имя гостя для создания персональной ссылки с личным обращением при входе!
                    </p>

                    <form onSubmit={handleGenerateLink} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Имя гостя (например: Тетя Лена)"
                        value={linkGuestName}
                        onChange={(e) => setLinkGuestName(e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-gold-400 focus:bg-white"
                      />
                      <button
                        type="submit"
                        className="px-3 bg-tilda-beige hover:bg-gold-500 text-white rounded-lg text-xs font-medium"
                      >
                        Создать
                      </button>
                    </form>

                    {generatedLink && (
                      <div className="mt-3 flex items-center gap-1 bg-gold-50 p-2 rounded-lg border border-gold-200/50">
                        <span className="flex-1 text-[10px] text-stone-600 truncate font-mono">
                          {generatedLink}
                        </span>
                        <button
                          onClick={handleCopy}
                          className="p-1 px-2 bg-white border border-stone-200 rounded text-[10px] text-stone-600 hover:bg-stone-50 flex items-center gap-1"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLink ? 'Скопировано' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>



                  {/* Actions Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddMockData}
                      className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 border text-stone-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-stone-500" />
                      Добавить тест-гостя
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите сбросить все RSVP?')) {
                          onClearAll();
                        }
                      }}
                      className="py-2 px-3 border border-stone-200 hover:bg-rose-50 text-stone-500 hover:text-rose-600 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      title="Очистить список"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Сброс
                    </button>
                  </div>

                  {/* Guests Table */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-[#896e4f]">
                        Список Ответов ({filteredRsvps.length})
                      </h4>
                      <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-stone-100/70 border text-stone-800 rounded-lg px-2.5 py-1 text-[11px] outline-none max-w-[140px] focus:bg-white"
                      />
                    </div>

                    <div className="divide-y divide-stone-100">
                      {filteredRsvps.length === 0 ? (
                        <div className="text-center py-6 text-xs text-stone-400 bg-stone-50/50 rounded-xl border border-dashed">
                          Нет ответов в списке. Нажмите кнопку выше для имитации тестовых пользователей!
                        </div>
                      ) : (
                        filteredRsvps.map((r) => (
                          <div key={r.id} className="py-3 flex flex-col gap-1 text-xs">
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-stone-700">{r.fullName}</span>
                              <div className="flex items-center gap-1 text-stone-400 text-[10px]">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <button
                                  onClick={() => onDeleteRSVP(r.id)}
                                  className="ml-2 text-stone-400 hover:text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {r.attendance === 'yes' && (
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                  Придёт
                                </span>
                              )}
                              {r.attendance === 'yes_partner' && (
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                  С парой (+1)
                                </span>
                              )}
                              {r.attendance === 'no' && (
                                <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                  Не сможет
                                </span>
                              )}


                            </div>

                            {r.comment && (
                              <p className="bg-stone-50 border-l-2 border-gold-300 p-1.5 rounded-r mt-1 text-[11px] text-stone-600 italic">
                                «{r.comment}»
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
