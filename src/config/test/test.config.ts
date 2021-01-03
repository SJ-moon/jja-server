import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

type Entity = EntityClassOrSchema;

const createTestConfiguration = (entities: Entity[]): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: ':memory:',
  entities,
  dropSchema: true,
  synchronize: true,
  logging: false,
});

export const TestConnectionModule: (entities: Entity[]) => DynamicModule[] = (
  entities,
) => {
  const ConnectionModule: DynamicModule = TypeOrmModule.forRoot(
    createTestConfiguration(entities),
  );
  const FeatureModules: DynamicModule = TypeOrmModule.forFeature(entities);
  return [ConnectionModule, FeatureModules];
};
