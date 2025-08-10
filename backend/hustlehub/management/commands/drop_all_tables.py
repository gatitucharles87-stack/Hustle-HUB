from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Drops all tables in the current database schema.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('WARNING: This will drop ALL tables in your current database schema. Data will be lost!'))
        confirm = input("Type 'yes' to confirm: ")
        if confirm != 'yes':
            self.stdout.write(self.style.ERROR('Operation cancelled.'))
            return

        with connection.cursor() as cursor:
            # Get a list of all tables in the current schema
            # This query is specific to PostgreSQL
            cursor.execute("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public' AND tableowner = current_user;
            """)
            tables = [row[0] for row in cursor.fetchall()]

            # Drop each table
            for table in tables:
                self.stdout.write(f"Dropping table: {table}")
                cursor.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE;')
            self.stdout.write(self.style.SUCCESS('Successfully dropped all tables.'))
