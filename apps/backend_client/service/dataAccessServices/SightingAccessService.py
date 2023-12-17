from sqlite3 import Connection, Cursor

class SightingAccessService:

    def __init__(self, conn:Connection):
            self.__conn: Connection = conn
            self.__cursor: Cursor = conn.cursor()

    def getAllSightings(self):
        insert = ''' INSERT INTO sighting
              VALUES(123,"10","11","igar") '''
            
        self.__cursor.execute(insert)
        query = """
                    select * from sighting
                    """;
        return self.__cursor.execute(query).fetchall();