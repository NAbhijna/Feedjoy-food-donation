import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase"; // Import auth from firebase.js
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  writeBatch,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Mark all notifications as read when the component mounts
    const markAllAsRead = async () => {
      const q = query(
        collection(db, "notifications"),
        where("toUserId", "==", currentUser.uid),
        where("read", "==", false)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.forEach((docSnap) => {
          batch.update(docSnap.ref, { read: true });
        });
        await batch.commit();
      }
    };
    markAllAsRead();
  }, [auth.currentUser]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "notifications"),
      where("toUserId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notificationsData = await Promise.all(
        snapshot.docs.map(async (notificationDoc) => {
          const notification = notificationDoc.data();

          const fromUserDoc = notification.fromUserId
            ? await getDoc(doc(db, "users", notification.fromUserId))
            : null;
          const listingDoc = notification.listingId
            ? await getDoc(doc(db, "listings", notification.listingId))
            : null;
          const requestDoc = notification.requestId
            ? await getDoc(doc(db, "pickupRequests", notification.requestId))
            : null;

          return {
            id: notificationDoc.id,
            ...notification,
            fromUserInfo: fromUserDoc?.exists() ? fromUserDoc.data() : null,
            listingInfo: listingDoc?.exists() ? listingDoc.data() : null,
            requestInfo: requestDoc?.exists() ? requestDoc.data() : null,
          };
        })
      );
      setNotifications(notificationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleResponse = async (requestId, listingId, newStatus) => {
    const requestRef = doc(db, "pickupRequests", requestId);
    try {
      await updateDoc(requestRef, { status: newStatus });

     
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.requestId === requestId
            ? { ...noti, requestInfo: { ...noti.requestInfo, status: newStatus } }
            : noti
        )
      );

      if (newStatus === "accepted") {
        const listingRef = doc(db, "listings", listingId);
        await updateDoc(listingRef, { status: "taken" });
        toast.success("Request accepted!");
      } else {
        toast.info("Request rejected.");
      }

      // Fetch the pickup request to get userId for notification
      const requestSnap = await getDoc(requestRef);
      if (requestSnap.exists()) {
        const requestData = requestSnap.data();
        // Create a notification for the requester
        await addDoc(collection(db, "notifications"), {
          toUserId: requestData.userId,
          fromUserId: requestData.donorId,
          requestId,
          listingId,
          type: "pickup-response",
          status: newStatus,
          timestamp: new Date(),
          read: false, // Explicitly set as unread
        });
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

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl text-center my-4 sm:my-6 font-bold text-dark-olive">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-center text-dark-olive/80">
          You have no notifications.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((noti) => (
            <div
              key={noti.id}
              className="p-4 bg-white rounded-2xl shadow-md"
            >
              {noti.type === "pickup-request" && (
                <div className="flex items-start gap-4">
                  <img
                    src={noti.fromUserInfo?.avatarUrl || "/default-avatar.png"}
                    alt="requester avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-dark-olive/70">
                      <Moment fromNow>{noti.timestamp?.toDate()}</Moment>
                    </p>
                    <p className="text-dark-olive">
                      <span className="font-bold">
                        {noti.fromUserInfo?.name}
                      </span>{" "}
                      requested to pick up{" "}
                      <span className="font-bold">
                        {noti.listingInfo?.name}
                      </span>
                      .
                    </p>
                    {noti.requestInfo && (
                      <div className="mt-2 p-3 bg-cream rounded-lg">
                        <p className="font-semibold text-dark-olive">Reason:</p>
                        <p className="text-dark-olive/90">
                          {noti.requestInfo.reason}
                        </p>
                        <p className="font-semibold text-dark-olive mt-2">
                          Preferred Time:
                        </p>
                        <p className="text-dark-olive/90">
                          {noti.requestInfo.preferredTime}
                        </p>
                      </div>
                    )}
                    {noti.requestInfo?.status === "pending" ? (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() =>
                            handleResponse(
                              noti.requestId,
                              noti.listingId,
                              "accepted"
                            )
                          }
                          className="px-4 py-2 bg-olive-green text-white rounded-lg hover:bg-dark-olive"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleResponse(
                              noti.requestId,
                              noti.listingId,
                              "rejected"
                            )
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center justify-between">
                        <p
                          className={`font-bold capitalize ${
                            noti.requestInfo?.status === "accepted"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Request {noti.requestInfo?.status}
                        </p>
                        {noti.requestInfo?.status === "accepted" && (
                          <button
                            onClick={() =>
                              navigate(`/chat/${noti.requestInfo.userId}`)
                            }
                            className="px-4 py-2 bg-golden-yellow text-dark-olive rounded-lg hover:bg-burnt-orange"
                          >
                            Chat with Receiver
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {noti.type === "pickup-response" && (
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        noti.fromUserInfo?.avatarUrl || "/default-avatar.png"
                      }
                      alt="donor avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-dark-olive/70">
                        <Moment fromNow>{noti.timestamp?.toDate()}</Moment>
                      </p>
                      <p className="text-dark-olive">
                        Your request for{" "}
                        <span className="font-bold">
                          {noti.listingInfo?.name || "a listing"}
                        </span>{" "}
                        was{" "}
                        <span className="font-bold">{noti.status}</span> by{" "}
                        <span className="font-bold">
                          {noti.fromUserInfo?.name || "the donor"}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                  <div
                    className={`ml-4 px-3 py-1 text-sm font-bold rounded-full capitalize ${getStatusBadge(
                      noti.status
                    )}`}
                  >
                    {noti.status}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
