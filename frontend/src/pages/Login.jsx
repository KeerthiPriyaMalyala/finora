
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import {
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";

import loginBanner from "../assets/login-banner.jpg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      if (data?.data) {
        login(data.data);
        navigate("/dashboard");
      } else {
        setError("Invalid server response");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* FULL SCREEN IMAGE */}
      <img
        src={loginBanner}
        alt="Background"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          scale-105
        "
      />

      {/* DARK OVERLAY */}
      <div className="
        absolute
        inset-0
        bg-black/55
      "></div>

      {/* PURPLE OVERLAY */}
      <div className="
        absolute
        inset-0
        bg-gradient-to-br
        from-[#0B0719]/90
        via-purple-900/50
        to-indigo-900/70
      "></div>

      {/* LIGHT EFFECT */}
      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_30%)]
      "></div>

      {/* ANIMATED GLOW 1 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[400px]
          h-[400px]
          bg-purple-700
          blur-3xl
          rounded-full
        "
      />

      {/* ANIMATED GLOW 2 */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-[-150px]
          right-[-100px]
          w-[450px]
          h-[450px]
          bg-indigo-600
          blur-3xl
          rounded-full
        "
      />

      {/* CONTENT */}
      <div className="
        relative
        z-10
        min-h-screen
        flex
        items-center
        justify-center
        px-4
      ">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            w-full
            max-w-md
          "
        >

          {/* BRANDING */}
          <div className="text-center mb-8">

            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: 3,
              }}
              className="
                inline-flex
                items-center
                justify-center
                w-16
                h-16
                rounded-2xl
                bg-gradient-to-br
                from-purple-500
                to-indigo-600
                shadow-2xl
                shadow-purple-900/50
                mb-5
              "
            >
              <ShieldCheck className="text-white w-8 h-8" />
            </motion.div>

            <h1 className="
              text-6xl
              font-extrabold
              bg-gradient-to-r
              from-white
              via-purple-200
              to-indigo-300
              bg-clip-text
              text-transparent
              tracking-tight
              drop-shadow-2xl
            ">
              Finora
            </h1>

            <p className="
              text-purple-100/80
              mt-4
              text-sm
              tracking-[0.2em]
              uppercase
            ">
              Smart Finance Platform
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="
            backdrop-blur-2xl
            bg-white/10
            border
            border-white/10
            rounded-[32px]
            p-8
            shadow-[0_10px_60px_rgba(0,0,0,0.5)]
          ">

            <div className="mb-8">
              <h2 className="
                text-3xl
                font-bold
                text-white
              ">
                Welcome Back 
              </h2>

              <p className="
                text-purple-100/70
                mt-2
              ">
                Continue your financial journey
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="
                  mb-5
                  rounded-2xl
                  border
                  border-red-400/30
                  bg-red-500/10
                  px-4
                  py-3
                  text-sm
                  text-red-200
                "
              >
                {error}
              </motion.div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>
                <label className="
                  block
                  text-sm
                  text-purple-100
                  mb-2
                  font-medium
                ">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  data-testid="input-email"
                  placeholder="you@example.com"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    text-white
                    placeholder:text-gray-300
                    outline-none
                    transition-all
                    duration-300
                    focus:border-purple-400
                    focus:bg-white/10
                    focus:ring-4
                    focus:ring-purple-500/20
                  "
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="
                  block
                  text-sm
                  text-purple-100
                  mb-2
                  font-medium
                ">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    data-testid="input-password"
                    placeholder="••••••••"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      px-4
                      py-3
                      pr-14
                      text-white
                      placeholder:text-gray-300
                      outline-none
                      transition-all
                      duration-300
                      focus:border-purple-400
                      focus:bg-white/10
                      focus:ring-4
                      focus:ring-purple-500/20
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-300
                      hover:text-white
                      transition
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                data-testid="button-submit"
                className="
                  group
                  relative
                  w-full
                  overflow-hidden
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-indigo-600
                  py-3
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:shadow-[0_10px_30px_rgba(124,58,237,0.45)]
                  disabled:opacity-60
                "
              >
                <span className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                  gap-2
                ">
                  {loading ? "Signing in..." : "Sign In"}

                  {!loading && (
                    <ArrowRight className="
                      w-4
                      h-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    " />
                  )}
                </span>

                <div className="
                  absolute
                  inset-0
                  bg-white/10
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "></div>
              </motion.button>
            </form>

            {/* FOOTER */}
            <p className="
              mt-7
              text-center
              text-sm
              text-purple-100/70
            ">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="
                  font-semibold
                  text-purple-300
                  hover:text-white
                  transition-colors
                "
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}