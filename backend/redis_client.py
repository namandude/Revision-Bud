
# from upstash_redis import Redis


# redis_client.set("foo", "bar")
# value = redis_client.get("foo")
from upstash_redis import Redis
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get URL and token from environment
UPSTASH_URL = os.getenv("UPSTASH_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_TOKEN")

# Initialize Redis client
redis_client = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)

# Test set and get
redis_client.set("foo", "bar")
value = redis_client.get("foo")

print(value)
