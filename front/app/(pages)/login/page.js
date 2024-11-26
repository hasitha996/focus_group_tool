"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import notifications from '../../components/alarts/alerts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import styles from "../../styles/login.module.css";
import { googleAuth } from "../api/auth/googleAuth";
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
      
        const result = await googleAuth(authResult.code);     
        console.log(result);
        if (result) {
          // Show success notification
          notifications.success("Google signin successful!");
          router.push("/dashboard");

        } else {
          // If authentication fails or result doesn't have success or data
          notifications.error("Failed to authenticate with Google");
        }
      } else {
        notifications.error("Failed to authenticate with Google: Missing authorization code");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      notifications.error("Google signin failed: " + error.message);
    }
  };


  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <h1 className={styles["login-header"]}>Sign In</h1>
        <div className="text-center mt-4">
          <p>
            Not a member? <Link href="/register">Register</Link>
          </p>
          <p>Or sign in with</p>
          <div className={styles["social-btns"]}>
            <button type="button" onClick={() => {
              googleLogin();
            }
            }>
              <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
