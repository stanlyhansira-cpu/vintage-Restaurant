import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Sparkles, 
  Utensils, 
  AlertCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ReserveTableProps {
  isStandalone?: boolean;
}

export const ReserveTable: React.FC<ReserveTableProps> = ({ isStandalone = false }) => {
  const { settings, showToast, t, language } = useRestaurant();

  // Form states
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('19:30');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [customGuests, setCustomGuests] = useState<string>('');
  const [isCustomGuests, setIsCustomGuests] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seatingPreference, setSeatingPreference] = useState('Main Dining Lounge');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [specialRequests, setSpecialRequests] = useState('');

  // UI status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReservation, setSubmittedReservation] = useState<{
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    seating: string;
    occasion: string;
    specialRequests?: string;
    whatsappUrl: string;
  } | null>(null);

  // Sri Lankan phone validation
  const validatePhone = (num: string): boolean => {
    const clean = num.replace(/[\s\-\(\)]/g, '');
    return /^(?:0|94|\+94)?7[0-9]{8}$/.test(clean);
  };

  // Preset time slots
  const popularTimes = [
    { label: '12:30 PM', value: '12:30' },
    { label: '01:30 PM', value: '13:30' },
    { label: '06:30 PM', value: '18:30' },
    { label: '07:30 PM', value: '19:30' },
    { label: '08:30 PM', value: '20:30' },
    { label: '09:30 PM', value: '21:30' },
  ];

  // Preset guest counts
  const guestPresets = [1, 2, 4, 6, 8, 10];

  // Seating options
  const seatingOptions = language === 'si' ? [
    'ප්‍රධාන භෝජන ශාලාව (Main Dining)',
    'AC ඇතුළත ප්‍රදේශය (AC Indoor)',
    'මහා මාර්ගය පෙනෙන ජනේලය අසල (Highway View)',
    'පවුලේ කොටස (Family Section)',
    'බැල්කනිය / එළිමහන (Balcony / Outdoor)'
  ] : [
    'Main Dining Lounge',
    'AC Indoor Area',
    'Highway View Window',
    'Family Section',
    'Outdoor / Balcony'
  ];

  // Occasions
  const occasions = language === 'si' ? [
    'සාමාන්‍ය භෝජනය (Casual Dining)',
    'උපන් දින සැමරුම (Birthday)',
    'විවාහ සංවත්සරය (Anniversary)',
    'සොඳුරු රාත්‍රී භෝජනය (Romantic)',
    'පවුලේ හමුවීමක් (Family Gathering)',
    'ව්‍යාපාරික හමුවක් (Business Meeting)'
  ] : [
    'Casual Dining',
    'Birthday Celebration',
    'Anniversary',
    'Romantic Dinner',
    'Family Gathering',
    'Business / Meeting'
  ];

  // Format 24h time to 12h display
  const formatTimeDisplay = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const actualGuests = isCustomGuests ? parseInt(customGuests, 10) : guestsCount;

    if (!name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    if (!phone.trim() || !validatePhone(phone)) {
      setErrorMessage('Please provide a valid Sri Lankan mobile number (e.g. 071 996 1500).');
      return;
    }

    if (!date) {
      setErrorMessage('Please select a reservation date.');
      return;
    }

    if (!time) {
      setErrorMessage('Please select a reservation time.');
      return;
    }

    if (!actualGuests || actualGuests < 1 || isNaN(actualGuests)) {
      setErrorMessage('Please enter a valid number of guests.');
      return;
    }

    // Prepare WhatsApp Message
    const formattedTime = formatTimeDisplay(time);
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    let message = `🍽️ *TABLE RESERVATION REQUEST*\n`;
    message += `*${settings.name}*\n\n`;
    message += `👤 *Name:* ${name.trim()}\n`;
    message += `📞 *Phone:* ${phone.trim()}\n`;
    message += `📅 *Date:* ${formattedDate}\n`;
    message += `⏰ *Time:* ${formattedTime}\n`;
    message += `👥 *Number of Guests:* ${actualGuests} ${actualGuests === 1 ? 'Guest' : 'Guests'}\n`;
    message += `🪑 *Seating Preference:* ${seatingPreference}\n`;
    message += `🎉 *Occasion:* ${occasion}\n`;

    if (specialRequests.trim()) {
      message += `📝 *Special Requests:* ${specialRequests.trim()}\n`;
    }

    message += `\n_Please confirm if a table is available at this time. Thank you!_`;

    // Destination phone number
    let cleanPhone = settings.whatsapp_number.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('94')) {
      cleanPhone = '94' + cleanPhone;
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Store submission state
    setSubmittedReservation({
      name: name.trim(),
      phone: phone.trim(),
      date: formattedDate,
      time: formattedTime,
      guests: actualGuests,
      seating: seatingPreference,
      occasion,
      specialRequests: specialRequests.trim() || undefined,
      whatsappUrl
    });

    showToast('Reservation request prepared for WhatsApp!', 'success');

    // Automatically trigger WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetForm = () => {
    setSubmittedReservation(null);
    setErrorMessage(null);
    setName('');
    setPhone('');
    setDate(todayStr);
    setTime('19:30');
    setGuestsCount(2);
    setCustomGuests('');
    setIsCustomGuests(false);
    setSpecialRequests('');
  };

  return (
    <section id="reserve-table-section" className={`${isStandalone ? 'py-12' : 'py-20'} px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto`}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C59A4E] mb-2">
          <Utensils className="w-3.5 h-3.5" />
          <span>{t('res_tag')}</span>
        </div>
        <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6F3EE] mb-3">
          {t('res_title')}
        </h2>
        <p className="text-sm text-[#A89F93]">
          {t('res_subtitle')}
        </p>
      </div>

      {/* Confirmation View after submitting */}
      {submittedReservation ? (
        <div className="rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/30 p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-white mb-2">
              {t('res_success_title')}
            </h3>
            <p className="text-sm text-[#C3BAAF] max-w-md mx-auto">
              {t('res_success_desc')}
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#262420] border border-white/5 text-xs text-left space-y-3">
            <div className="flex justify-between pb-2 border-b border-white/5">
              <span className="text-[#857D74]">{language === 'si' ? 'අමුත්තාගේ නම:' : 'Guest Name:'}</span>
              <span className="text-white font-semibold">{submittedReservation.name}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/5">
              <span className="text-[#857D74]">{language === 'si' ? 'දුරකථන අංකය:' : 'Contact:'}</span>
              <span className="text-white font-mono">{submittedReservation.phone}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/5">
              <span className="text-[#857D74]">{language === 'si' ? 'දිනය සහ වේලාව:' : 'Date & Time:'}</span>
              <span className="text-[#C59A4E] font-semibold">{submittedReservation.date} at {submittedReservation.time}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/5">
              <span className="text-[#857D74]">{language === 'si' ? 'පැමිණෙන සංඛ්‍යාව:' : 'Party Size:'}</span>
              <span className="text-white font-semibold">{submittedReservation.guests} {language === 'si' ? 'දෙනෙක්' : (submittedReservation.guests === 1 ? 'Guest' : 'Guests')}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/5">
              <span className="text-[#857D74]">{language === 'si' ? 'ප්‍රදේශය:' : 'Seating:'}</span>
              <span className="text-white">{submittedReservation.seating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#857D74]">{language === 'si' ? 'අවස්ථාව:' : 'Occasion:'}</span>
              <span className="text-white">{submittedReservation.occasion}</span>
            </div>
            {submittedReservation.specialRequests && (
              <div className="pt-2 border-t border-white/5 text-amber-200/90 italic">
                Note: "{submittedReservation.specialRequests}"
              </div>
            )}
          </div>

          {/* Prompt to send WhatsApp */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left max-w-md mx-auto flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{t('res_success_prompt')}</span>
              <span>{language === 'si' ? 'වින්ටේජ් ආපනශාලා කාර්ය මණ්ඩලය විනාඩි කිහිපයක් තුළ ඔබගේ මේසය වෙන්කිරීම තහවුරු කරනු ඇත.' : 'Our team at Vintage Restaurant & Cafe will verify floor availability and confirm your table promptly.'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={submittedReservation.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('res_continue_whatsapp')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#262420] hover:bg-[#302d28] text-[#C3BAAF] hover:text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('res_another_btn')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Booking Form */
        <div className="rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/25 p-6 sm:p-10 shadow-2xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Date, Time & Party Size */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="w-6 h-6 rounded-full bg-[#C59A4E]/20 text-[#C59A4E] text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-serif-vintage text-base font-bold text-white uppercase tracking-wider">
                  {t('res_step1_title')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Date Picker */}
                <div>
                  <label htmlFor="reservation-date" className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C59A4E]" />
                    <span>{t('res_date_label')} <span className="text-[#C59A4E]">*</span></span>
                  </label>
                  <input
                    id="reservation-date"
                    type="date"
                    required
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  />
                  <span className="block text-[11px] text-[#7A7268] mt-1">
                    {language === 'si' ? 'දිනපතා රාත්‍රී 11:00 දක්වා විවෘතයි' : 'Open daily for dining until 11:00 PM'}
                  </span>
                </div>

                {/* Time Picker */}
                <div>
                  <label htmlFor="reservation-time" className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#C59A4E]" />
                    <span>{t('res_time_label')} <span className="text-[#C59A4E]">*</span></span>
                  </label>
                  <input
                    id="reservation-time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] focus:outline-none focus:border-[#C59A4E] transition-colors mb-2"
                  />
                  {/* Quick preset slots */}
                  <div className="flex flex-wrap gap-1.5">
                    {popularTimes.map(slot => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setTime(slot.value)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          time === slot.value
                            ? 'bg-[#C59A4E] text-black'
                            : 'bg-[#262420] text-[#857D74] hover:text-white'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2.5 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#C59A4E]" />
                  <span>{t('res_guests_label')} <span className="text-[#C59A4E]">*</span></span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  {guestPresets.map(count => {
                    const isSelected = !isCustomGuests && guestsCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setGuestsCount(count);
                          setIsCustomGuests(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#C59A4E] text-black shadow-md'
                            : 'bg-[#262420] text-[#A89F93] hover:text-white border border-white/5'
                        }`}
                      >
                        {count} {language === 'si' ? 'දෙනෙක්' : (count === 1 ? 'Guest' : 'Guests')}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setIsCustomGuests(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isCustomGuests
                        ? 'bg-[#C59A4E] text-black shadow-md'
                        : 'bg-[#262420] text-[#A89F93] hover:text-white border border-white/5'
                    }`}
                  >
                    {t('res_custom_guests')}
                  </button>

                  {isCustomGuests && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={customGuests}
                        onChange={(e) => setCustomGuests(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-24 px-3 py-2 rounded-xl bg-[#262420] border border-[#C59A4E] text-xs font-bold text-white focus:outline-none"
                      />
                      <span className="text-xs text-[#857D74]">{language === 'si' ? 'දෙනෙක්' : 'people'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Contact Information */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="w-6 h-6 rounded-full bg-[#C59A4E]/20 text-[#C59A4E] text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-serif-vintage text-base font-bold text-white uppercase tracking-wider">
                  {t('res_step2_title')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    {t('res_name_label')} <span className="text-[#C59A4E]">*</span>
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'si' ? 'උදා: රුවන් වික්‍රමසිංහ' : 'e.g. Ruwan Wickramasinghe'}
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#666] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="res-phone" className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    {t('res_phone_label')} <span className="text-[#C59A4E]">*</span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 071 996 1500 or 077 123 4567"
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#666] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  />
                  <span className="block text-[11px] text-[#7A7268] mt-1">
                    {language === 'si' ? 'මෙම අංකයෙන් WhatsApp පණිවිඩය විවෘත වනු ඇත.' : 'The WhatsApp reservation will open from this number.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Seating & Occasion */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="w-6 h-6 rounded-full bg-[#C59A4E]/20 text-[#C59A4E] text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-serif-vintage text-base font-bold text-white uppercase tracking-wider">
                  {t('res_step3_title')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Seating preference */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2">
                    {t('res_seating_label')}
                  </label>
                  <select
                    value={seatingPreference}
                    onChange={(e) => setSeatingPreference(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  >
                    {seatingOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2">
                    {t('res_occasion_label')}
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  >
                    {occasions.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="res-requests" className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2">
                  {t('res_notes_label')}
                </label>
                <textarea
                  id="res-requests"
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={language === 'si' ? 'උදා: ළදරු පුටුවක් සූදානම් කරන්න; උපන්දිනය සැමරීමක්; ජනේලය අසල මේසයක් ලබා දෙන්න.' : "e.g. Please arrange a baby high chair; celebrating my wife's birthday; window side table preferred."}
                  className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#666] focus:outline-none focus:border-[#C59A4E] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="submit"
                id="btn-send-whatsapp-reservation"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t('res_submit_btn')}</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#857D74] gap-2 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C59A4E]" />
                  <span>{settings.address}</span>
                </span>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-[#C59A4E] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'si' ? 'ක්ෂණික විමසීම්:' : 'Immediate inquiry:'} {settings.phone}</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
