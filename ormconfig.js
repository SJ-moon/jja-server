module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'nest',
  entities: ['dist/app/**/*.entity.js'],
};
