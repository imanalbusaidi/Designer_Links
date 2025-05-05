import {
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Button,
  Col,
  Row,
} from "reactstrap";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.status === "succeeded");
  const isError = useSelector((state) => state.users.status === "failed");
  const errorMessage = useSelector((state) => state.users.error);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    if (isSuccess && user) {
      navigate("/");
    }
  }, [isSuccess, user, navigate]);

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
      `}</style>
      <div className="auth-form-box">
        <FaUser className="login-icon" />
        <div className="login-header">Login</div>
        {isError && <p className="error" style={{color:'#e53935', marginBottom:12}}>{errorMessage || "Login failed. Please try again."}</p>}
        <div className="auth-input-group">
          <FaUser className="input-icon" />
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="auth-input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <button className="auth-btn" onClick={handleLogin}>Login</button>
        <div className="auth-bottom-text">
          Do you have an account?
          <Link to="/register"> Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
