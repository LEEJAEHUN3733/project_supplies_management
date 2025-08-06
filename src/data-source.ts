import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { Item } from './entities/item.entity';

export const AppDataSource1 = new DataSource({
  type: 'postgres', // 데이터 베이스 종류(PostgreSQL)
  host: 'localhost', // 데이터 베이스 서버 주소
  port: 5432, // 데이터베이스 기본 포트
  username: 'postgres', // 데이터베이스 사용자 이름
  password: '0522', // 데이터 베이스 비밀번호
  database: 'category', // 사용할 데이터베이스 이름
  entities: [Category, Item], // 데이터베이스에 사용될 엔티티
  migrations: ['src/migrations/*.ts'], // 마이그레이션 파일 위치(타입스크립트 파일로 저장)
  synchronize: false, // 데이터베이스 스키마 자동 동기화 설정
});
