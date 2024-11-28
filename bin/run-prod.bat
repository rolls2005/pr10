@echo off
set DOCKERFILE=prod.Dockerfile
set DOCKER_TARGET=production
docker compose up --build