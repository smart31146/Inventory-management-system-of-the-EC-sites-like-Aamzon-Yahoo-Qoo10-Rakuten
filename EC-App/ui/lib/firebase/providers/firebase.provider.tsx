import { createContext, FC, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { app, auth, store, functions } from '..';
import { Functions } from 'firebase/functions';

type ContextValues = {
  app: FirebaseApp;
  auth: Auth;
  store: Firestore;
  functions: Functions
};

type ProviderProps = {
  children: ReactNode;
};

export const FirebaseContext = createContext<ContextValues>({
  app,
  auth,
  store,
  functions
});

export const FirebaseProvider: FC<ProviderProps> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ app, auth, store, functions }}>
      {children}
    </FirebaseContext.Provider>
  );
};
