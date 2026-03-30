import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';

const TinderPage = ({ userId, user, socket, onLogout, notification }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    }
  }, [navigate]);

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);
  const [sendingLoader, setSendingLoader] = useState(false);
  const [requestActionLoading, setRequestActionLoading] = useState(false);

  const animationTimeoutRef = useRef(null);

  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchData = async () => {
      if (!localUser?._id) {
        setLoading(false);
        setPageError('Please log in to continue.');
        return;
      }

      setLoading(true);

      try {
        const [usersRes, requestsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL}/api/users`),
          axios.get(`${import.meta.env.VITE_URL}/api/friend-requests/${localUser._id}`),
        ]);

        const filteredUsers = usersRes.data.filter((item) => item._id !== localUser._id);
        setUsers(filteredUsers);
        setFriendRequests(requestsRes.data.data || []);
      } catch (error) {
        setPageError(error.response?.data?.error || 'Unable to load users right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localUser?._id]);

  useEffect(() => {
    if (!toast.message) {
      return;
    }

    const timer = setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const moveToNextCard = () => {
    setExitDirection(null);

    const nextIndex = currentIndex + 1;
    if (nextIndex < users.length) {
      setCurrentIndex(nextIndex);
      return;
    }

    setCurrentIndex(users.length);
    showToast('No more users available right now.', 'info');
  };

  const sendFriendRequest = async () => {
    if (!users[currentIndex]) {
      return;
    }

    setSendingLoader(true);

    try {
      if (!localUser?._id) {
        throw new Error('User not found');
      }

      const senderId = localUser._id;
      const receiverId = users[currentIndex]._id;

      await axios.post(`${import.meta.env.VITE_URL}/api/friend-requests/send`, { senderId, receiverId });

      setFriendRequests((prev) => [
        ...prev,
        {
          _id: `${Date.now()}`,
          sender: { _id: senderId },
          receiver: { _id: receiverId },
          status: 0,
        },
      ]);

      showToast(`Friend request sent to ${users[currentIndex].name}`);
      return true;
    } catch (error) {
      showToast(error?.response?.data?.error || 'Error sending friend request', 'error');
      return false;
    } finally {
      setSendingLoader(false);
    }
  };

  const handleRequestAction = async (request, action) => {
    if (!request?._id || requestActionLoading) {
      return;
    }

    setRequestActionLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/friend-requests/${action}`, {
        id: request._id,
        receiverId: request.receiver._id,
        senderId: request.sender._id,
      });

      setFriendRequests((prev) => prev.filter((item) => item._id !== request._id));
      showToast(`Request ${action}ed successfully`);
      return true;
    } catch (error) {
      showToast(error.message || 'Error processing request', 'error');
      return false;
    } finally {
      setRequestActionLoading(false);
    }
  };

  const handleSwipeDecision = async (direction) => {
    if (isCardAnimating || !profileCandidate) {
      return;
    }

    if (direction !== 'left' && direction !== 'right') {
      return;
    }

    setIsCardAnimating(true);

    try {
      let shouldAdvance = true;

      if (direction === 'right') {
        if (incomingRequest) {
          shouldAdvance = await handleRequestAction(incomingRequest, 'accept');
        } else if (outgoingRequest) {
          showToast('Request already sent.', 'info');
        } else {
          shouldAdvance = await sendFriendRequest();
        }
      }

      if (direction === 'left' && incomingRequest) {
        shouldAdvance = await handleRequestAction(incomingRequest, 'reject');
      }

      if (!shouldAdvance) {
        setIsCardAnimating(false);
        return;
      }

      setExitDirection(direction);

      animationTimeoutRef.current = setTimeout(() => {
        moveToNextCard();
        setIsCardAnimating(false);
      }, 230);
    } catch {
      setIsCardAnimating(false);
    }
  };

  const triggerSwipe = async (direction) => {
    if (isCardAnimating || sendingLoader || requestActionLoading) {
      return;
    }

    await handleSwipeDecision(direction);
  };

  const profileCandidate = users[currentIndex];

  const incomingRequest = profileCandidate
    ? friendRequests.find(
        (req) =>
          req.sender?._id === profileCandidate?._id &&
          req.receiver?._id === localUser?._id &&
          req.status !== 1,
      )
    : null;

  const outgoingRequest = profileCandidate
    ? friendRequests.find(
        (req) =>
          req.sender?._id === localUser?._id &&
          req.receiver?._id === profileCandidate?._id &&
          req.status !== 1,
      )
    : null;

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      handleSwipeDecision('right');
    },
    onSwipedLeft: () => {
      handleSwipeDecision('left');
    },
    delta: 60,
    trackMouse: false,
    preventScrollOnSwipe: false,
  });

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[70dvh] place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="mx-auto mt-8 max-w-lg rounded-xl border border-error/30 bg-error/10 p-5 text-error">
        {pageError}
      </div>
    );
  }

  if (!profileCandidate) {
    return (
      <div className="grid min-h-[70dvh] place-items-center bg-base-200 px-4">
        <div className="rounded-2xl border border-base-300/70 bg-base-100 p-8 text-center shadow-lg">
          <h2 className="text-2xl font-extrabold">You are all caught up</h2>
          <p className="mt-2 text-base-content/65">No more profiles to swipe right now.</p>
        </div>
      </div>
    );
  }

  const progress = users.length > 0 ? Math.min(((currentIndex + 1) / users.length) * 100, 100) : 0;

  return (
    <section className="relative min-h-[85dvh] overflow-hidden bg-base-200 px-4 pb-10 pt-8">
      <div className="pointer-events-none absolute -left-14 top-14 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-14 bottom-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      {toast.message && (
        <div
          className={`fixed right-4 top-20 z-50 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === 'error' ? 'bg-error' : toast.type === 'info' ? 'bg-info' : 'bg-success'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 rounded-xl border border-base-300/70 bg-base-100 px-4 py-3 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-base-content/50">Discover</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-base-content">Welcome, {localUser?.name || 'Friend'}</h1>

          <div className="mt-3 h-2 rounded-full bg-base-300/50">
            <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-base-content/60">
            Profile {Math.min(currentIndex + 1, users.length)} of {users.length}
          </p>
        </div>

        <div
          key={profileCandidate._id}
          {...swipeHandlers}
          className={`relative h-[30rem] w-full overflow-hidden rounded-3xl border border-base-300/70 bg-base-100 shadow-2xl transition-all duration-200 ease-out ${
            exitDirection === 'right'
              ? 'translate-x-[120%] rotate-12 opacity-0'
              : exitDirection === 'left'
                ? '-translate-x-[120%] -rotate-12 opacity-0'
                : 'translate-x-0 rotate-0 opacity-100'
          }`}
        >
            <img
              src={
                profileCandidate?.profilePicture
                  ? `${import.meta.env.VITE_URL}${profileCandidate.profilePicture}`
                  : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
              }
              alt={profileCandidate?.name || 'Default Avatar'}
              className="h-[68%] w-full object-cover"
            />

            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent p-4 text-white">
              <p className="text-xs uppercase tracking-wider text-white/80">Suggested Match</p>
              <p className="text-lg font-bold">{profileCandidate?.name}</p>
            </div>

            <div className="flex h-[32%] flex-col justify-between p-5">
              <div>
                <h2 className="text-2xl font-extrabold text-base-content">{profileCandidate?.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-base-content/70">
                  {profileCandidate?.bio || 'No bio available yet.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge badge-outline">Active</span>
                <span className="badge badge-outline">Discover</span>
              </div>
            </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {incomingRequest ? (
            <>
              <button
                onClick={() => triggerSwipe('right')}
                className="btn btn-success rounded-full px-6"
                disabled={requestActionLoading || isCardAnimating}
              >
                {requestActionLoading ? <span className="loading loading-spinner loading-xs" /> : 'Accept'}
              </button>
              <button
                onClick={() => triggerSwipe('left')}
                className="btn btn-error rounded-full px-6"
                disabled={requestActionLoading || isCardAnimating}
              >
                Reject
              </button>
            </>
          ) : outgoingRequest ? (
            <button className="btn rounded-full border border-base-300/70 bg-base-100 px-6" disabled>
              Request Sent
            </button>
          ) : (
            <button onClick={() => triggerSwipe('right')} className="btn btn-success rounded-full px-7" disabled={sendingLoader || isCardAnimating}>
              {sendingLoader ? <span className="loading loading-spinner loading-xs" /> : 'Send Request'}
            </button>
          )}

          <button onClick={() => triggerSwipe('left')} className="btn btn-error rounded-full px-7" disabled={sendingLoader || requestActionLoading || isCardAnimating}>
            Skip
          </button>
        </div>
      </div>
    </section>
  );
};

export default TinderPage;
