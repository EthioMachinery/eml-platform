const updateStatus = async (req: any, status: string) => {

  // 1. Update request status
  await supabase
    .from("machine_requests")
    .update({ status })
    .eq("id", req.id);

  // 2. IF APPROVED → CREATE DEAL
  if (status === "approved") {

    // 🔥 Commission logic (example: 10%)
    const commissionRate = 0.1;

    const machinePrice = req.price || 100000; // fallback

    await supabase.from("deals").insert([
      {
        request_id: req.id,
        machine_id: req.machine_id,
        buyer_id: req.requester_id,
        owner_id: req.owner_id,
        price: machinePrice,
        commission: machinePrice * commissionRate,
        status: "active",
        payment_status: "pending",
      },
    ]);
  }

  fetchRequests();
};