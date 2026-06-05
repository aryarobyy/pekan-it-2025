import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <main className="pt-16 pb-16 h-screen w-full flex justify-center items-center bg-primary">
      <div className="flex flex-col text-center justify-center items-center gap-4 text-slate-50">
        <h2 className="text-2xl font-semibold max-w-2/3">
          Ops! Kamu belum dapat mengakses halaman ini untuk saat ini
        </h2>
        <p className="text-xl">
          Silakan masuk dengan akun mu, atau daftarkan akun mu sekarang juga!
        </p>
        <Link
          className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 shadow-md hover:shadow-lg focus:ring-yellow-300 p-2 rounded-lg"
          to={"/register"}
        >
          Daftar Akun
        </Link>
      </div>
    </main>
  );
}
