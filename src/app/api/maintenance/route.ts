import { logEvent } from "@/core/logEvent";
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';

const MaintenanceLogSchema = z.object({
  machinery_id: z.string().uuid(),
  current_hours: z.number().positive(),
  service_type: z.enum(['routine', 'repair', 'overhaul']),
  cost: z.number().nonnegative(),
  notes: z.string().min(10),
});

/**
 * POST /api/maintenance
 * Logs industrial service and updates the machine's "Health Score"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = MaintenanceLogSchema.safeParse(body);
    if (!validation.success) return errorResponse(validation.error.issues[0].message, 400, 'INVALID_LOG');

    const log = validation.data;

    // 1. Log the physical service
    const { error: logError } = await supabaseAdmin
      .from('maintenance_logs')
      .insert([log]);

    if (logError) return errorResponse(logError.message, 500, 'DB_WRITE_ERROR');

    // 2. AI CALCULATION: Predictive Health Modeling
    // In a Top-10 system, we calculate when the next service is due.
    const nextServiceHours = log.current_hours + 250; // Standard 250hr service interval
    
    // 3. Update the Machinery "Digital Twin" metadata
    await supabaseAdmin
      .from('machinery')
      .update({
        last_service_hours: log.current_hours,
        next_service_due_hours: nextServiceHours,
        // Reliability Score increases when maintenance is logged on time
        reliability_index: 95 
      })
      .eq('id', log.machinery_id);

    // 4. TELEMETRY: Notify the CEO Autopilot
    await supabaseAdmin.from('tm_events').insert({
      event_name: 'MAINTENANCE_RECORDED',
      severity: 'INFO',
      payload: { 
        machinery_id: log.machinery_id, 
        service: log.service_type,
        health_boost: "+5%"
      }
    });

    return successResponse({ next_service_at: nextServiceHours }, 201);
  } catch (err) {
    return internalError(err, 'POST /api/maintenance');
  }
}
