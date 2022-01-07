import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SSRProvider from 'react-bootstrap/SSRProvider';
import '../styles/globals.css';
import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Layout from '../layouts/Layout';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import UserContext from '../contexts/userContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    setUserFromLocalStorage();
  }, []);

  const setUserFromLocalStorage = (): void => {
    const user = window.localStorage.getItem('user');

    if (user) {
      const userData = JSON.parse(user);
      setUser({
        username: userData.username,
        avatar: userData.avatar,
        isAdmin: userData.isAdmin,
      });
    } else {
      setUser({
        username: '',
        avatar: '',
        isAdmin: false,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...user,
        setUserFromLocalStorage,
      }}
    >
      <SSRProvider>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </SSRProvider>
    </UserContext.Provider>
  );
}
export default MyApp;
