# Makefile for running PostgreSQL in a Docker container

# Define variables
HOST_PORT := 5432
CONTAINER_PORT := 5432
IMAGE_NAME := tuna_db
CONTAINER_NAME := tuna_db

.PHONY: up down logs

# Start the PostgreSQL container
setup:
	docker pull $(IMAGE_NAME)
	docker network create tuna_network

build:
	docker build -t $(IMAGE_NAME) .

up: build
	docker run --name $(CONTAINER_NAME) \
	-e POSTGRES_USER=$(TUNA_DB_USER) \
	-e POSTGRES_PASSWORD=$(TUNA_DB_PASS) \
	-e POSTGRES_DB=$(TUNA_DB_NAME) \
	-p $(HOST_PORT):$(CONTAINER_PORT) \
	-d $(IMAGE_NAME)

# Stop and remove the PostgreSQL container
down:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# View the logs of the PostgreSQL container
logs:
	docker logs $(CONTAINER_NAME)

# Clean up dangling images (optional)
clean:
	docker rmi -f $$(docker images -f "dangling=true" -q) || true
