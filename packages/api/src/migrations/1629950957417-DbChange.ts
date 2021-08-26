import {MigrationInterface, QueryRunner} from "typeorm";

export class DbChange1629950957417 implements MigrationInterface {
    name = 'DbChange1629950957417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` ADD \`type\` enum ('convert', 'translate', 'self-composed') NOT NULL DEFAULT 'translate'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` DROP COLUMN \`type\``);
    }

}
