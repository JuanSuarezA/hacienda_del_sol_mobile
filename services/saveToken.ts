import axios from "axios";

export const saveToken = async (id: number, token: string) => {
  const response = await axios.post(
    `https://kleurdigital.xyz/util/login/token_mobile.php`,
    {
      id,
      token,
    },
  );

  return response.data; // { token, user }
};
