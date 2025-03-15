import React, { createContext, useEffect, useState } from "react";

// Tạo Context
export const Context = createContext();
export const ContextProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [account, setAccount] = useState("null");

  useEffect(() => {
    const apiUrl = `http://${process.env.IP_LOCAL}:3000/foods`;

    console.log(apiUrl);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error("Fetch error data food:", error));
  }, []);

  return (
    <Context.Provider
      value={{
        foods,
        setFoods,
        account,
        setAccount,
      }}
    >
      {children}
    </Context.Provider>
  );
};
