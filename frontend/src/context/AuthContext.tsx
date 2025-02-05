import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { checkAuthStatus, loginuser, logoutUser, signupUser } from "../helpers/api-communicator";


type User ={
    name:string;
    email:string;
}

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login:(email:string, password:string)=>Promise<void>;
    signup:(name:string, email:string, password:string)=>Promise<void>;
    logout:()=>Promise<void>

}

const AuthContext = createContext<UserAuth | null >(null)

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setuser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function checkStatus() {
            const data = await checkAuthStatus();    
            if(data){
                setuser({email:data.email,name:data.name});
                setIsLoggedIn(true);
            }     
        }
        checkStatus()
    }, [])

    const login = async (email:string, password:string) =>{
        const data = await loginuser(email,password)
        if(data){
            setuser({email:data.email,name:data.name});
            setIsLoggedIn(true);
        }
    };
    const signup = async (name:string, email:string, password:string) =>{
        const data = await signupUser(name,email,password)
        if(data){
            setuser({email:data.email,name:data.name});
            setIsLoggedIn(true);
        }
    };
    const logout= async () =>{
        await logoutUser();
        setIsLoggedIn(false)
        setuser(null)
        window.location.reload()
    };

    const value ={
        user,
        isLoggedIn,
        login,
        logout,
        signup
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    
};

export const useAuth = () => useContext(AuthContext)