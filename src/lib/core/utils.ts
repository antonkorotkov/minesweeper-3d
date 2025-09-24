export const isDev = (): boolean => {
    return typeof import.meta !== "undefined" && import.meta.env.DEV === true;
};
