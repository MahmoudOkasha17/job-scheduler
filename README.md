# Task-Scheduler

This document outlines a job-scheduler microservice that is horizontally scalable and can be used to schedule jobs that can be run at a later time.

# Setup

## Environment Variables

1. Copy `.env.example`, and rename to `.env`
2. Configure newly copied `.env` file

## How To Run (Development)

1. Run `docker compose build`
2. Run `docker compose up` after the build succeeds.
3. Use Swagger UI to interact with the API at `http://localhost:3000/job-schedular/docs`

## Adding extra path aliases

If you add extra folders to this template and would like to use them with aliases, then go through following:

1. Go into `tsconfig.json`
2. Add extra paths inside of `{ paths: ... }` (for tsconfig-paths)

# Design Choices

To have this microservice horizontally scalable without the need for a job distribution service (any mutex) or message queues, I decided to use the database to store the jobs and a redis to lock the jobs being worked on so no two instances of the microservice will work on the same job at the same time.

In case of instance failure, the lock will be released by other instances after a specified duration and then be worked on by another instance , to do that i used redis `setnx` to lock jobs and use its atomic nature to ensure that only one instance can lock a job at a time [Link to file](src/modules/shared/helper-services/process-jobs.service.ts).
