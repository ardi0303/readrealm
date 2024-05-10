import { useEffect, useRef } from "react";
import { CloseIcon } from "../../assets/icon";

export default function Modal({ children, onClose }) {
  const modalRef = useRef(null);

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full px-10 h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-[#2A2A2A] p-4 rounded-lg max-h-[800px] lg:max-h-[500px]" ref={modalRef}>
        <div className="flex justify-end">
          <button
            className="border border-white text-white py-1 px-1 rounded-md"
            onClick={onClose}
          ><CloseIcon size={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
