pipeline {
    agent any

    environment {
        IMAGE_NAME = "bi-friends-fe"
        CONTAINER_NAME = "react-vite-container"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Check Branch') {
            steps {
                script {
                    def branchName = sh(
                        script: 'git name-rev --name-only HEAD || git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()
                    
                    branchName = branchName.replaceAll('^origin/', '').replaceAll('\\^0$', '')
                    
                    echo "Current branch: ${branchName}"
                    
                    if (branchName != 'remotes/origin/main') {
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

        stage('Stop Old Container') {
            steps {
                script {
                    def running = sh(script: "docker ps -q -f name=$CONTAINER_NAME", returnStdout: true).trim()
                    if (running) {
                        sh "docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME"
                    }
                }
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d --name $CONTAINER_NAME -p 3000:80 $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo "Deployment Successful!"
        }
        failure {
            echo "Deployment Failed!"
        }
    }
}
