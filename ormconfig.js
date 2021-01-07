let databaseConfig = require(__dirname +
  '/src/config/database/database.config.js');
const node_env = process.env.NODE_ENV;

databaseConfig = process.env.DOCKER
  ? databaseConfig.docker
  : databaseConfig.local;

if (node_env === 'development') {
  databaseConfig = {
    ...databaseConfig,
    migrations: ['src/migration/*.ts'],
    cli: {
      migrationsDir: 'src/migration',
    },
    entities: ['src/app/**/*.entity.ts'],
  };
} else if (node_env === 'production') {
  databaseConfig = {
    ...databaseConfig,
    entities: ['dist/app/**/*.entity.js'],
  };
}

module.exports = databaseConfig;
