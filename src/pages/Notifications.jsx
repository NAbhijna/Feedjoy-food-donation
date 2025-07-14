import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Moment from "react-moment";

export default function Notifications() {
  const auth = getAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("incoming"); // 'incoming' or 'sent'

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let q;
    if (view === "incoming") {
      // Only query by donorId to match Firestore rules for list
      q = query(
        collection(db, "pickupRequests"),
        where("donorId", "==", currentUser.uid)
      );
    } else {
      // Only query by userId to match Firestore rules for list
      q = query(
        collection(db, "pickupRequests"),
        where("userId", "==", currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requestsData = await Promise.all(
        snapshot.docs.map(async (requestDoc) => {
          const request = requestDoc.data();
          const userDoc =
            view === "incoming"
              ? await getDoc(doc(db, "users", request.userId))
              : null;
          const listingDoc = await getDoc(
            doc(db, "listings", request.listingId)
          );
          return {
            id: requestDoc.id,
            ...request,
            requesterInfo: userDoc ? userDoc.data() : null,
            listingInfo: listingDoc.data(),
          };
        })
      );
      if (view === "incoming") {
        const pendingRequests = requestsData.filter(
          (req) => req.status === "pending"
        );
        setIncomingRequests(pendingRequests);
      } else {
        setSentRequests(requestsData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser, view]);

  const handleResponse = async (requestId, listingId, newStatus) => {
    const requestRef = doc(db, "pickupRequests", requestId);
    try {
      await updateDoc(requestRef, { status: newStatus });
      if (newStatus === "accepted") {
        const listingRef = doc(db, "listings", listingId);
        await updateDoc(listingRef, { status: "taken" });
        toast.success("Request accepted!");
      } else {
        toast.info("Request rejected.");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Could not process the request.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-yellow-400 text-dark-olive";
    }
  };

  if (loading && !incomingRequests.length && !sentRequests.length)
    return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl text-center my-6 font-bold text-dark-olive">
        Notifications
      </h1>

      <div className="flex justify-center border-b-2 border-golden-yellow mb-6">
        <button
          onClick={() => setView("incoming")}
          className={`px-6 py-3 text-lg font-semibold ${
            view === "incoming"
              ? "text-burnt-orange border-b-4 border-burnt-orange"
              : "text-dark-olive"
          }`}
        >
          Incoming Requests
        </button>
        <button
          onClick={() => setView("sent")}
          className={`px-6 py-3 text-lg font-semibold ${
            view === "sent"
              ? "text-burnt-orange border-b-4 border-burnt-orange"
              : "text-dark-olive"
          }`}
        >
          Sent Requests
        </button>
      </div>

      {loading && <Spinner />}

      {view === "incoming" && !loading && (
        <div>
          {incomingRequests.length === 0 ? (
            <p className="text-center text-dark-olive/80">
              You have no pending pickup requests.
            </p>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-white rounded-2xl shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        req.requesterInfo?.avatarUrl || "/default-avatar.png"
                      }
                      alt="requester avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-dark-olive/70">
                        <Moment fromNow>{req.createdAt?.toDate()}</Moment>
                      </p>
                      <p className="text-dark-olive">
                        <span className="font-bold">
                          {req.requesterInfo?.name}
                        </span>{" "}
                        requested to pick up{" "}
                        <span className="font-bold">
                          {req.listingInfo?.name}
                        </span>
                        .
                      </p>
                      <div className="mt-2 p-3 bg-cream rounded-lg">
                        <p className="font-semibold text-dark-olive">Reason:</p>
                        <p className="text-dark-olive/90">{req.reason}</p>
                        <p className="font-semibold text-dark-olive mt-2">
                          Preferred Time:
                        </p>
                        <p className="text-dark-olive/90">
                          {req.preferredTime}
                        </p>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() =>
                            handleResponse(req.id, req.listingId, "accepted")
                          }
                          className="px-4 py-2 bg-olive-green text-white rounded-lg hover:bg-dark-olive"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleResponse(req.id, req.listingId, "rejected")
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "sent" && !loading && (
        <div>
          {sentRequests.length === 0 ? (
            <p className="text-center text-dark-olive/80">
              You have not sent any pickup requests.
            </p>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-white rounded-2xl shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-dark-olive/70">
                        <Moment fromNow>{req.createdAt?.toDate()}</Moment>
                      </p>
                      <p className="text-dark-olive">
                        Your request for{" "}
                        <span className="font-bold">
                          {req.listingInfo?.name || "a deleted listing"}
                        </span>
                        .
                      </p>
                      <div className="mt-2 p-3 bg-cream rounded-lg">
                        <p className="font-semibold text-dark-olive">
                          Your Reason:
                        </p>
                        <p className="text-dark-olive/90">{req.reason}</p>
                        <p className="font-semibold text-dark-olive mt-2">
                          Your Preferred Time:
                        </p>
                        <p className="text-dark-olive/90">
                          {req.preferredTime}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`ml-4 px-3 py-1 text-sm font-bold rounded-full capitalize ${getStatusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

