import { MigrationInterface, QueryRunner } from 'typeorm'

export class migration1658828757275 implements MigrationInterface {
  name = 'migration1658828757275'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`financial-operations\` (\`id\` varchar(255) NOT NULL, \`operationType\` varchar(255) NOT NULL, \`fromAccountNumber\` varchar(255) NOT NULL, \`toAccountNumber\` varchar(255) NOT NULL, \`value\` float NOT NULL, \`status\` varchar(255) NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`financial-operations\``)
  }
}
