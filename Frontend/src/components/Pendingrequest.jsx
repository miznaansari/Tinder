import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaBan } from 'react-icons/fa';

const PendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [actionLoading, setActionLoading] = useState({});

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        setToast({ message: 'Please log in to view pending requests.', type: 'error' });
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/friend-requests/${currentUser._id}`);
        const filteredRequests = response.data.data.filter(
          (request) => request.sender?._id !== currentUser._id && request.status !== 1,
        );
        setRequests(filteredRequests);
      } catch (error) {
        setToast({ message: 'Failed to load friend requests. Please refresh.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser?._id]);

  useEffect(() => {
    if (!toast.message) {
      return;
    }

    const timer = setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleAction = async (request, action) => {
    const requestId = request._id;

    setActionLoading((prev) => ({ ...prev, [requestId]: action }));

    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/friend-requests/${action}`, {
        id: request._id,
        receiverId: request.receiver._id,
        senderId: request.sender._id,
      });

      setRequests((prev) => prev.filter((item) => item._id !== requestId));
      setToast({ message: `Request ${action}ed successfully.`, type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Error processing request.', type: 'error' });
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    }
  };

  const toastClass =
    toast.type === 'error'
      ? 'bg-error text-error-content'
      : 'bg-success text-success-content';

  return (
    <section className="relative">
      {toast.message && (
        <div className={`fixed right-4 top-20 z-[60] rounded-xl px-4 py-3 text-sm font-semibold shadow-xl ${toastClass}`}>
          {toast.message}
        </div>
      )}

      <div className="rounded-2xl border border-base-300/70 bg-base-100 shadow-lg">
        <div className="flex items-center justify-between border-b border-base-300/60 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Pending Friend Requests</h2>
            <p className="text-xs uppercase tracking-wider text-base-content/55">Manage who joins your circle</p>
          </div>
          <span className="badge badge-primary badge-outline">{requests.length}</span>
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-base-300/60 p-4">
                <div className="skeleton mb-3 h-4 w-28" />
                <div className="skeleton h-12 w-full" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-base font-semibold">No pending requests</p>
            <p className="mt-1 text-sm text-base-content/60">You are all caught up for now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-base-300/60">
            {requests.map((request, index) => {
              const isActionPending = Boolean(actionLoading[request._id]);
              const senderImage = request.sender?.profilePicture || request.sender?.profileImage;
              const imageUrl = senderImage
                ? `${import.meta.env.VITE_URL}${senderImage}`
                : 'https://img.daisyui.com/images/profile/demo/1@94.webp';

              return (
                <li key={request._id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-7 text-center text-lg font-thin tabular-nums text-base-content/35">{index + 1}</div>
                    <img className="h-12 w-12 rounded-xl object-cover" src={imageUrl} alt={request.sender?.name || 'User'} />
                    <div>
                      <p className="font-semibold text-base-content">{request.sender?.name || 'Unknown User'}</p>
                      <p className="text-xs uppercase tracking-wide text-base-content/55">Sent you a friend request</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:w-auto">
                    <button
                      onClick={() => handleAction(request, 'accept')}
                      className="btn btn-success btn-sm"
                      disabled={isActionPending}
                    >
                      {isActionPending && actionLoading[request._id] === 'accept' ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <FaCheck className="size-4" />
                      )}
                      <span className="hidden md:inline">Accept</span>
                    </button>

                    <button
                      onClick={() => handleAction(request, 'ignore')}
                      className="btn btn-warning btn-sm"
                      disabled={isActionPending}
                    >
                      {isActionPending && actionLoading[request._id] === 'ignore' ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <FaBan className="size-4" />
                      )}
                      <span className="hidden md:inline">Ignore</span>
                    </button>

                    <button
                      onClick={() => handleAction(request, 'reject')}
                      className="btn btn-error btn-sm"
                      disabled={isActionPending}
                    >
                      {isActionPending && actionLoading[request._id] === 'reject' ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <FaTimes className="size-4" />
                      )}
                      <span className="hidden md:inline">Reject</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default PendingRequest;