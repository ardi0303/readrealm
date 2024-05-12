import { useForm } from "react-hook-form";
import imgAuth from "../../assets/img/auth.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { toast } from "react-toastify";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Register({ backToLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleRegister = async (data) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const userId = user.user.uid;
      await setDoc(doc(collection(db, "users"), userId), {
        fullName: data.fullName,
      });
      if (user) {
        toast.success(`Welcome ${data.fullName}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <div className="bg-bg-auth bg-cover lg:w-2/3 min-h-screen hidden lg:block">
        <div className="mx-20 my-32 flex flex-col gap-6">
          <h1 className="text-5xl text-white font-poppinsBold">Read</h1>
          <h1 className="text-5xl text-white font-poppinsBold">Realm.</h1>
        </div>
      </div>
      <div className="bg-[#2A2A2A] min-h-screen flex items-center justify-center lg:w-1/3 w-screen">
        <div className="flex flex-col w-full mx-8">
          <h2 className="lg:text-2xl text-lg text-white font-poppinsBold">
            Create Account
          </h2>
          <div className="flex flex-col items-center mt-12 gap-10">
            <img src={imgAuth} alt="Auth" className="h-24 w-24" />
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="flex flex-col gap-2 w-full"
            >
              <div className="">
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("fullName", {
                    required: "This field is required",
                  })}
                  className="bg-transparent border-b-[1px] focus:outline-none text-white border-white font-poppinsSemibold placeholder:font-poppinsSemibold placeholder:text-white w-full"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-xs font-poppinsRegular">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="bg-transparent border-b-[1px] focus:outline-none text-white border-white font-poppinsSemibold placeholder:font-poppinsSemibold placeholder:text-white w-full"
                  autoComplete="off"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs font-poppinsRegular">{errors.email.message}</span>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "This field is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="bg-transparent border-b-[1px] focus:outline-none text-white border-white font-poppinsSemibold placeholder:font-poppinsSemibold placeholder:text-white w-full"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs font-poppinsRegular">{errors.password.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="bg-white text-black py-1 rounded-lg mt-6 mx-20 font-poppinsSemibold"
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
