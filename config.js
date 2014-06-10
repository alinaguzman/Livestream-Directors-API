module.exports = {

  // Server
  base_url : process.env.BASE_URL || 'http://localhost:8082',
  port     :  process.env.PORT || 8082,

  // Postgres
  database_url : process.env.DATABASE_URL || 'postgresql://localhost:5432/directors'
};
