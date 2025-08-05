import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '0522',
  database: 'category',
  entities: [Category],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
