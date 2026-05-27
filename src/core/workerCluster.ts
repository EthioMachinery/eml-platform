import { EventBus } from "@/core/eventBus";

/**
 * =========================
 * WORKER CLUSTER
 * Background task runner
 * =========================
 */

export const WorkerCluster = {
  workers: 4,

  status() {
    return {
      active: true,
      workers:
        this.workers,
      timestamp:
        Date.now(),
    };
  },

  async dispatch(
    type: string,
    payload: any
  ) {
    await EventBus.emit(
      type,
      payload
    );

    return {
      queued: true,
      type,
    };
  },

  async runJob(
    jobName: string,
    payload?: any
  ) {
    return this.dispatch(
      jobName,
      payload
    );
  },
};