let rsvps = [];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify(rsvps) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');

      // If it's an RSVP object (has fullName), save it and send Telegram
      if (body.fullName && body.attendance) {
        rsvps.unshift(body);

        const attendanceText = body.attendance === 'yes' ? 'Придёт' : body.attendance === 'yes_partner' ? 'Придёт с +1' : 'Не сможет';
        const attendanceEmoji = body.attendance === 'yes' ? '✅' : body.attendance === 'yes_partner' ? '💑' : '❌';
        const message = `💌 *Новый ответ на RSVP*\n\n👤 *Гость:* ${body.fullName}\n${attendanceEmoji} *Статус:* ${attendanceText}\n💬 *Комментарий:* ${body.comment || 'нет'}`;

        const telegramToken = '8681595433:AAHUxyHAFs2wqzWMJWBQJd-dBQNqfURtILw';
        const chatId = '-1004305832940';

        try {
          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
          });
        } catch {}

        return { statusCode: 200, headers, body: JSON.stringify({ ok: true, count: rsvps.length }) };
      }

      // Legacy: if it's a raw message string, just send to Telegram
      if (body.message) {
        const telegramToken = '8681595433:AAHUxyHAFs2wqzWMJWBQJd-dBQNqfURtILw';
        const chatId = '-1004305832940';

        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: body.message, parse_mode: 'Markdown' }),
        });

        const data = await response.json();
        if (!data.ok) {
          return { statusCode: 500, headers, body: JSON.stringify({ error: 'Telegram API error', details: data }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
      }

      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing message or RSVP data' }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
