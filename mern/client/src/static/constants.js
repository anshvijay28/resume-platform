const DEV_APP_URL = "http://localhost:5000";
const PROD_APP_URL = "https://resume-platform.herokuapp.com";

export const APP_URL = process.env.NODE_ENV === "production" ? PROD_APP_URL : DEV_APP_URL;
