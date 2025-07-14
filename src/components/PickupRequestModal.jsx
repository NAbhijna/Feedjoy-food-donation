import React, { useState } from "react";

export default function PickupRequestModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) {
  const [reason, setReason] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reason, preferredTime });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-cream p-6 rounded-2xl shadow-lg w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-dark-olive mb-4">
          Request Pickup
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-dark-olive font-semibold mb-2"
            >
              Reason for Pickup
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl"
              rows="4"
              placeholder="Briefly explain why you need this donation."
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              htmlFor="preferredTime"
              className="block text-dark-olive font-semibold mb-2"
            >
              Preferred Pickup Time
            </label>
            <input
              type="text"
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl"
              placeholder="e.g., Today between 4 PM - 6 PM"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-dark-olive rounded-2xl hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-olive-green text-white rounded-2xl hover:bg-dark-olive disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
