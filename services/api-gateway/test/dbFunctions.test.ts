import  {describe,
         expect,
         test,
         beforeAll,
         afterAll,
         expectTypeOf,
         assert,
} from "vitest";

import {
        DatabaseResult,
        queryHandler,
        getAllSightings,
        insertSighting,
        getDbConnectionFromPool,
        tSightings,
        Sighting,
        getSightingsWithConditions,
} from '../src/db/DbFunctions';


const OLD_DATE = new Date('2024-03-10T00:00:00Z');
const NEW_DATE = new Date('2025-03-10T00:00:00Z');
const INTERMEDIATE_DATE = new Date('2024-09-10T00:00:00Z');

let TEST_UUID_1: string;
let TEST_UUID_2: string;

beforeAll(async () => {
    const params1 = {
        species: 'mock_species',
        latitude: 1,
        longitude: 0,
        time: NEW_DATE
    }
    const res1 = await queryHandler(insertSighting, params1)
    if (isTypeSighting(res1)){
        TEST_UUID_1 = res1.id as string;
    }

    const params2 = {
        species: 'tuna',
        latitude: 0,
        longitude: 1,
        time: OLD_DATE
    }

    const res2 = await queryHandler(insertSighting, params2)
    if (isTypeSighting(res2)){
        TEST_UUID_2 = res2.id as string;
    }
});

afterAll(async () => {
    await deleteSighting(TEST_UUID_1);
    await deleteSighting(TEST_UUID_2);
})

async function deleteSighting(idToDelete: string) {
    const connection = await getDbConnectionFromPool();
    await connection.deleteFrom(tSightings).where(
        tSightings.id.equals(idToDelete)
    ).executeDelete();
}

function isTypeSighting(sighting: DatabaseResult): sighting is Sighting{
    if (sighting === undefined || sighting === null){
        throw new TypeError('Sighting not of the correct type')
    }
    return true
}

function isTypeSightings(sightings: DatabaseResult): sightings is Array<Sighting>{
    if (sightings === undefined || sightings === null){
        throw new TypeError('Sightings not of the correct type, must be Array<Sighting>')
    }
    return Array.isArray(sightings)
}

function isTypeArrayWithNull(sighting: DatabaseResult): sighting is Array<null>{
    return Array.isArray(sighting) && sighting[0] === null;
}

describe('getSightingWithConditions()', () => {
    test('Valid input parameters, all parameters', async () => {
        // Arrange
        const params = {
             'id': TEST_UUID_1,
             'specices': 'mock_species',
             'latitude': 0,
             'longitude': 0,
             'fromTime': INTERMEDIATE_DATE,
             'toTime': NEW_DATE
        }

        // Act
        const sightings = await queryHandler(getSightingsWithConditions, params);

        // Assert
        if (isTypeSightings(sightings)){
            expect(sightings[0].species).toEqual('mock_species');
            expect(sightings.length).toEqual(1);
        }
    })

    test('No input parameters', async () => {
        // Act
        const sightings = await queryHandler(getSightingsWithConditions, {});

        // Assert
        if (isTypeSightings(sightings)){
            expect(sightings.length).toBeGreaterThanOrEqual(2)
            assert.hasAllKeys(sightings[0], ['id', 'species', 'time', 'longitude', 'latitude'])
        }
    })

    test('One input parameter: id', async () => {
        // Arrange
        const params = {'id': TEST_UUID_1}

        // Act
        const sightings = await queryHandler(getSightingsWithConditions, params);

        // Assert
        if (isTypeSightings(sightings)){
            expect(sightings.length).toEqual(1);
            assert.hasAllKeys(sightings[0], ['id', 'species', 'time', 'longitude', 'latitude']);
        }
    })

    test('One input parameter: species', async () => {
        // Arrange
        const params = {'species': 'tuna'}

        // Act
        const sightings = await queryHandler(getSightingsWithConditions, params);

        // Assert
        if (isTypeSightings(sightings)){
            expect(sightings[0].species).toEqual('tuna');
            assert.hasAllKeys(sightings[0], ['id', 'species', 'time', 'longitude', 'latitude']);
        }
    })

    test('One input parameter: fromTime', async () => {
        // Arrange
        const params = {'fromTime': INTERMEDIATE_DATE}

        // Act
        const sightings = await queryHandler(getSightingsWithConditions, params);

        // Assert
        if (isTypeSightings(sightings)){
            const ids = sightings.map(({ id }) => id);
            expect(ids).not.toContain(TEST_UUID_2);
            assert.hasAllKeys(sightings[0], ['id', 'species', 'time', 'longitude', 'latitude']);
        }
    })

    test('One input parameter: toTime', async () => {
        // Arrange
        const params = {'toTime': INTERMEDIATE_DATE}

        // Act
        const sightings = await queryHandler(getSightingsWithConditions, params);

        // Assert
        if (isTypeSightings(sightings)){
            const ids = sightings.map(({ id }) => id);
            expect(ids).not.toContain(TEST_UUID_1);
            assert.hasAllKeys(sightings[0], ['id', 'species', 'time', 'longitude', 'latitude']);
        }
    })
})

describe('getAllSightings()', () => {
    test('getAllSightings', async () => {
        // Act
        const sightings = await queryHandler(getAllSightings);

        // Assert
        if (isTypeSightings(sightings)){
            expectTypeOf(sightings).toBeArray();
            expectTypeOf(sightings[0].time).toEqualTypeOf<Date>();
        }
    })
})

describe('insertSighting()', () => {
    test('Valid parameter input', async () => {
        // Arrange
        const params = {
            'species': 'pinniped',
            'latitude': 0,
            'longitude': 0
        }
        // Act
        const sighting = await queryHandler(insertSighting, params);

        // Assert
        if (isTypeSighting(sighting)){
            expectTypeOf(sighting.id).toEqualTypeOf<string>();
            expectTypeOf(sighting.species).toEqualTypeOf<string>();
            expectTypeOf(sighting.time).toEqualTypeOf<Date>();
            expectTypeOf(sighting.latitude).toEqualTypeOf<number>();
            expectTypeOf(sighting.longitude).toEqualTypeOf<number>();

            // Clean-up
            await deleteSighting(sighting.id as string);
        }
    })

    test('Valid parameter input, with time', async () => {
        // Arrange
        const params = {
            'species': 'porpoise',
            'latitude': 0,
            'longitude': 0,
            'time': OLD_DATE
        }

        // Act
        const sighting = await queryHandler(insertSighting, params);

        if (isTypeSighting(sighting)){
            // Assert
            expect(sighting.time).toEqual(OLD_DATE);

            // Clean-up
            console.log(sighting);
            await deleteSighting(sighting.id as string);
        }
    })

    test('Invalid parameter input, missing property', async () => {
        // Arrange
        const params = {
            'species': 'mock_species',
            'latitude': 0
        }

        // Act
        const sighting = await queryHandler(insertSighting, params);

        // Assert
        if (isTypeArrayWithNull(sighting)){
            expectTypeOf(sighting).toBeArray();
            expectTypeOf(sighting[0]).toBeNull();
        }
    })

    test('Invalid parameter input, non-existing species enum value', async () => {
        // Arrange
        const params = {
            'species': 'prutt',
            'latitude': 0,
            'longitude': 0
        }

        // Act
        const sighting = await queryHandler(insertSighting, params);

        // Assert
        if (isTypeArrayWithNull(sighting)){
            expectTypeOf(sighting).toBeArray();
            expectTypeOf(sighting[0]).toBeNull();
        }
    })

    test('Invalid parameter input, invalid species input type', async () => {
        // Arrange
        const params = {
            'species': 1,
            'latitude': 0,
            'longitude': 0
        }

        // Act
        const sighting = await queryHandler(insertSighting, params);

        // Assert
        if (isTypeArrayWithNull(sighting)){
            expectTypeOf(sighting).toBeArray();
            expectTypeOf(sighting[0]).toBeNull();
        }
    })
});