import API from "./api.ts";

export const registerUser = async (
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    email: string,
    passwordHash: string,
    storeName: string,
    birthday?: string,
    address?: string
) => {
    const { data } = await API.post("auth/register", {
        firstName,
        middleName,
        lastName,
        email,
        passwordHash,
        storeName,
        birthday,
        address
    });
    return data;
}

export const loginUser = async (email: string, passwordHash: string) => {
    const { data } = await API.post("auth/login", { email, passwordHash });
    return data;
}