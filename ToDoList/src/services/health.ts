import { request } from "./lib/api";


export const getHealth = () => request('/health');