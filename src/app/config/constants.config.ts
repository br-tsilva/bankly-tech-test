export default <Record<string, string>>{
  node_env: process.env.NODE_ENV,

  server_port: process.env.SERVER_PORT,

  bankly_host: process.env.BANKLY_SERVICE_HOST,
  bankly_port: process.env.BANKLY_SERVICE_PORT,

  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_connect_timeout_in_ms: process.env.DB_CONNECT_TIMEOUT_IN_MS,
  db_acquire_timeout_in_ms: process.env.DB_ACQUIRE_TIMEOUT_IN_MS,
}
