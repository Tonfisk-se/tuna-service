/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable(
        tablename='sightings',
        columns={
            id : {
                type: 'uuid',
                notNull : true,
                default: pgm.func('gen_random_uuid()'),
                primaryKey: true
            },
            species: {
                type: 'species',
                notNull: true
            },
            time: {
                type: 'timestamptz',
                notNull: true,
                default: pgm.func('current_timestamp(0)')
            },
            latitude: {
                type: 'numeric',
                notNull: true

            },
            longitude: {
                type: 'numeric',
                notNull: true
            }
        },
        options={
            comment:'Table storing all unique sightings per time and position'
        }

    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('sightings');
};