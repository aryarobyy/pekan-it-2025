// import Mail from "../../assets/icons/mail.png"
// import MailOpen from "../../assets/icons/mailOpen.png";

import { Mail, MailOpen } from "lucide-react";

type MailIconButtonProps = {
  notification: boolean;
  isOpen: boolean;
  onClick: () => void;
};

const MailIconButton: React.FC<MailIconButtonProps> = ({
  notification,
  isOpen,
  onClick,
}) => (
  <div className="relative">
    <button
      onClick={onClick}
      className="text-white hover:text-yellow-400 transition-colors"
    >
        <div className="h-8 w-8">
            {isOpen ? <MailOpen/> : <Mail/>}
        </div>
    </button>
    {notification && !isOpen && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#4E6E9A] rounded-full"></span>
    )}
  </div>
);

export default MailIconButton