import { useState } from "react";
import { userSchemaValidation } from "../Validations/UserValidations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import registBg from "../Images/regist.svg";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await dispatch(registerUser(userData)).unwrap();
      navigate("/login");
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-bg" style={{
      backgroundImage: `url(${registBg})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    }}>
      <style>{`
        .auth-form-box {
          background: transparent;
          border-radius: 40px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 48px 36px 32px 36px;
          min-width: 400px;
          max-width: 420px;
          margin: 60px 80px 60px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-form-box .register-header {
          font-size: 2.2rem;
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
        .error {
          color: #e53935;
          font-size: 0.98rem;
          margin-bottom: 8px;
        }
      `}</style>
      <div className="auth-form-box">
        <div className="register-header">Let's Create Your Account!</div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
          <div className="auth-input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Enter Your Name"
              {...register("name")}
            />
          </div>
          <p className="error">{errors.name?.message}</p>
          <div className="auth-input-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
            />
          </div>
          <p className="error">{errors.email?.message}</p>
          <div className="auth-input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Enter Your Password"
              {...register("password")}
            />
          </div>
          <p className="error">{errors.password?.message}</p>
          <div className="auth-input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
          </div>
          <p className="error">{errors.confirmPassword?.message}</p>
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <div className="auth-bottom-text">
          Or <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
