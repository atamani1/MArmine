let rsvps = [];

const TELEGRAM_TOKEN = '8681595433:AAHUxyHAFs2wqzWMJWBQJd-dBQNqfURtILw';
const CHAT_ID = '-1004305832940';

async function sendTelegram(message) {
  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    }
  );
  return res.json();
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
      const rsvp = JSON.parse(event.body || '{}');
      if (!rsvp.fullName || !rsvp.attendance) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'fullName and attendance required' }) };
      }

      rsvps.unshift(rsvp);

      const attendanceText = rsvp.attendance === 'yes' ? 'Придёт' : rsvp.attendance === 'yes_partner' ? 'Придёт с +1' : 'Не сможет';
      const attendanceEmoji = rsvp.attendance === 'yes' ? '✅' : rsvp.attendance === 'yes_partner' ? '💑' : '❌';
      const message = `💌 *Новый ответ на RSVP*\n\n👤 *Гость:* ${rsvp.fullName}\n${attendanceEmoji} *Статус:* ${attendanceText}\n💬 *Комментарий:* ${rsvp.comment || 'нет'}`;

      const tgResult = await sendTelegram(message);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, count: rsvps.length, telegram: tgResult.ok }),
      };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  if (event.httpMethod === 'DELETE') {
    rsvps = [];
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
