import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const TypeOrmConnectionModule: DynamicModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'nest',
  entities: [],
  synchronize: false,
});

export default TypeOrmConnectionModule;
