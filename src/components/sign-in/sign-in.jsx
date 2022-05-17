import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../App";

export const SignIn = () => {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        signInWithRedirect(auth, provider);
    };

    return (
        <div className='container text-center'>
            <button className='text-center btn btn-outline-primary' onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </div>
    );
};