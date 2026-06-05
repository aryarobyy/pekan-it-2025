import { useState } from "react";
import Cookies from "js-cookie";

import { MyButton } from "../../components/Button";
import { MyForm, MyFormInput } from "../../components/Form";
import MyPopup from "../../components/Popup";
import { login } from "../../providers/userProvider";
import useGetUser from "../../hooks/useGetUser";
import { Link, useNavigate } from "react-router";
import { TOKEN } from "../../core/appData";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { refetch } = useGetUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(inputs);

      setShowErrorPopup(false);
      setErrorMessage("");
      setShowSuccessPopup(true);

      Cookies.set(TOKEN, data.token, {
        expires: 7,
        secure: true,
      });

      refetch();

      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/", { replace: true });
        window.location.reload();
      }, 1500);

      setInputs({
        email: "",
        password: "",
      });
    } catch (e) {
      setShowSuccessPopup(false);
      setErrorMessage("Login gagal. Silakan coba lagi.");
      setShowErrorPopup(true);
      console.error("Login Error:", e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6ecf2] to-[#6B93A6] font-helvetica">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <h1 className="absolute top-14 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-extrabold font-lato text-[#6B93A6] opacity-90 select-none pointer-events-none z-0">
          Masuk
        </h1>

        <div className="relative w-full bg-[#6B93A6] rounded-2xl shadow-2xl mt-20 py-8 px-6 flex flex-col items-center z-10">
          {showSuccessPopup && (
            <MyPopup
              isOpen={showSuccessPopup}
              title="Berhasil Masuk"
              message="Selamat datang kembali!"
              variant="success"
              onClose={() => setShowSuccessPopup(false)}
            />
          )}

          {showErrorPopup && (
            <MyPopup
              isOpen={showErrorPopup}
              title="Gagal Masuk"
              message={errorMessage || "Terjadi kesalahan."}
              variant="error"
              onClose={() => setShowErrorPopup(false)}
            />
          )}

          <MyForm title="" className="w-full space-y-4">
            <MyFormInput
              name="email"
              type="email"
              label="Email"
              placeholder=" "
              value={inputs.email}
              onChange={(e) => setInputs((prev) => ({ ...prev, email: e.target.value }))}
              required
            />

            <MyFormInput
              name="password"
              type="password"
              label="Kata Sandi"
              placeholder="Masukkan sandi"
              variant="secondary"
              value={inputs.password}
              onChange={(e) => setInputs((prev) => ({ ...prev, password: e.target.value }))}
            />


            <div className="flex justify-between text-white text-xs mb-6">
              <span>
                Belum punya akun?{" "}
                <Link to="/register" className="underline font-semibold">
                  Daftar
                </Link>
              </span>
              <Link to="/forgot" className="underline font-semibold">
                Lupa sandi?
              </Link>
            </div>

            <MyButton
              text="Masuk"
              className="w-full py-3 rounded-xl bg-yellow-400 text-lg font-semibold text-white shadow-md hover:bg-yellow-500 transition"
              onClick={handleLogin}
            />

            <hr className="my-4 border-gray-300" />

            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 mb-3 bg-white rounded-xl shadow hover:bg-gray-200 transition"
            >
              <span className="flex items-center font-semibold">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6 mr-3"
                />
                Lanjutkan dengan Google
              </span>
              <span className="text-2xl text-gray-400">&rarr;</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-xl shadow hover:bg-gray-200 transition"
            >
              <span className="flex items-center font-semibold">
                <img
                  src="https://www.svgrepo.com/show/448224/facebook.svg"
                  alt="Facebook"
                  className="w-6 h-6 mr-3"
                />
                Lanjutkan dengan Facebook
              </span>
              <span className="text-2xl text-gray-400">&rarr;</span>
            </button>
          </MyForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
