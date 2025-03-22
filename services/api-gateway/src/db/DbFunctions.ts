import { dbConnectionPool } from "./DbConnectionPool";
import { PgPoolQueryRunner } from "ts-sql-query/queryRunners/PgPoolQueryRunner";
import { PostgreSqlConnection } from "ts-sql-query/connections/PostgreSqlConnection";
import { Table } from "ts-sql-query/Table";
import { ConsoleLogQueryRunner } from "ts-sql-query/queryRunners/ConsoleLogQueryRunner";

export class DBConnection extends PostgreSqlConnection<'DbConnection'>{}

export async function getDbConnectionFromPool() {
    return new DBConnection(new ConsoleLogQueryRunner(new PgPoolQueryRunner(dbConnectionPool)))
}

export async function queryHandler(
    callback: (conn: DBConnection, parameters?: Record<string, unknown>) => Record<string, unknown> | Array<Record<string, unknown>>,
    parameters?: Record<string, unknown>
): Promise<Record<string, unknown> | Array<Record<string, unknown>>> {
    const connection = await getDbConnectionFromPool();
    await connection.beginTransaction();
    let res: Record<string, unknown> | Array<Record<string, unknown>> = [];
    try {
        if (parameters) {
            const typedParameters = parameters as { species: string, latitude: number, longitude: number }; // Type assertion
            res = await callback(connection, typedParameters);
        } else {
            res = await callback(connection);
        }
        connection.commit();
    } catch (exception) {
        connection.rollback();
        console.log(exception);
    }
    return res;

}

export const tSightings = new class TSightings extends Table<DBConnection, 'TSightings'> {
    id = this.optionalColumn('id', 'string');
    species = this.column('species', 'string');
    time = this.optionalColumn('time', 'localDateTime');
    latitude = this.column('latitude', 'double');
    longitude = this.column('longitude', 'double');
    constructor() {
        super('sightings'); // As in the database
    }
}();

export async function getSightingsWithConditions(
    dbConnection: DBConnection,
    parameters: { id?: string, species?: string, fromTime?: Date, toTime?: Date }
): Promise<Array<Record<string, unknown>>> {
    const sightings = await dbConnection
        .selectFrom(tSightings)
        .select({
            "id": tSightings.id,
            "species": tSightings.species,
            "time": tSightings.time,
            "latitude": tSightings.latitude,
            "longitude": tSightings.longitude
        })
        .where(tSightings.id.equalsIfValue(parameters.id))
        .and(tSightings.species.equalsIfValue(parameters.species))
        .and(tSightings.time.greaterOrEqualsIfValue(parameters.fromTime))
        .and(tSightings.time.lessOrEqualsIfValue(parameters.toTime))
        .executeSelectMany();

    return sightings;
}

export async function getAllSightings(dbConnection: DBConnection): Promise<Array<Record<string, unknown>>> {
    const sightings = await dbConnection
        .selectFrom(tSightings)
        .select({
            "id": tSightings.id,
            "species": tSightings.species,
            "time": tSightings.time,
            "latitude": tSightings.latitude,
            "longitude": tSightings.longitude
        })
        .executeSelectMany();

    return sightings;
}

export async function insertSighting(
    dbConnection: DBConnection,
    parameters: { species: string, latitude: number, longitude: number, time?: Date}
): Promise<Record<string, unknown> | undefined> {
    const sighting = await dbConnection.insertInto(tSightings).set({
            species: parameters.species,
            latitude: parameters.latitude,
            longitude: parameters.longitude,
        })
        .setIfValue({time: parameters.time})
        .returning({
            id: tSightings.id,
            species: tSightings.species,
            latitude: tSightings.latitude,
            time: tSightings.time,
            longitude: tSightings.longitude,
        })
        .executeInsertOne();

    return sighting;
}