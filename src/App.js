import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Chat, SignIn, SignOut } from './components';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID
} = process.env;

export const app = initializeApp({
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID
});
export const auth = getAuth();
export const firestore = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='app'>
      <header className='container my-3 text-center'>
        <h2>Secret Chat</h2>
        <SignOut />
      </header>

      <div className='container'>
        {user ? <Chat /> : <SignIn />}
      </div>
    </div>
  );
}

export default App;