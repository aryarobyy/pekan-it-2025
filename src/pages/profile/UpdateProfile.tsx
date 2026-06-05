import { MyButton } from "../../components/Button";
import profilePic from "../../assets/images/profile.png";
import { MyForm, MyFormInput } from "../../components/Form";
import { useRef, useState } from "react";
import { Pencil, X } from "lucide-react";
import { updateUser } from "../../providers/userProvider";
import Cookies from "js-cookie";
import type { UpdateUserType, UserType } from "../../types/user";
import useGetUser from "../../hooks/useGetUser";
import usePreviewImg from "../../hooks/usePreviewImg";
import { TOKEN } from "@/core/appData";

type UpdateProfileProps = {
    user: UpdateUserType
    onClose: () => void
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ onClose, user }) => {
    const [inputs, setInputs] = useState({
        username: user.username,
        name: user.name,
        email: user.email,
    })
    const { refetch } = useGetUser();
    const [isUpdating, setIsUpdating] = useState(false);
    const imgRef = useRef<HTMLInputElement>(null);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()

    const handleUpdate = async () => {
    try {
        setIsUpdating(true);
        
        const data: UpdateUserType = {
            ...inputs,
            avatar: user.avatar,
            role: user.role,
            newAvatar: imgRef.current?.files?.[0] ?? undefined,
        };
        console.log("Data to send:", data);
        console.log("Data keys:", Object.keys(data));
        console.log("Data values:", Object.values(data));

        const updated = await updateUser(user.id!, data);
        console.log(TOKEN, updated.token)
        onClose()      
        Cookies.remove(TOKEN);
        Cookies.set(TOKEN, updated.token, {
            expires: 7,
            secure: true,
        });

        refetch()
        } catch (e) {
            console.error("Full error:", e);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 backdrop-blur-md bg-tertiary/30">
            <div className="flex flex-col bg-center items-center justify-center w-full max-w-6xl h-auto bg-tertiary rounded-4xl p-6 sm:p-8 md:p-10 lg:p-12 relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 hover:text-white" />
                </button>
                
                <div className="flex flex-col lg:flex-row items-start justify-center w-full gap-6 sm:gap-8 md:gap-10 lg:gap-16">
                    
                {/* Profile Image Section */}
                <div className="relative group inline-block">
                    <img
                        src={imgUrl || profilePic}
                        alt="Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full object-cover shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-xl"
                    />
                    <div className="absolute bottom-2 right-2">
                        <button
                            className="bg-primary p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 ease-in-out"
                            onClick={() => {
                                if (imgRef.current) {
                                    imgRef.current.click();
                                }
                            }}
                        >
                            <Pencil className="w-6 h-6 text-white" />
                        </button>
                        <input
                            type="file"
                            className="hidden"
                            ref={imgRef}
                            onChange={(e) => handleImageChange(e)}
                        />   
                    </div>
                </div>

                    {/* Form Section */}
                    <div className="flex-1 w-full lg:max-w-lg xl:max-w-xl">
                        <MyForm className="space-y-4 sm:space-y-5 md:space-y-6">
                            <MyFormInput
                                label="Username"
                                name="name"
                                type="text"
                                value={inputs.username}
                                onChange={(e) => setInputs((f) => ({...f, username: e.target.value}))}
                                placeholder="Baskara"
                                className="w-full"
                                variant="secondary"
                            />
                            <MyFormInput
                                label="Name"
                                name="name"
                                type="text"
                                value={inputs.name}
                                onChange={(e) => setInputs((f) => ({...f, name: e.target.value}))}
                                placeholder="Baskara"
                                className="w-full"
                                variant="secondary"
                            />
                            <MyFormInput
                                label="Email"
                                name="email"
                                type="email"
                                value={inputs.email}
                                onChange={(e) => setInputs((f) => ({...f, email: e.target.value}))}
                                placeholder="baskara14@gmail.com"
                                className="w-full"
                                variant="secondary"
                            />
                            {/* <MyFormInput
                                label="Password"
                                name="password"
                                type="password"
                                value={inputs.password}
                                onChange={(e) => setInputs((f) => ({...f, password: e.target.value}))}
                                placeholder="••••••••••••"
                                className="w-full"
                                variant="secondary"
                            /> */}
                        </MyForm>

                        {/* Buttons Section */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                            {/* <MyButton
                                text="verify email"
                                variant="secondary"
                                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base order-2 sm:order-1"
                            /> */}
                            <MyButton
                                text="Simpan perubahan"
                                variant="custom"
                                onClick={handleUpdate}
                                className="px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base font-medium order-1 sm:order-2 bg-primary hover:bg-[#2F456D] text-white rounded-md font-helvetica active:translate-y-0 active:shadow-sm hover:-translate-y-0.5"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;