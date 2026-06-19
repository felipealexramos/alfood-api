import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1781831992989 implements MigrationInterface {
  name = 'Init1781831992989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pratos" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "descricao" character varying NOT NULL, "tag" character varying NOT NULL, "imagem" character varying, "restauranteId" integer NOT NULL, CONSTRAINT "PK_50d2a55b1c04c528d7cc67a106f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "restaurantes" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, CONSTRAINT "PK_a5a8cab911b052fac23912033ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_d090e09fe86ebe2ec0aec27b451" UNIQUE ("value"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pratos" ADD CONSTRAINT "FK_62391ccac27abd0e42e5f8c59f4" FOREIGN KEY ("restauranteId") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Seed the default tags the front-end expects.
    await queryRunner.query(
      `INSERT INTO "tags" ("value") VALUES ($1), ($2), ($3), ($4), ($5), ($6), ($7)`,
      [
        'Italiana',
        'Japonesa',
        'Brasileira',
        'Mexicana',
        'Árabe',
        'Vegetariana',
        'Sobremesa',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pratos" DROP CONSTRAINT "FK_62391ccac27abd0e42e5f8c59f4"`,
    );
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "restaurantes"`);
    await queryRunner.query(`DROP TABLE "pratos"`);
  }
}
