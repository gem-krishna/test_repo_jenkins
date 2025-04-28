pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = 'github_access_token' // Or whatever you named the credential
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/gem-krishna/test_repo_jenkins.git',
                    credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        success {
            echo 'Build and tests succeeded!'
        }
        failure {
            echo 'Build or tests failed.'
        }
    }
}
