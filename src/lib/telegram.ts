import { superAdmin } from "./adminConfig";

export async function sendTelegramAlert(
  message: string
) {
  try {
    const token =
      process.env.TELEGRAM_BOT_TOKEN;

    const chatId =
      process.env.TELEGRAM_CHAT_ID;

    const finalMessage =
`🚨 EML SUPER ADMIN ALERT

${message}

Owner:
${superAdmin.phone}
${superAdmin.email}`;

    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: finalMessage,
        }),
      }
    );
  } catch (error) {
    console.error(error);
  }
}