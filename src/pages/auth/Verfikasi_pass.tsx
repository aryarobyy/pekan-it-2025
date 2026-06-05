import { useState } from 'react'
import { MyButton } from '../../components/Button'
import { MyForm, MyFormInput } from '../../components/Form'
import MyPopup from '../../components/Popup'
import { Link, useNavigate } from 'react-router';


const Verifikasi_p = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
const [inputs, setInputs] = useState({
    verifikasi: ''
})
  
  const navigate = useNavigate();

  const handleVerifikasi = async () => {
    try {
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/forgot2');
      }, 1500)
    } catch (e) {
      setErrorMessage('Kode verifikasi salah. Silakan masukkan kembali.');
      setShowErrorPopup(true);
      console.log('Error', e);
    }
  }

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
            title='Kode Verifikasi Benar!'
            message='Silakan perbarui sandi!'
            variant='success'
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
        {showErrorPopup && (
          <MyPopup
            isOpen={showErrorPopup}
            title='Kode Verifikasi salah!'
            message={errorMessage || 'Cek kembali!.'}
            variant='error'
            onClose={() => setShowErrorPopup(false)}
          />
        )}

        <MyForm title="" className="w-full space-y-3 px-5">
            <p className="text-white text-sm flex justify-between w-full">Cek Email Anda!</p>
          <MyFormInput
            label=""
            name="verifikasi"
            type="text"
            placeholder="masukkan kode verifikasi"
            value={inputs.verifikasi}
            className="flex items-center justify-between w-full mr-35 py-4 pr-5 pl-5 bg-white rounded-xl shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setInputs((d) => ({ ...d, verifikasi: e.target.value }))}
          />
          <div className="flex justify-end text-white text-xs mb-10">
            <span>
             <span>&larr;</span>
              <Link to="/forgot" className="pl-1">Kembali</Link>
            </span>
          </div>
          <MyButton
            text={'Verifikasi'}
            className="w-full py-3 rounded-xl bg-yellow-400 text-lg font-semibold text-white shadow-md hover:bg-yellow-500 hover:text-white focus:outline-none transition"
            onClick={handleVerifikasi}
          />
        </MyForm>
      </div>
    </div>
    </div>
  );
};

export default Verifikasi_p