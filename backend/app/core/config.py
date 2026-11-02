from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Salt-Twin Pamekasan Digital Twin"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./salt_twin.db"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
    DEFAULT_REGENCY: str = "Pamekasan"
    DEFAULT_LATITUDE: float = -7.16
    DEFAULT_LONGITUDE: float = 113.48

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [i.strip() for i in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

