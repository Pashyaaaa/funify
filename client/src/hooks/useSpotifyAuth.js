import { useState, useEffect } from "react";

export const useSpotifyAuth = () => {
  const CLIENT_ID = "4a0bfe39446149d38768668336a31795"; //import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = "https://meify.vercel.app";
  // const REDIRECT_URI = "http://localhost:5173";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPE =
    "user-library-read%20playlist-read-private%20user-read-currently-playing%20user-top-read";
  const RESPONSE_TYPE = "code";

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userURL, setUserURL] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = localStorage.getItem("token");
    let expireIn = "";

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elm) => elm.startsWith("access_token"))
        .split("=")[1];

      expireIn = hash
        .substring(1)
        .split("&")
        .find((elm) => elm.startsWith("expires_in"))
        .split("=")[1];

      expireIn = parseInt(expireIn, 10) * 1000;

      const now = new Date();
      const expires = new Date(now.getTime() + expireIn);

      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      };

      const formattedExpire = `${formatTime(now)} -> ${formatTime(expires)}`;

      window.localStorage.setItem("token", token);
      window.localStorage.setItem("tokenExpire", formattedExpire);
      window.location.hash = "";
    }

    if (token) {
      checkTokenValidity(token);
    }

    setToken(token);
  }, []);

  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();
      setUserImage(data.images[1]?.url || "");
      setUserURL(data.external_urls.spotify || "");
      setData(data);
    } catch (error) {
      console.error("Error:", error.message);
      if (error.message === "Invalid token") {
        setToken("");
        setError("Token is invalid or expired");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpire");
      } else {
        setError("Error fetching data, please try again later.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return {
    token,
    error,
    userImage,
    userURL,
    data,
    CLIENT_ID,
    REDIRECT_URI,
    AUTH_ENDPOINT,
    RESPONSE_TYPE,
    SCOPE,
    logout,
  };
};
