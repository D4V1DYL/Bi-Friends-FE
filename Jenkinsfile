pipeline {
    agent any

    environment {
        IMAGE_NAME = "bi-friends-fe"
        CONTAINER_NAME = "react-vite-container"
        PORT = "80"
        DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1348391496319111241/Q2-Y2zNTe3MC-PlAsziHoKhD6pWdWb6ZPcLoLqtkUq4f5J5CmmYqcR0uIGddt7ajGVux"
        JENKINS_URL = "https://jenkins.bifriends.my.id/"
        GITHUB_REPO_URL = "https://github.com/D4V1DYL/Bi-Friends-FE/commit/"
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

                    // Remove 'origin/' prefix and '^0' suffix if present
                    branchName = branchName.replaceAll('^origin/', '').replaceAll('\\^0$', '')

                    echo "Current branch: ${branchName}"

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

        stage('Extract Commit Info') {
            steps {
                script {
                    env.GIT_COMMITTER = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    env.GIT_COMMIT_MESSAGE = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                    env.GIT_COMMIT = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                }
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
            script {
                def commitUrl = "${GITHUB_REPO_URL}${env.GIT_COMMIT}"
                def payload = """
                {
                    "username": "BiFriends Bot - Jenkins",
                    "avatar_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png",
                    "embeds": [
                        {
                            "title": "✅ Deployment Successful!",
                            "description": "**Job:** BiFriends-FE\\n**Build:** #${env.BUILD_NUMBER}\\n**Deployed By:** ${env.GIT_COMMITTER}\\n**Commit:** [${env.GIT_COMMIT_MESSAGE}](${commitUrl})",
                            "color": 3066993,
                            "url": "${JENKINS_URL}job/BiFriends-FE/${env.BUILD_NUMBER}/",
                            "footer": {
                                "text": "BiFriends Deployment",
                                "icon_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png"
                            },
                            "timestamp": "${new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))}"
                        }
                    ]
                }
                """
                sh """
                curl -H "Content-Type: application/json" -X POST -d '${payload}' $DISCORD_WEBHOOK_URL
                """
            }
        }
        failure {
            script {
                def commitUrl = "${GITHUB_REPO_URL}${env.GIT_COMMIT}"
                def payload = """
                {
                    "username": "BiFriends Bot - Jenkins",
                    "avatar_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png",
                    "embeds": [
                        {
                            "title": "❌ Deployment Failed!",
                            "description": "**Job:** BiFriends-FE\\n**Build:** #${env.BUILD_NUMBER}\\n**Deployed By:** ${env.GIT_COMMITTER}\\n**Commit:** [${env.GIT_COMMIT_MESSAGE}](${commitUrl})",
                            "color": 15158332,
                            "url": "${JENKINS_URL}job/BiFriends-FE/${env.BUILD_NUMBER}/",
                            "footer": {
                                "text": "BiFriends Deployment",
                                "icon_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png"
                            },
                            "timestamp": "${new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))}"
                        }
                    ]
                }
                """
                sh """
                curl -H "Content-Type: application/json" -X POST -d '${payload}' $DISCORD_WEBHOOK_URL
                """
            }
        }
    }
}
