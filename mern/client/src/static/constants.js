const port = process.env.PORT || 5000;

const DEV_APP_URL = "http://localhost:5000";
const PROD_APP_URL = "https://resume-platform.herokuapp.com";

export const APP_URL = port === 5000 ? DEV_APP_URL : PROD_APP_URL;
