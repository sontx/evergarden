import {MigrationInterface, QueryRunner} from "typeorm";

export class DbChange1629002924255 implements MigrationInterface {
    name = 'DbChange1629002924255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`genres\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_f105f8230a83b86a346427de94\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`histories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`currentChapterNo\` int NOT NULL DEFAULT '0', \`started\` timestamp NOT NULL, \`lastVisit\` timestamp NOT NULL, \`currentReadingPosition\` float NOT NULL DEFAULT '0', \`vote\` enum ('upvote', 'downvote', 'none') NULL DEFAULT 'none', \`isFollowing\` tinyint NOT NULL DEFAULT 0, \`storyId\` int NOT NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_1403ddb5a860084e25b727991f\` (\`storyId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(50) NOT NULL, \`password\` varchar(50) NULL, \`provider\` enum ('google', 'facebook', 'system') NULL, \`fullName\` varchar(50) NOT NULL, \`refreshToken\` varchar(255) NULL, \`role\` enum ('user', 'mod', 'admin') NOT NULL DEFAULT 'user', \`photoUrl\` varchar(500) NULL, \`settings\` text NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`chapters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL, \`updated\` timestamp NOT NULL, \`chapterNo\` int NOT NULL, \`title\` varchar(255) NULL, \`content\` mediumtext NOT NULL, \`published\` tinyint NOT NULL DEFAULT 0, \`storyId\` int NOT NULL, \`createdById\` int NULL, \`updatedById\` int NULL, UNIQUE INDEX \`IDX_7f34072feacf768b64cbc505a0\` (\`storyId\`, \`chapterNo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`stories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL, \`updated\` timestamp NOT NULL, \`url\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(8000) NULL, \`thumbnail\` varchar(2000) NULL, \`cover\` varchar(2000) NULL, \`status\` enum ('full', 'ongoing') NOT NULL DEFAULT 'ongoing', \`view\` int NOT NULL DEFAULT '0', \`upvote\` int NOT NULL DEFAULT '0', \`downvote\` int NOT NULL DEFAULT '0', \`lastChapter\` int NULL, \`published\` tinyint NOT NULL DEFAULT 0, \`createdById\` int NULL, \`updatedById\` int NULL, UNIQUE INDEX \`IDX_6f534ae2896f60a912f74b5599\` (\`url\`), UNIQUE INDEX \`IDX_18e913d264452630f78e9209e8\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`authors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_6c64b3df09e6774438aeca7e0b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`stories_authors_authors\` (\`storiesId\` int NOT NULL, \`authorsId\` int NOT NULL, INDEX \`IDX_4e4a3ad022dd70ee4ba6679956\` (\`storiesId\`), INDEX \`IDX_65e035585176d24109dc7475ad\` (\`authorsId\`), PRIMARY KEY (\`storiesId\`, \`authorsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evergarden\`.\`stories_genres_genres\` (\`storiesId\` int NOT NULL, \`genresId\` int NOT NULL, INDEX \`IDX_05e8133f06dacb443d546448da\` (\`storiesId\`), INDEX \`IDX_a7a38a093358fb40cb415dbf94\` (\`genresId\`), PRIMARY KEY (\`storiesId\`, \`genresId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`histories\` ADD CONSTRAINT \`FK_a3625c105cd19107da0a12144ca\` FOREIGN KEY (\`storyId\`) REFERENCES \`evergarden\`.\`stories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`histories\` ADD CONSTRAINT \`FK_0c320e3e56813ce3b175add32ba\` FOREIGN KEY (\`userId\`) REFERENCES \`evergarden\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`chapters\` ADD CONSTRAINT \`FK_31eee0bf1ffa9a42d06d8dad2e6\` FOREIGN KEY (\`createdById\`) REFERENCES \`evergarden\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`chapters\` ADD CONSTRAINT \`FK_89f68ec0e0c159e03dd265e7795\` FOREIGN KEY (\`updatedById\`) REFERENCES \`evergarden\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`chapters\` ADD CONSTRAINT \`FK_2720e441e621b26246278c0ea4c\` FOREIGN KEY (\`storyId\`) REFERENCES \`evergarden\`.\`stories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` ADD CONSTRAINT \`FK_5bba9a5881536331e952bcf3ec1\` FOREIGN KEY (\`createdById\`) REFERENCES \`evergarden\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` ADD CONSTRAINT \`FK_960d9dac867fe6f2a250cde97cb\` FOREIGN KEY (\`updatedById\`) REFERENCES \`evergarden\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_authors_authors\` ADD CONSTRAINT \`FK_4e4a3ad022dd70ee4ba66799567\` FOREIGN KEY (\`storiesId\`) REFERENCES \`evergarden\`.\`stories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_authors_authors\` ADD CONSTRAINT \`FK_65e035585176d24109dc7475ada\` FOREIGN KEY (\`authorsId\`) REFERENCES \`evergarden\`.\`authors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_genres_genres\` ADD CONSTRAINT \`FK_05e8133f06dacb443d546448dae\` FOREIGN KEY (\`storiesId\`) REFERENCES \`evergarden\`.\`stories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_genres_genres\` ADD CONSTRAINT \`FK_a7a38a093358fb40cb415dbf942\` FOREIGN KEY (\`genresId\`) REFERENCES \`evergarden\`.\`genres\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_genres_genres\` DROP FOREIGN KEY \`FK_a7a38a093358fb40cb415dbf942\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_genres_genres\` DROP FOREIGN KEY \`FK_05e8133f06dacb443d546448dae\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_authors_authors\` DROP FOREIGN KEY \`FK_65e035585176d24109dc7475ada\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories_authors_authors\` DROP FOREIGN KEY \`FK_4e4a3ad022dd70ee4ba66799567\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` DROP FOREIGN KEY \`FK_960d9dac867fe6f2a250cde97cb\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`stories\` DROP FOREIGN KEY \`FK_5bba9a5881536331e952bcf3ec1\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`chapters\` DROP FOREIGN KEY \`FK_2720e441e621b26246278c0ea4c\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`chapters\` DROP FOREIGN KEY \`FK_89f68ec0e0c159e03dd265e7795\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`chapters\` DROP FOREIGN KEY \`FK_31eee0bf1ffa9a42d06d8dad2e6\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`histories\` DROP FOREIGN KEY \`FK_0c320e3e56813ce3b175add32ba\``);
        await queryRunner.query(`ALTER TABLE \`evergarden\`.\`histories\` DROP FOREIGN KEY \`FK_a3625c105cd19107da0a12144ca\``);
        await queryRunner.query(`DROP INDEX \`IDX_a7a38a093358fb40cb415dbf94\` ON \`evergarden\`.\`stories_genres_genres\``);
        await queryRunner.query(`DROP INDEX \`IDX_05e8133f06dacb443d546448da\` ON \`evergarden\`.\`stories_genres_genres\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`stories_genres_genres\``);
        await queryRunner.query(`DROP INDEX \`IDX_65e035585176d24109dc7475ad\` ON \`evergarden\`.\`stories_authors_authors\``);
        await queryRunner.query(`DROP INDEX \`IDX_4e4a3ad022dd70ee4ba6679956\` ON \`evergarden\`.\`stories_authors_authors\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`stories_authors_authors\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c64b3df09e6774438aeca7e0b\` ON \`evergarden\`.\`authors\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`authors\``);
        await queryRunner.query(`DROP INDEX \`IDX_18e913d264452630f78e9209e8\` ON \`evergarden\`.\`stories\``);
        await queryRunner.query(`DROP INDEX \`IDX_6f534ae2896f60a912f74b5599\` ON \`evergarden\`.\`stories\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`stories\``);
        await queryRunner.query(`DROP INDEX \`IDX_7f34072feacf768b64cbc505a0\` ON \`evergarden\`.\`chapters\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`chapters\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`evergarden\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_1403ddb5a860084e25b727991f\` ON \`evergarden\`.\`histories\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`histories\``);
        await queryRunner.query(`DROP INDEX \`IDX_f105f8230a83b86a346427de94\` ON \`evergarden\`.\`genres\``);
        await queryRunner.query(`DROP TABLE \`evergarden\`.\`genres\``);
    }

}
