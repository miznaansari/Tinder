import React, { useState } from "react";
import MyContext from "./MyContext";

const MyProvider = ({ children }) => {
  const [notification, setNotification] = useState("");

  const value = {
    notification,
    setNotification,

  };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
