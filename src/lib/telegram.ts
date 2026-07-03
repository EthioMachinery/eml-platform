/**
 * TM TELEGRAM COMMUNICATION PROTOCOL — V2.0
 * Handles bilingual industrial notifications for the Global Ecosystem.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export const TelegramService = {
  /**
   * Sends a formatted message to a specific user.
   */
  async sendMessage(chatId: string, text: string) {
    if (!BOT_TOKEN) {
      console.warn("[TelegramService] Token missing. Skipping notification.");
      return null;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      if (!data.ok) throw new Error(data.description);
      return data;
    } catch (error) {
      console.error("[TelegramService] Send Error:", error);
      return null;
    }
  },

  /**
   * Helper to format industrial alerts.
   */
  formatAlert(type: 'INQUIRY' | 'REVIEW' | 'PAYMENT' | 'MATCH', data: any, lang: 'en' | 'am') {
    if (lang === 'am') {
      switch (type) {
        case 'INQUIRY':
          return `🔔 <b>አዲስ የጥያቄ መልዕክት!</b>\n\nገዢ: ${data.buyer}\nማሽን: ${data.machine}\nዓላማ: ${data.purpose}\n\nእባክዎ በዳሽቦርድዎ በኩል መልስ ይስጡ።`;
        case 'REVIEW':
          return `⭐️ <b>አዲስ ደረጃ ተሰጥቶዎታል!</b>\n\nደረጃ: ${data.rating}/5\nከ: ${data.buyer}\n\n<i>"${data.comment}"</i>`;
        case 'PAYMENT':
          return `💰 <b>ክፍያ ተረጋግጧል!</b>\n\nየመለያ ቁጥር: ${data.ref}\nመጠን: ${data.amount} ETB\n\nገንዘቡ በTM ኤስክሮው ተይዟል።`;
        case 'MATCH':
          return `🚀 <b>AI ማሽን አግኝቷል!</b>\n\nለጥያቄዎ የሚስማማ ማሽን በገበያው ላይ ተገኝቷል። አሁኑኑ ይመልከቱ።`;
        default:
          return `🔔 አዲስ የTM ማሳወቂያ አለዎት።`;
      }
    }

    // Default English
    switch (type) {
      case 'INQUIRY':
        return `🔔 <b>New Inquiry Received!</b>\n\nBuyer: ${data.buyer}\nMachine: ${data.machine}\nType: ${data.purpose}\n\nPlease respond via your TM Dashboard.`;
      case 'REVIEW':
        return `⭐️ <b>New Verified Review!</b>\n\nRating: ${data.rating}/5\nFrom: ${data.buyer}\n\n<i>"${data.comment}"</i>`;
      case 'PAYMENT':
        return `💰 <b>Payment Verified!</b>\n\nRef: ${data.ref}\nAmount: ${data.amount} ETB\n\nFunds are secured in TM Escrow.`;
      case 'MATCH':
        return `🚀 <b>AI Smart Match Found!</b>\n\nA machine matching your project requirements has just been listed.`;
      default:
        return `🔔 You have a new TM system notification.`;
    }
  }
};