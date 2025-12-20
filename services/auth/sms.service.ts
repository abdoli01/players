import { fetcher } from "../http/fetcher";

export const smsService = {
    sendRegister: (username: string) =>
        fetcher("/users/send-sms-register", {
            method: "POST",
            body: JSON.stringify({ username }),
        }),

    sendReset: (username: string) =>
        fetcher("/users/send-sms-reset", {
            method: "POST",
            body: JSON.stringify({ username }),
        }),
};
