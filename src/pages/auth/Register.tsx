import React, { useState } from 'react';
import { MyForm, MyFormInput } from '../../components/Form';
import { MyButton } from '../../components/Button';
import MyPopup from '../../components/Popup';
import { register } from '../../providers/userProvider';
import { Link, useNavigate } from 'react-router';

const Register = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (confirmPassword !== inputs.password) {
      setErrorMessage('Password dan konfirmasi password tidak sama.');
      setShowErrorPopup(true);
      return;
    }
    setShowErrorPopup(false);
    setErrorMessage('');  

    try {
      await register(inputs);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/verfikasi_r');
      }, 1500);
    } catch (e) {
      setErrorMessage('Registration failed. Please try again.');
      setShowErrorPopup(true);
      console.log('Error', e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6ecf2] to-[#6B93A6] font-helvetica">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <h1 className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-extrabold font-lato text-[#6B93A6] opacity-90 select-none pointer-events-none z-0">
          Daftar
        </h1>
        <div className="relative w-full bg-[#6B93A6] rounded-2xl shadow-2xl mt-10 py-5 sm:py-8 px-0 flex flex-col items-center z-10">
        {showSuccessPopup && (
          <MyPopup
            isOpen={showSuccessPopup}
            title='Kode Verifikasi Terkirim!'
            message='Silakan cek email Anda untuk kode verifikasi.'
            variant='success'
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
        {showErrorPopup && (
          <MyPopup
            isOpen={showErrorPopup}
            title='Register Gagal'
            message={errorMessage || 'Terjadi kesalahan.'}
            variant='error'
            onClose={() => setShowErrorPopup(false)}
          />
        )}
        <MyForm title="" className="w-full space-y-3 px-0">
          <MyFormInput
            label=""
            name="email"
            type="email"
            placeholder="masukkan email"
            value={inputs.email}
            className="flex items-center justify-between w-full mr-35 py-4 pr-5 pl-5 bg-white rounded-xl shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setInputs((d) => ({ ...d, email: e.target.value }))}
          />
          <MyFormInput
            label=""
            name="password"
            type="password"
            placeholder="masukkan sandi"
            value={inputs.password}
            className="flex items-center justify-between w-full mr-35 py-4 pr-5 pl-5 bg-white rounded-xl shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setInputs((d) => ({ ...d, password: e.target.value }))}
          />
          <MyFormInput
            label=""
            name="confirmPassword"
            type="password"
            placeholder="konfirmasi sandi"
            value={confirmPassword}
            className="flex items-center justify-between w-full mr-35 py-4 pr-5 pl-5 bg-white rounded-xl shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-between text-white text-xs mb-10">
            <span>
              Sudah Punya Akun?{' '}
              <Link to="/login" className="underline font-semibold">Masuk</Link>
            </span>
          </div>
          <MyButton
            text={'Daftar'}
            className="w-full py-3 rounded-xl bg-yellow-400 text-lg font-semibold text-white shadow-md hover:bg-yellow-500 hover:text-white focus:outline-none transition"
            onClick={handleSignUp}
          />
          <hr className="my-4 border-gray-300" />
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-3 mb-3 bg-white rounded-xl shadow hover:bg-gray-200 transition"
          >
            <span className="flex items-center font-semibold">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 mr-3" />
              Lanjutkan dengan Google
            </span>
            <span className="text-2xl text-gray-400">&rarr;</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-xl shadow hover:bg-gray-200 transition"
          >
            <span className="flex items-center font-semibold">
              <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-6 h-6 mr-3" />
              Lanjutkan dengan Facebook
            </span>
            <span className="-2 text-2xl text-gray-400">&rarr;</span>
          </button>
        </MyForm>
      </div>
    </div>
    </div>
  );
};

export default Register;
