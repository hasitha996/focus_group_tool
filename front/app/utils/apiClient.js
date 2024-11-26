import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export  const getAccessToken = () => {
  const encryptedUserData = Cookies.get("userData");
  if (encryptedUserData) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedUserData,
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key"
      );
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log(decryptedData);
      return decryptedData.accessToken; // Extract accessToken
    } catch (error) {
      console.error("Failed to decrypt user data:", error);
      return null;
    }
  }
  return null;
};