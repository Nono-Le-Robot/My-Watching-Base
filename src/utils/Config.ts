// const apiUrl:string = "https://srbck.fr:3001"
const apiUrl:string = "http://localhost:5000/backend"


export const registerUrl: string = `${apiUrl}/api/auth/register`
export const LoginUrl: string = `${apiUrl}/api/auth/login`


export default {
    registerUrl,
    LoginUrl,
}