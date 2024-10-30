# NoSQLBenchmark, Docker, and MongoDB Installation Guide

This guide explains how to install NoSQLBench, Docker, and MongoDB, and how to run a basic MongoDB test using NoSQLBench.

## Prerequisites
- Be sure to log a clean WSL Ubuntu Install: 
    ```bash
    wsl -d <Distro Name>
    ```
    E.g.,
    ```bash
    wsl -d UbuntuMongo
    ```

- Once the distro launches, be sure to log into your admin user: 
    ```bash
    su - <User Name>
    ```
    E.g.,
    ```bash
    su - walrus
    ```

## Step 1: Install NoSQLBench, Docker, and MongoDB
Run the following command to install NoSQLBench, Docker, and MongoDB:

```bash
zsh install_p1.sh 2>&1 | tee -a no_bench_install.log
```

### What the script does:
1. Updates the system and installs required packages:
   - OpenJDK 21
   - NoSQLBench 5 (CLI and JAR)
   - Docker

2. **Important**: After the script finishes, you will need to **logout and log back in** to apply Docker group permissions.
    ```bash
    logout
    ```

3. After logging back in, complete the MongoDB setup by running:
    ```bash
    zsh install_p2.sh 2>&1 | tee -a no_bench_install.log
    ```

This will install and run MongoDB in Docker, as well as run a basic test using Docker.

## Step 2: Test MongoDB

To verify that MongoDB is running and the test data was inserted correctly, follow these steps:

1. **Test if MongoDB is running** by accessing the MongoDB shell:
    ```bash
    docker exec -it mongodb mongosh
    ```

2. To exit the MongoDB shell:
    ```bash
    exit
    ```

## Step 3: Run a Simple MongoDB Test Using NoSQLBench

1. (Option 1) You can run the test script:
    ```bash
    zsh run_test.sh 2>&1 | tee -a no_bench_run.log
    ```

2. (Option 2) You can run a basic MongoDB benchmark using NoSQLBench with the following command:
    ```bash
    ./nb5 ~/activities/mongodb_basic.yaml
    ```

    This will execute the benchmark against the MongoDB instance running inside Docker.

    1. **Test if the data was actually updated** by accessing the MongoDB shell:
        ```bash
        docker exec -it mongodb mongosh
        ```

    2. In the MongoDB shell, use the following commands to check the data in the `test` database:
        ```javascript
        use test;
        db.keyvalue.count();
        db.keyvalue.find().pretty();
        ```

    3. To exit the MongoDB shell:
        ```bash
        exit
        ```

## Additional Commands

### Starting and Stopping MongoDB
If you need to stop or start the MongoDB container, use the following commands:

- **Start MongoDB**:
    ```bash
    docker start mongodb
    ```

- **Stop MongoDB**:
    ```bash
    docker stop mongodb
    ```

### View MongoDB Logs
To view the logs of the MongoDB container, run:

```bash
docker logs mongodb
```

## Notes:
- Ensure Docker is installed and running before executing testing commands.
- Make sure to log out and log back in after adding your user to the Docker group to avoid permission issues.
