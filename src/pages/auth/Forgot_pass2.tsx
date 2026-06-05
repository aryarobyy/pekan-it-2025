import React, { useState } from 'react';
import { MyForm, MyFormInput } from '../../components/Form';
import { MyButton } from '../../components/Button';
import MyPopup from '../../components/Popup';
import { useNavigate } from 'react-router';

const ForgotPass2 = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputs, setInputs] = useState({
    password: ''
  })

  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleUpdatePass = async () => {
    if (confirmPassword !== inputs.password) {
      setErrorMessage('Password dan konfirmasi password tidak sama.');
      setShowErrorPopup(true);
      return;
    }

    try {
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/login');
      }, 1500);
    } catch (e) {
      setErrorMessage('Perbarui Sandi gagal. Silakan coba lagi.');
      setShowErrorPopup(true);
      console.log('Error', e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6ecf2] to-[#6B93A6] font-helvetica">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <h1 className="absolute top-15 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-extrabold font-lato text-[#6B93A6] opacity-90 select-none pointer-events-none z-0">
          Lupa<span>Sandi</span>
        </h1>
        <div className="relative w-full bg-[#6B93A6] rounded-2xl shadow-2xl mt-20 py-5 sm:py-8 px-0 flex flex-col items-center z-10">
        {showSuccessPopup && (
          <MyPopup
            isOpen={showSuccessPopup}
            title='Sandi telah diperbarui!'
            message='Silakan masuk kembali.'
            variant='success'
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
        {showErrorPopup && (
          <MyPopup
            isOpen={showErrorPopup}
            title='Perbarui sandi Gagal'
            message={errorMessage || 'Terjadi kesalahan.'}
            variant='error'
            onClose={() => setShowErrorPopup(false)}
          />
        )}
        <MyForm title="" className="w-full space-y-3 px-0">
          <MyFormInput
            label=""
            name="password"
            type="password"
            placeholder="masukkan sandi baru"
            value={inputs.password}
            className="flex items-center justify-between w-full mr-35 py-4 pr-5 pl-5 bg-white rounded-xl shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setInputs((d) => ({ ...d, password: e.target.value }))}
          />
          <MyFormInput
            label=""
            name="confirmPassword"
            type="password"
            placeholder="konfirmasi sandi baru"
            value={confirmPassword}
            className="flex items-center justify-between w-full mr-35 py-4 pr-5 pl-5 bg-white rounded-xl shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400 mb-10"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <MyButton
            text={'Selanjutnya'}
            className="w-full py-3 rounded-xl bg-yellow-400 text-lg font-semibold text-white shadow-md hover:bg-yellow-500 hover:text-white focus:outline-none transition"
            onClick={handleUpdatePass}
          />
        </MyForm>
      </div>
    </div>
    </div>
  );
};

export default ForgotPass2;
