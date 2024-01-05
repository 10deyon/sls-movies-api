import { PoolOptions } from 'mysql2';
import config from './config';
import mysql from 'mysql2/promise';

const access: PoolOptions = {
    host: config.db_host,
    user: config.db_username,
    database: config.db_name,
};

const connection = mysql.createConnection(access);

export default connection;
