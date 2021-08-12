import {MigrationInterface, QueryRunner} from "typeorm";

export class DbChange1628759684528 implements MigrationInterface {
    name = 'DbChange1628759684528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` CHANGE `provider` `provider` enum ('google', 'facebook', 'system') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` CHANGE `provider` `provider` enum ('google', 'facebook') NULL");
    }

}
