import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import loginBg from "../Images/login.svg";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.status === "succeeded");
  const isError = useSelector((state) => state.users.status === "failed");
  const errorMessage = useSelector((state) => state.users.error);

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setLocalError("");
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login successful");
    } catch (error) {
      setLocalError(errorMessage || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess && user) {
      navigate("/");
    }
  }, [isSuccess, user, navigate]);

  useEffect(() => {
    if (isError) setLocalError(errorMessage || "Login failed. Please try again.");
  }, [isError, errorMessage]);

  // Clear error on input change
  useEffect(() => {
    setLocalError("");
  }, [email, password]);

  return (
    <div className="auth-bg" style={{
      backgroundImage: `url(${loginBg})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start"
    }}>
      <style>{`
        .auth-form-box {
          background: transparent;
          border-radius: 40px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 48px 36px 32px 36px;
          min-width: 400px;
          max-width: 420px;
          margin: 60px 0 60px 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-form-box .login-icon {
          font-size: 64px;
          color: #fff;
          margin-bottom: 12px;
        }
        .auth-form-box .login-header {
          font-size: 2.5rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 28px;
          text-align: center;
        }
        .auth-input-group {
          display: flex;
          align-items: center;
          background: #f5f7fa;
          border-radius: 32px;
          padding: 0 18px;
          margin-bottom: 18px;
          box-shadow: 0 1px 4px rgba(123,47,242,0.04);
        }
        .auth-input-group input {
          border: none;
          background: transparent;
          outline: none;
          padding: 14px 10px;
          flex: 1;
          font-size: 1.1rem;
          border-radius: 32px;
        }
        .auth-input-group .input-icon {
          color: #7b2ff2;
          font-size: 1.2rem;
          margin-right: 8px;
        }
        .auth-btn {
          width: 100%;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 32px;
          padding: 14px 0;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 18px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .auth-btn:hover {
          background: #1d4ed8;
        }
        .auth-bottom-text {
          text-align: center;
          font-size: 1rem;
          color: #fff;
        }
        .auth-bottom-text a {
          color: #2563eb;
          text-decoration: underline;
          margin-left: 4px;
        }
        .show-password-toggle {
          background: none;
          border: none;
          color: #7b2ff2;
          font-size: 0.95rem;
          cursor: pointer;
          margin-left: 8px;
        }
        .error {
          color: #e53935;
          margin-bottom: 12px;
        }
      `}</style>
      <div className="auth-form-box">
        <FaUser className="login-icon" />
        <div className="login-header">Login</div>
        {localError && <p className="error">{localError}</p>}
        <form onSubmit={handleLogin} style={{width: '100%'}} autoComplete="on">
          <div className="auth-input-group">
            <label htmlFor="email" style={{display:'none'}}>Email</label>
            <FaUser className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
              aria-label="Email"
              autoComplete="email"
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password" style={{display:'none'}}>Password</label>
            <FaLock className="input-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
              aria-label="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="show-password-toggle"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="auth-bottom-text">
        Don't have an account?
          <Link to="/register"> Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
