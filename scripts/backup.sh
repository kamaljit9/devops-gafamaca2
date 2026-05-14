#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
FILE_NAME="backup_${TIMESTAMP}.sql.gz"

echo "Starting database backup..."
pg_dump -h db -U ${DB_USER} ${DB_NAME} | gzip > ${BACKUP_DIR}/${FILE_NAME}

echo "Backup completed: ${FILE_NAME}"

# Keep only last 7 days
find ${BACKUP_DIR} -name "backup_*.sql.gz" -mtime +7 -delete
echo "Old backups cleaned up."
