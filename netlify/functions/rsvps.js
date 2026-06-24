let rsvps = [];

const TELEGRAM_TOKEN = '8681595433:AAHUxyHAFs2wqzWMJWBQJd-dBQNqfURtILw';
const CHAT_ID = '-1004305832940';

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

      if (body.fullName && body.attendance) {
        rsvps.unshift(body);

        const attendanceText = body.attendance === 'yes' ? 'Придёт' : body.attendance === 'yes_partner' ? 'Придёт с +1' : 'Не сможет';
        const attendanceEmoji = body.attendance === 'yes' ? '✅' : body.attendance === 'yes_partner' ? '💑' : '❌';
        const message = `💌 *Новый ответ на RSVP*\n\n👤 *Гость:* ${body.fullName}\n${attendanceEmoji} *Статус:* ${attendanceText}\n💬 *Комментарий:* ${body.comment || 'нет'}`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' }),
        });

        return { statusCode: 200, headers, body: JSON.stringify({ ok: true, count: rsvps.length }) };
      }

      if (body.message) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: body.message, parse_mode: 'Markdown' }),
        });
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
      }

      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing message or RSVP data' }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
