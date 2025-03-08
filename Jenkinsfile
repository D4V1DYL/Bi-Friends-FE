pipeline {
    agent any

    environment {
        IMAGE_NAME = "bi-friends-fe"
        CONTAINER_NAME = "react-vite-container"
        PORT = "3000"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Check Branch') {
            steps {
                script {
                    def branchName = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()
                    
                    echo "Current branch: ${branchName}"
                    
                    if (branchName != 'main') {
                        error "Skipping deployment: Changes were pushed to '${branchName}', not 'main'."
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-ssh-key',
                    url: 'git@github.com:D4V1DYL/Bi-Friends-FE.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop and Remove Old Container') {
            steps {
                script {
                    def existingContainer = sh(script: "docker ps -aq -f name=$CONTAINER_NAME", returnStdout: true).trim()
                    if (existingContainer) {
                        echo "Stopping and removing old container: $CONTAINER_NAME"
                        sh "docker rm -f $CONTAINER_NAME"
                    } else {
                        echo "No existing container found with name: $CONTAINER_NAME"
                    }
                }
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d --name $CONTAINER_NAME -p $PORT:80 $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
