import os
from dataclasses import dataclass
from functools import lru_cache
from dotenv import load_dotenv

# Load .env if present
load_dotenv()


def _get_bool(name: str, default: bool = False) -> bool:
    val = os.getenv(name)
    if val is None:
        return default
    return val.strip().lower() in {"1", "true", "yes", "on"}


@dataclass
class Settings:
    env: str = os.getenv("ENV", "development")
    disable_auth: bool = _get_bool("DISABLE_AUTH", True)

    # Mongo
    mongo_uri: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db: str = os.getenv("MONGO_DB", "veritrust")

    # Cloudinary
    cloudinary_cloud_name: str | None = os.getenv("CLOUDINARY_CLOUD_NAME")
    cloudinary_api_key: str | None = os.getenv("CLOUDINARY_API_KEY")
    cloudinary_api_secret: str | None = os.getenv("CLOUDINARY_API_SECRET")

    # Hardhat RPC (local)
    hardhat_rpc_url: str = os.getenv("HARDHAT_RPC_URL", "http://127.0.0.1:8545")

    # JWT config for Clerk (optional placeholder)
    jwt_issuer: str | None = os.getenv("JWT_ISSUER")
    jwt_audience: str | None = os.getenv("JWT_AUDIENCE")
    jwt_jwks_url: str | None = os.getenv("JWT_JWKS_URL")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
