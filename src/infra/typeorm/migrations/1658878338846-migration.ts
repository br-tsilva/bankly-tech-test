import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1658878338846 implements MigrationInterface {
    name = 'migration1658878338846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`operations\` (\`id\` varchar(255) NOT NULL, \`transactionId\` varchar(255) NOT NULL, \`accountNumber\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`error\` varchar(255) NULL, \`value\` float NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`operations\` ADD CONSTRAINT \`FK_f3593938c35ffb5ffbddf7cc3e6\` FOREIGN KEY (\`transactionId\`) REFERENCES \`transactions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`operations\` DROP FOREIGN KEY \`FK_f3593938c35ffb5ffbddf7cc3e6\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
        await queryRunner.query(`DROP TABLE \`operations\``);
    }

}
