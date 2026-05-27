export const AutoPilot = {
  async start() {
    console.log("EML AutoPilot started");

    return {
      success: true,
      message: "AutoPilot started successfully",
    };
  },

  async stop() {
    console.log("EML AutoPilot stopped");

    return {
      success: true,
      message: "AutoPilot stopped successfully",
    };
  },
};