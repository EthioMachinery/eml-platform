import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { TelegramService } from '@/lib/telegram';

const NotifySchema = z.object({
  target_user_id: z.string().uuid(),
  type: z.enum(['INQUIRY', 'REVIEW', 'PAYMENT', 'MATCH']),
  data: z.record(z.string(), z.any()),
});

/**
 * POST /api/auto-notify
 * High-speed industrial notification bridge.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const val = NotifySchema.safeParse(body);
    if (!val.success) return errorResponse("Invalid notification payload", 400);

    const { target_user_id, type, data } = val.data;

    // 1. Fetch user profile to get Telegram ID and Language preference
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('telegram_chat_id, language')
      .eq('id', target_user_id)
      .single();

    if (!profile?.telegram_chat_id) {
      return successResponse({ status: 'SKIPPED', reason: 'USER_NOT_LINKED_TO_TELEGRAM' });
    }

    // 2. Format the message
    const message = TelegramService.formatAlert(
      type, 
      data, 
      (profile.language as 'en' | 'am') || 'en'
    );

    // 3. Dispatch via Telegram Bot API
    const result = await TelegramService.sendMessage(profile.telegram_chat_id, message);

    if (result) {
      return successResponse({ status: 'SENT', message_id: result.message_id });
    } else {
      return errorResponse("Telegram dispatch failed", 500);
    }

  } catch (err) {
    return internalError(err, 'POST /api/auto-notify');
  }
}
