import axios from "axios";

export const loginApi = async (email: string, password: string) => {
  const response = await axios.post(
    `https://kleurdigital.xyz/util/login/login_mobile.php`,
    {
      email,
      password,
    },
  );

  return response.data; // { token, user }
};
