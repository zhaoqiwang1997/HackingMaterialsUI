source venv/bin/activate
echo "Starting Celery Worker"
celery -A src.main.celery worker -P threads --loglevel=info --concurrency=4 -n worker1@ha --detach
# celery -A src.main.celery worker -P threads --loglevel=info --concurrency=4 -n worker2@ha --detach
# celery -A src.main.celery worker -P threads --loglevel=info --concurrency=4 -n worker3@ha --detach
# celery -A src.main.celery worker -P threads --loglevel=info --concurrency=4 -n worker4@ha --detach
docker compose --profile backend --profile frontend up -d 