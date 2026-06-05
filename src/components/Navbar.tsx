import { useState, useEffect, useRef } from "react";
import profileIcon1 from "../assets/icons/profileIcon1.png";
import profileIcon2 from "../assets/icons/profileIcon2.png";
import tugasIcon1 from "../assets/icons/tugasIcon1.png";
import tugasIcon2 from "../assets/icons/tugasIcon2.png";
import { Link, useLocation, useNavigate } from "react-router";
import { LogOut, Menu, X } from "lucide-react";
import type { UserType as User } from "../types/user";
import { cn } from "../utils/cn";
import useGetUser from "../hooks/useGetUser";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const location = useLocation();
  const { logout } = useGetUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsTaskOpen(false);
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 10);
  };

  const handleLogout = () => {
    try {
      logout(false);
      navigate("/", { replace: true });
      window.location.reload();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (e) {
      console.error("Logout gagal:", e);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isTugasFokusActive = isActive("/todo") || isActive("/pomodoro");
  const isProfileActive = isActive("/profile");

  const linkClass = (path: string) =>
    isActive(path)
      ? "text-yellow-400 hover:text-yellow-300 font-semibold"
      : "text-white hover:text-gray-300 font-semibold";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full p-4 z-50 transition-all ${
          scrolled ? "bg-[#2d4a73] shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold z-50">
            <Link to="/" className="hover:text-gray-300">
              <p>Aca Connect</p>
              <p className="text-xs">Academic & connections</p>
            </Link>
          </div>

          <div className="md:hidden z-50">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div
            className={`md:flex flex-grow items-center justify-end ${
              isMenuOpen
                ? "block absolute top-0 left-0 w-full h-screen bg-black bg-opacity-90 flex-col py-20"
                : "hidden"
            } md:relative md:bg-transparent md:h-auto md:py-0`}
          >
            <ul
              className={`flex ${
                isMenuOpen
                  ? "flex-col items-center space-y-8 text-xl"
                  : "flex-row space-x-6"
              } md:flex-row md:space-x-6 md:space-y-0`}
            >
              <li>
                <Link to="/" className={linkClass("/")} onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/friend"
                  className={linkClass("/friend")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Friends
                </Link>
              </li>
              <li>
                <Link to="/grade" className={linkClass("/grade")} onClick={() => setIsMenuOpen(false)}>
                  Peringkat
                </Link>
              </li>
              <li className="relative group cursor-pointer">
                <Link
                  to="#"
                  className={
                    location.pathname.includes("chat")
                      ? "text-yellow-400 hover:text-yellow-300 font-semibold"
                      : "text-white hover:text-gray-300 font-semibold"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chats
                </Link>
                <div className="absolute flex flex-col items-center w-[10rem] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 bg-white overflow-hidden">
                  <Link
                    className={cn(
                      "w-full px-4 p-2 hover:text-secondary hover:bg-primary transition-colors duration-200", location.pathname === "/private-chat" && "bg-primary text-secondary") }
                    to={"/private-chat"}
                  >
                    Private Chat
                  </Link>
                  <Link
                    className={cn(
                      "w-full px-4 p-2 hover:text-secondary hover:bg-primary transition-colors duration-200", location.pathname === "/group-chat" && "bg-primary text-secondary"
                    )}
                    to={"/group-chat"}
                  >
                    Group Chat
                  </Link>
                </div>
              </li>
              <li className="group relative flex flex-row justify-center items-center">
                <button
                  onClick={() => {
                    setIsTaskOpen(!isTaskOpen);
                    setIsProfileOpen(false);
                  }}
                  className={`${
                    isTugasFokusActive ? linkClass("/todo") : linkClass("/yanglaen")
                  } flex items-center focus:outline-none`}
                >
                  Tugas & Fokus
                  <img
                    src={isTugasFokusActive ? tugasIcon2 : tugasIcon1}
                    className="w-4 h-full ml-2 group-hover:opacity-70 transition-opacity duration-200"
                    alt="Tugas & Fokus Icon"
                  />
                </button>

                {isTaskOpen && (
                  <ul
                    ref={menuRef}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 bg-white rounded-3xl shadow-lg z-10"
                  >
                    <li className="px-5 py-2 hover:bg-primary hover:text-yellow-400 cursor-pointer rounded-2xl">
                      <Link
                        to="/todo"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsTaskOpen(false);
                        }}
                      >
                        To-do List
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-primary cursor-pointer rounded-2xl">
                      <Link
                        to="/pomodoro"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsTaskOpen(false);
                        }}
                      >
                        Pomodoro
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            <div className={`relative ${isMenuOpen ? "mt-8" : "md:ml-10"}`}>
              {user ? (
                <div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsTaskOpen(false);
                    }}
                    className={`${
                      isProfileActive ? "text-yellow-400" : "text-white"
                    } group flex flex-col items-center gap-1 focus:outline-none`}
                  >
                    <img
                      src={isProfileActive ? profileIcon2 : profileIcon1}
                      alt="Profile"
                      className="w-6 group-hover:opacity-70"
                    />
                    <p className="text-xs">{user.name}</p>
                  </button>

                  {isProfileOpen && (
                    <ul
                      ref={menuRef}
                      className="absolute right-0 top-full mt-2 w-40 bg-white rounded-3xl shadow-lg z-10 text-gray-800"
                    >
                      <li className="hover:bg-primary cursor-pointer rounded-2xl">
                        <Link
                          to={`/profile/${user.username}`}
                          className="block w-full text-left px-4 py-2 rounded-t-2xl hover:text-yellow-400"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Profil
                        </Link>
                      </li>
                      <li className="hover:bg-primary cursor-pointer rounded-2xl">
                        <button
                          onClick={handleLogout}
                          className="flex gap-2 w-full text-left px-4 py-2 rounded-b-2xl hover:text-yellow-400"
                        >
                          <LogOut />
                          Keluar
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`${
                    isActive("/login") ? "text-yellow-400" : "text-white"
                  } group flex flex-col items-center gap-1`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src={isActive("/login") ? profileIcon2 : profileIcon1}
                    alt="Login"
                    className="w-6 group-hover:opacity-70"
                  />
                  <p className="text-xs">Login</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
