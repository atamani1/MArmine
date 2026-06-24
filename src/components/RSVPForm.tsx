import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Send, AlertCircle, Heart } from 'lucide-react';
import { GuestRSVP } from '../types';

interface RSVPFormProps {
  onAddRSVP: (rsvp: GuestRSVP) => void;
  targetDate: string;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onAddRSVP, targetDate }) => {
  const [fullName, setFullName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'yes_partner' | 'no'>('yes');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Пожалуйста, введите Ваше имя и фамилию 🌸');
      return;
    }

    setIsSubmitting(true);

    const attendanceText = attendance === 'yes' ? 'Придёт' : attendance === 'yes_partner' ? 'Придёт с +1' : 'Не сможет';

    const newRSVP: GuestRSVP = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: fullName.trim(),
      attendance,
      drinks: [],
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // Save to server + send Telegram notification
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRSVP),
      });
      const data = await res.json();
      if (!data.ok) {
        console.error('RSVP save failed:', data);
      }
    } catch (err) {
      console.error('RSVP request failed:', err);
    }

    // Backup to Formspree
    try {
      await fetch('https://formspree.io/f/xzdqqvev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          attendance: attendanceText,
          comment: comment.trim() || 'нет',
        }),
      });
    } catch {}

    onAddRSVP(newRSVP);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md border border-gold-200/40 p-6 sm:p-10 shadow-[0_15px_45px_-10px_rgba(137,110,79,0.12)]">
      {/* Decorative frame overlay */}
      <div className="absolute inset-3 border border-[#896e4f]/15 rounded-2xl pointer-events-none" />

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 px-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 mb-6">
            <Check className="w-8 h-8" />
          </div>
          
          <h3 className="font-serif text-3xl sm:text-4xl font-light text-stone-800 mb-3">
            Спасибо, анкетка отправлена!
          </h3>
          
          <p className="text-base text-stone-600 leading-relaxed max-w-xs mx-auto mb-6">
            {attendance === 'no'
              ? 'Нам искренне жаль, что Вы не сможете присутствовать, но мы очень рады Вашим теплым поздравлениям! ❤️'
              : 'Ваше RSVP успешно сохранено. Мы с нетерпением ждем нашей встречи на свадебном празднике! ✨'}
          </p>
          
          <div className="inline-flex items-center gap-1.5 text-sm text-tilda-beige font-semibold select-none border border-gold-300/30 bg-gold-50/40 rounded-full px-4 py-1.5 hover:bg-gold-50 transition-colors">
            <Heart className="w-4 h-4 fill-[#896e4f]/30" />
            До встречи 10.09.2026!
          </div>

          <button
            onClick={() => {
              setIsSuccess(false);
              setFullName('');
              setComment('');
              setAttendance('yes');
            }}
            className="block w-full text-center text-sm text-stone-400 mt-8 underline hover:text-tilda-beige transition-colors"
          >
            Изменить ответ или заполнить еще раз
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div className="text-center pb-2">
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#3e3830]">
              Анкета Гостя
            </h3>
            <p className="text-sm text-[#896e4f]/80 mt-1 uppercase tracking-widest font-medium">
              Пожалуйста, ответьте до 25 августа 2026
            </p>
          </div>

          {/* Guest Name input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold uppercase tracking-widest text-stone-700">
              Ваши Имя и Фамилия <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Иван Иванов / Мария Иванова"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-stone-50/50 border border-stone-200 focus:border-gold-400 focus:bg-white rounded-xl px-4 py-3.5 text-base transition-all focus:outline-none focus:ring-1 focus:ring-gold-300 placeholder:text-stone-300"
            />
          </div>

          {/* Attendance Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold uppercase tracking-widest text-stone-700">
              Планируете ли присутствовать на свадьбе? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              <label className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer text-base transition-all ${attendance === 'yes' ? 'border-gold-300 bg-gold-50/20 text-[#896e4f]' : 'border-stone-200 text-stone-700 bg-white/40 hover:bg-stone-50/60'}`}>
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={attendance === 'yes'}
                  onChange={() => setAttendance('yes')}
                  className="accent-[#896e4f]"
                />
                <span>Я обязательно приду ✨</span>
              </label>

              <label className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer text-base transition-all ${attendance === 'yes_partner' ? 'border-gold-300 bg-gold-50/20 text-[#896e4f]' : 'border-stone-200 text-stone-700 bg-white/40 hover:bg-stone-50/60'}`}>
                <input
                  type="radio"
                  name="attendance"
                  value="yes_partner"
                  checked={attendance === 'yes_partner'}
                  onChange={() => setAttendance('yes_partner')}
                  className="accent-[#896e4f]"
                />
                <span>Приду со второй половинкой (+1) 💑</span>
              </label>

              <label className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer text-base transition-all ${attendance === 'no' ? 'border-gold-300 bg-gold-50/20 text-[#896e4f]' : 'border-stone-200 text-stone-700 bg-white/40 hover:bg-stone-50/60'}`}>
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={attendance === 'no'}
                  onChange={() => setAttendance('no')}
                  className="accent-[#896e4f]"
                />
                <span>К сожалению, не смогу присутствовать 🕊️</span>
              </label>
            </div>
          </div>

          {/* Comment input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold uppercase tracking-widest text-stone-700">
              Комментарий
            </label>
            <textarea
              placeholder="Ваши пожелания или комментарий..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full bg-stone-50/50 border border-stone-200 focus:border-gold-400 focus:bg-white rounded-xl px-4 py-3.5 text-base transition-all focus:outline-none focus:ring-1 focus:ring-gold-300 placeholder:text-stone-300 resize-none"
            />
          </div>

          {/* Form warnings */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer relative py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 active:scale-[0.99] text-white rounded-xl text-base font-semibold uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Отправить!</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
