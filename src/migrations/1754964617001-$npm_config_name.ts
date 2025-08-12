import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1754964617001 implements MigrationInterface {
  name = ' $npmConfigName1754964617001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "total_quantity" integer NOT NULL, "current_quantity" integer NOT NULL, "status" character varying NOT NULL DEFAULT '정상', "category_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_user_id" integer NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "CHK_c82ba8d5b300d905ed51aa729b" CHECK ("total_quantity" >= "current_quantity"), CONSTRAINT "CHK_4a692bd3b98d8cf8cdfbfd627d" CHECK ("current_quantity" >=0), CONSTRAINT "CHK_01acf87cc909177fcbf0f340c2" CHECK ("total_quantity" >=0), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rental_history" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "item_id" integer NOT NULL, "quantity" integer NOT NULL, "rental_date" TIMESTAMP NOT NULL, "return_date" TIMESTAMP, CONSTRAINT "PK_efb9bd82e908ec30e4a826d103c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "rental_history"`);
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
