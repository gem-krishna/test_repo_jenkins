// pipeline {
//     agent any

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 echo 'Installing npm packages...'
//                 sh 'npm install'
//             }
//         }

//         stage('Run Tests') {
//             steps {
//                 echo 'Running tests...'
//                 sh 'npm test'
//             }
//         }
//     }

//     post {
//         success {
//             echo '✅ Tests passed!'
//         }

//         failure {
//             echo '❌ Tests failed!'
//         }
//     }
// }


pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('Trigger PR Jobs') {
            when {
                changeRequest() // Only for PRs
            }
            steps {
                echo 'Running PR-specific jobs...'
                build job: 'test', wait: true
            }
        }

        stage('Trigger Deploy Jobs') {
            when {
                branch 'main' // Only after merging to main
            }
            steps {
                echo 'Running deploy jobs...'
                build job: 'pr_test', wait: true
                // Add more deploy jobs here if needed
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
