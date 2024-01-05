const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, APP_TIMEZONE } = process.env;

export default {
    db_username: DB_USERNAME,
    db_password: DB_PASSWORD,
    db_host: DB_HOST,
    db_port: DB_PORT,
    db_name: DB_NAME,
    app_timezone: APP_TIMEZONE,
};
