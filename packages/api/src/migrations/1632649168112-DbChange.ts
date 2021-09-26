import {MigrationInterface, QueryRunner} from "typeorm";

export class DbChange1632649168112 implements MigrationInterface {
    name = 'DbChange1632649168112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`trending\` (\`storyId\` int NOT NULL AUTO_INCREMENT, \`score\` float NOT NULL, PRIMARY KEY (\`storyId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`view_hits\` (\`storyId\` bigint NOT NULL, \`view\` int NOT NULL, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`storyId\`, \`createdAt\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`view_hits\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`trending\``);
    }

}
