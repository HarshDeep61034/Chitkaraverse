import React, { createContext, ReactNode, useState } from 'react'

export const userContext = createContext({});

const ContextProvider = ({children}: any) => {
    const num = Math.floor(Math.random() * 100);
    const [user, setUser] = useState({name: "Player"+num, id: num});

  return (
    <userContext.Provider value={[user, setUser]}>
        {children}
    </userContext.Provider>
  )
}

export default ContextProvider