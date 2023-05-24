export interface AuthenticationRequest {
    username: string
    password: string
    role: string
}

export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
    role: string
}
