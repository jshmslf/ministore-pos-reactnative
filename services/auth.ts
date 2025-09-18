import API from "./api";

export const registerUser = async (
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    email: string,
    password: string,
    storeName: string,
    birthday?: string,
    address?: string
) => {
    const { data } = await API.post("auth/register", {
        firstName,
        middleName,
        lastName,
        email,
        password,
        storeName,
        birthday,
        address
    });
    return data;
}

export const loginUser = async (email: string, password: string) => {
    const { data } = await API.post("auth/login", { email, password });
    return data;
}