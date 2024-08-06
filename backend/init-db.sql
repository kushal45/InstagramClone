DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT 1
      FROM   pg_database
      WHERE  datname = 'instagram'
   ) THEN
      PERFORM 'CREATE DATABASE instagram';
   END IF;
END
$$;