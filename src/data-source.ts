import { DataSource } from 'typeorm';
import { Category } from './category/category.entity';
import { Item } from './item/item.entity';
import { RentalHistory } from './rental-history/rental-history.entity';
import { User } from './user/user.entity';
import { config } from 'dotenv';

config(); // .env 파일의 환경 변수 로드

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres', // 데이터 베이스 종류(PostgreSQL)
  host: process.env.DB_HOST, // 데이터 베이스 서버 주소
  port: Number(process.env.DB_PORT), // 데이터베이스 기본 포트
  username: process.env.DB_USERNAME, // 데이터베이스 사용자 이름
  password: process.env.DB_PASSWORD, // 데이터 베이스 비밀번호
  database: process.env.DB_DATABASE, // 사용할 데이터베이스 이름
  entities: [Category, Item, RentalHistory, User], // 데이터베이스에 사용될 엔티티
  migrations: ['src/migrations/*.ts'], // 마이그레이션 파일 위치(타입스크립트 파일로 저장)
  synchronize: false, // 데이터베이스 스키마 자동 동기화 설정
});
