import { useNavigate } from "react-router";
import { MyButton } from "../components/Button";

const UnknownRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Oops! Kamu nyasar
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Sepertinya halaman yang kamu tuju tidak ditemukan.
      </p>
      <MyButton
        text="Kembali ke Beranda"
        variant="accent"
        onClick={() => navigate("/")}
      />
    </div>
  );
};

export default UnknownRoute;
