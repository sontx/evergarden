import {MigrationInterface, QueryRunner} from "typeorm";

export class DbChange1628827253196 implements MigrationInterface {
    name = 'DbChange1628827253196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` ADD \`description\` varchar(8000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` ADD \`description\` varchar(2000) NULL`);
    }

}
