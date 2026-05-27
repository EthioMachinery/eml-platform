"use client";

import { useEffect, useState } from "react";

type AlertType =
  | "rental"
  | "lead"
  | "tender"
  | "message"
  | "promo";

export default function PushNotificationEngine() {
  const [enabled, setEnabled] =
    useState(false);

  const [lastSent, setLastSent] =
    useState("");

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "eml_push_enabled"
      );

    if (saved === "true") {
      setEnabled(true);
    }
  }, []);

  async function enablePush() {
    setEnabled(true);

    localStorage.setItem(
      "eml_push_enabled",
      "true"
    );

    setLastSent("Enabled");
  }

  function sendMock(
    type: AlertType
  ) {
    const map = {
      rental:
        "🚜 New rental request near Addis Ababa",
      lead:
        "💰 New paid lead unlocked",
      tender:
        "📄 New tender opportunity posted",
      message:
        "💬 You received a new message",
      promo:
        "🎯 Special offer this week",
    };

    if (
      "Notification" in window &&
      Notification.permission ===
        "granted"
    ) {
      new Notification(
        "EML Alert",
        {
          body: map[type],
        }
      );
    }

    setLastSent(map[type]);
  }

  async function askPermission() {
    if (
      "Notification" in window
    ) {
      const permission =
        await Notification.requestPermission();

      if (
        permission ===
        "granted"
      ) {
        enablePush();
      }
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white">
      <h2 className="text-2xl font-black mb-4">
        Push Notification Growth Engine 2.0
      </h2>

      <p className="text-zinc-400 mb-6">
        Rental alerts, lead alerts,
        tender alerts, messages,
        promotions.
      </p>

      {!enabled ? (
        <button
          onClick={
            askPermission
          }
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl font-bold"
        >
          Enable Notifications
        </button>
      ) : (
        <div className="space-y-3">

          <div className="text-green-400 font-bold">
            Notifications Enabled
          </div>

          <div className="grid md:grid-cols-2 gap-3">

            <button
              onClick={() =>
                sendMock(
                  "rental"
                )
              }
              className="bg-blue-600 py-3 rounded-2xl font-bold"
            >
              Send Rental Alert
            </button>

            <button
              onClick={() =>
                sendMock(
                  "lead"
                )
              }
              className="bg-yellow-600 py-3 rounded-2xl font-bold"
            >
              Send Lead Alert
            </button>

            <button
              onClick={() =>
                sendMock(
                  "tender"
                )
              }
              className="bg-purple-600 py-3 rounded-2xl font-bold"
            >
              Send Tender Alert
            </button>

            <button
              onClick={() =>
                sendMock(
                  "message"
                )
              }
              className="bg-cyan-600 py-3 rounded-2xl font-bold"
            >
              Send Message Alert
            </button>

            <button
              onClick={() =>
                sendMock(
                  "promo"
                )
              }
              className="bg-pink-600 py-3 rounded-2xl font-bold md:col-span-2"
            >
              Send Promo Alert
            </button>

          </div>

          {lastSent && (
            <p className="text-zinc-400 text-sm mt-3">
              Last Alert: {lastSent}
            </p>
          )}

        </div>
      )}
    </div>
  );
}