import { Route, Routes, useLocation } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import Auth from "./pages/auth/Auth";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FindFriend from "./pages/findFriend/FindFriend";
import Grade from "./pages/grade/Grade";
import TodoList from "./pages/todo/TodoList";
import AddTodo from "./pages/todo/AddTodo";
import useGetUser from "./hooks/useGetUser";
import { Skeleton } from "./components/ui/skeleton";
import { useCookieConsent } from "./hooks/useCookieConsent";
import { useEffect, useState } from "react";
import PomoConsentBanner from "./components/consent/PomoConsentBanner";
import UnknownRoute from "./pages/UnknownRoute";
import GroupChatPage from "./pages/chat/GroupChatPage";
import PrivateChatPage from "./pages/chat/PrivateChatPage";
import PomodoroPage from "./pages/pomodoro/Pomodoro";
import Login from "./pages/auth/Login";
import Map from "./pages/map/Map";
import { POMODORO_COOKIE_CONSENT } from "./core/appData";

function App() {
 const location = useLocation();
  const pathCheck =
    location.pathname.startsWith("/profile") || location.pathname === "/friend";
  const { user, loading, error } = useGetUser();
  const { showCookieConsent, cookieConsentGiven, handleCookieConsent } = useCookieConsent(POMODORO_COOKIE_CONSENT);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (!loading) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsAppReady(true);
      }
    };

    initializeApp();
  }, [loading]);

  if (!isAppReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-tertiary">
        <div className="text-center space-y-4">
          <div className="mt-6">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <PomoConsentBanner
          showCookieConsent={showCookieConsent}
          handleCookieConsent={handleCookieConsent}
          cookieConsentGiven={cookieConsentGiven}
        />
        {/* {error}  //soon (Blm dipikirin)*/}
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <Skeleton className="w-[20rem] h-[4rem]" />
          </div>
        ) : (
          <div
            className={`${
              pathCheck
                ? "bg-[linear-gradient(to_bottom,_theme(colors.primary)_0%,_theme(colors.tertiary)_50%,_theme(colors.tertiary)_70%,_theme(colors.primary)_100%)]"
                : "bg-tertiary"
            } min-h-screen flex flex-col`}
          >
            <Navbar user={user} />
            <main className="flex-grow">
              <Routes>
                <Route index element={<Dashboard />} />

                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/profile/:username"
                  element={<Profile currentUser={user} />}
                />

                <Route path="/todo" element={<TodoList user={user} />} />
                <Route path="/todo/post" element={<AddTodo user={user} />} />
                <Route path="/pomodoro" element={<PomodoroPage user={user} />} />

                <Route path="/friend" element={<FindFriend user={user} />} />
                <Route path="/grade" element={<Grade />} />
                <Route path="/private-chat" element={<PrivateChatPage />} />
                <Route path="/group-chat" element={<GroupChatPage />} />
                <Route path="*" element={<UnknownRoute />} />

                {user && <Route path="/map" element={<Map userId={user.id} />} />}
              </Routes>
            </main>
              <Footer />
            </div>
        )}
      </div>
    </>
  );
}

export default App;
