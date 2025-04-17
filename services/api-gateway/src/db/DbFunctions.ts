import { dbConnectionPool } from "./DbConnectionPool";
import { PgPoolQueryRunner } from "ts-sql-query/queryRunners/PgPoolQueryRunner";
import { PostgreSqlConnection } from "ts-sql-query/connections/PostgreSqlConnection";
import { Table } from "ts-sql-query/Table";
import { ConsoleLogQueryRunner } from "ts-sql-query/queryRunners/ConsoleLogQueryRunner";

export class DBConnection extends PostgreSqlConnection<'DbConnection'>{}

export async function getDbConnectionFromPool() {
    return new DBConnection(new ConsoleLogQueryRunner(new PgPoolQueryRunner(dbConnectionPool)))
}

export type Sighting = {id: string, species: string, time: Date, latitude: number, longitude: number}

export type DatabaseResult = Array<Sighting> | Sighting | Array<null> | null
export type InsertSightingParameters = {species: string, latitude: number, longitude: number, time?: Date}
type GetSightingsParameters = {id?: string, species?: string, fromTime?: Date, toTime?: Date}
type QueryParameters = InsertSightingParameters | GetSightingsParameters

export async function queryHandler(
    dbFunction: (dbConnection: DBConnection, parameters?: QueryParameters) => Promise<DatabaseResult>,
    parameters?: QueryParameters
): Promise<DatabaseResult> {
    const connection = await getDbConnectionFromPool();
    await connection.beginTransaction();
    let res: DatabaseResult = [];
    try {
        if (parameters) {
            res = await dbFunction(connection, parameters);
        } else {
            res = await dbFunction(connection);
        }
        connection.commit();
    } catch (exception) {
        connection.rollback();
        console.log(exception);
    }
    return res;

}

function isInsertSightingParameters(params: unknown): params is InsertSightingParameters {
    return (
        typeof params === 'object' &&
        params !== null &&
        typeof (params as InsertSightingParameters).species === 'string' &&
        typeof (params as InsertSightingParameters).latitude === 'number' &&
        typeof (params as InsertSightingParameters).longitude=== 'number' &&
        (
            (params as InsertSightingParameters).time === undefined ||
            (params as InsertSightingParameters).time instanceof Date
        )
    );
}

function isGetSightingsParameters(params: unknown): params is GetSightingsParameters {
    return (
        typeof params === 'object' &&
        params !== null &&
        ( // id
            (params as GetSightingsParameters).id === undefined ||
            typeof (params as GetSightingsParameters).id === "string"
        ) ||
        ( // species
            (params as GetSightingsParameters).species === undefined ||
            typeof (params as GetSightingsParameters).species === "string"
        ) ||
        (
            (params as GetSightingsParameters).fromTime === undefined ||
            (params as GetSightingsParameters).fromTime instanceof Date
        ) ||
        (
            (params as GetSightingsParameters).toTime === undefined ||
            (params as GetSightingsParameters).toTime instanceof Date
        )
    )
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
    parameters?: QueryParameters
): Promise<DatabaseResult> {
    if (!isGetSightingsParameters(parameters)) {
        throw new Error('Invalid parameters for getSightingsWithConditions');
      }
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
        .executeSelectMany() as DatabaseResult;

    return sightings ;
}

export async function getAllSightings(dbConnection: DBConnection): Promise<DatabaseResult> {
    const sightings = await dbConnection
        .selectFrom(tSightings)
        .select({
            "id": tSightings.id,
            "species": tSightings.species,
            "time": tSightings.time,
            "latitude": tSightings.latitude,
            "longitude": tSightings.longitude
        })
        .executeSelectMany() as DatabaseResult;

    return sightings;
}

export async function insertSighting(
    dbConnection: DBConnection,
    parameters?: QueryParameters
): Promise<DatabaseResult> {
    if (!isInsertSightingParameters(parameters)) {
        throw new Error('Invalid parameters for insertSighting');
      }

    const sighting = await dbConnection.insertInto(tSightings).set({
            species: parameters.species,
            latitude: parameters.latitude,
            longitude: parameters.longitude,
        })
        .setIfValue({time: parameters.time})
        .returning({
            id: tSightings.id,
            species: tSightings.species,
            time: tSightings.time,
            latitude: tSightings.latitude,
            longitude: tSightings.longitude,
        })
        .executeInsertOne() as DatabaseResult;

    return sighting;
}