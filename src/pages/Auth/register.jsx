import { useForm } from "react-hook-form";
import imgAuth from "../../assets/img/auth.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useState } from "react";
import { toast } from "react-toastify";
import { set } from "firebase/database";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Register({ backToLogin }) {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data) => {
    try {
      setIsLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userId = user.user.uid;

      await setDoc(doc(collection(db, "users"), userId), {
        fullName: data.fullName,
      });

      setIsLoading(false);
      if (user) {
        toast.success(`Welcome ${data.fullName}`);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const requiredConfig = {
    required: {
      value: true,
      message: "This field is required",
    },
  };

  return (
    <div className="flex">
      <div className="bg-bg-auth bg-cover lg:w-2/3 h-screen hidden lg:block">
        <div className="mx-20 my-32 flex flex-col gap-6">
          <h1 className="text-5xl text-white font-poppinsBold">Read</h1>
          <h1 className="text-5xl text-white font-poppinsBold">Realm.</h1>
        </div>
      </div>
      <div className="bg-[#2A2A2A] min-h-screen flex items-center justify-center lg:w-1/3 w-full">
        <div className="mx-4">
          <h2 className="text-2xl text-white font-poppinsBold">Create Account</h2>
          <div className="flex flex-col items-center mt-12 gap-12">
            <img src={imgAuth} alt="Auth" className="h-24 w-24" />
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="flex flex-col w-full mx-10 gap-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                {...register("fullName", { ...requiredConfig })}
                className="bg-transparent border-b-[1px] focus:outline-none text-white border-white font-poppinsSemibold placeholder:font-poppinsSemibold placeholder:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { ...requiredConfig })}
                className="bg-transparent border-b-[1px] focus:outline-none text-white border-white font-poppinsSemibold placeholder:font-poppinsSemibold placeholder:text-white"
                autoComplete="off"
              />
              <input
                type="password"
                placeholder="Password"
                {...register("password", { ...requiredConfig })}
                className="bg-transparent border-b-[1px] focus:outline-none text-white border-white font-poppinsSemibold placeholder:font-poppinsSemibold placeholder:text-white"
              />
              <button
                type="submit"
                className="bg-white text-black py-1 rounded-lg mt-8 mx-20 font-poppinsSemibold"
                onClick={() => handleRegister()}
              >
                Sign Up
              </button>
            </form>
            <div className="flex justify-center">
              <p
                className="text-white underline cursor-pointer font-poppinsRegular"
                onClick={backToLogin}
              >
                Login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
