import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { app } from "../utils/firebase.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice.js";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleGoogleAuth() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app); 
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: result.user.displayName, 
          email: result.user.email,
          photoURL: result.user.photoURL
        })
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <button 
      type="button"
      className="bg-red-700 text-white p-3 mt-2 rounded-lg hover:opacity-95 tracking-wider font-semibold"
      onClick={handleGoogleAuth}
    >
      CONTINUE WITH GOOGLE
    </button>
  );
}