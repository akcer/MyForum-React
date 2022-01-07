import { createContext } from 'react';

const userContext = createContext<User & SetUserFromLocalStorage>({
  setUserFromLocalStorage: () => {},
});

export default userContext;
