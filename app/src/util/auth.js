import { redirect } from "react-router";

export function getAuthToken() {
    const token = localStorage.getItem('token');
    return token;
}

export function tokenLoader() {
    return getAuthToken();
}

export function checkAuthLoader() {
    const token = getAuthToken();
    
    if(!token) {
        return redirect('/auth?mode=login');
    } else {
        return null
    }
}

