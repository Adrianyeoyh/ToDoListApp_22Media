import { request } from "./utils/api";

export const getHealth = () => request("/health");
