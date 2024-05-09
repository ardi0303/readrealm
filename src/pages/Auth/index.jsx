import { useState } from "react";
import imgAuth from "../../assets/img/auth.png";
import Register from "./register";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setSaveBooks } from "../../store/slice/book-slice";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, form.email, form.password)
      if(user) {
        toast.success(`Welcome back ${auth?.currentUser?.displayName || auth?.currentUser?.email}`);
      } 
      const userRef = doc(db, "users", auth.currentUser?.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          dispatch(setSaveBooks(doc.data().savedBooks || []));
        } else {
          console.log("Books not found in Firestore.");
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error(error);
      if(error.code === 'auth/invalid-credential')
      toast.error('User not found! Please register first!');
    }
  };

  if (!isLogin) return <Register backToLogin={() => setIsLogin(true)} />;
  return (
    <>
      <div className="flex">
        <div className="bg-bg-auth bg-cover lg:w-2/3 min-h-screen hidden lg:block">
          <div className="mx-20 my-32 flex flex-col gap-6">
            <h1 className="text-5xl text-white font-bold">Read</h1>
            <h1 className="text-5xl text-white font-bold">Realm.</h1>
          </div>
        </div>
        <div className="bg-[#2A2A2A] min-h-screen w-full flex items-center justify-center lg:w-1/3">
          <div className="">
            <h2 className="text-2xl text-white font-bold">Welcome Back!</h2>
            <div className="flex flex-col items-center mt-12 gap-12">
              <img src={imgAuth} alt="Auth" className="h-24 w-24" />
              <form onSubmit={handleSignIn} className="flex flex-col w-full mx-10 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  className="bg-transparent border-b-[1px] focus:outline-none text-white border-white placeholder:font-semibold placeholder:text-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-transparent border-b-[1px] focus:outline-none text-white border-white placeholder:font-semibold placeholder:text-white"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <div className="flex justify-end">
                  <p className="text-white text-sm cursor-pointer">
                    Forget Password?
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-white text-black py-1 rounded-lg mt-2 mx-20 font-semibold"
                  onClick={() => handleSignIn()}>Sign In</button>
              </form>
              <div className="flex justify-center">
                <p
                  className="text-white underline cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
