import axios from "axios";

const back = process.env.REACT_APP_BACK;

/////////////////////////////////////////////////////////////////////////
//                     A U T H E N T I F I C A T I O N                 //
/////////////////////////////////////////////////////////////////////////

export async function getTokenRequest(oauth_code: string, otp_code: string) {
    return (
        axios.post(`${back}/auth/42/trade`, {
            oauth_code,
            otp_code
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function signinRequest(username: string, password: string, code?: string, twoFa: string = "false") {
    console.log("signin request with => ", `signin?twoFA=${twoFa}`, code, twoFa)
    return (
        axios.post(`${back}/auth/signin?twoFA=${twoFa}`, {
            username,
            password, 
            code,
        })
            .then(res => ({ error: false, res }))
            .catch(res => {
                if (res.response)
                    return ({ error: true, errMessage: 'username or password incorrect' })
                else
                    return ({ error: true, errMessage: res.message })
            })
    )
}


export async function signupRequest(username: string, password: string) {
    return (
        axios.post(`${back}/auth/signup`, {
            username,
            password
        })
        .then(res => ({ error: false, res }))
        .catch(res => {
            if (res.response)
                return ({ error: true, errMessage: 'user already exists' })
            else
                return ({ error: true, errMessage: res.message })
        })
    )
}


