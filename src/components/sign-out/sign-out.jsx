import { auth } from "../../App";

export const SignOut = () => {
    return auth.currentUser && (
        <button className='btn btn-outline-dark' onClick={() => auth.signOut()}>
            Sign Out
        </button>
    );
};