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
                script {
                    echo 'Triggering PR test job in folder...'

                    def result = build job: 'pr_test', wait: true, propagate: false

                    echo "Triggered job finished with status: ${result.result}"

                    if (result.result == 'SUCCESS') {
                        echo '✅ PR job passed.'
                    } else {
                        echo '❌ PR job failed.'
                        error("Stopping pipeline because PR job failed.")
                    }
                }
            }
        }

        stage('Trigger Deploy Jobs') {
            when {
                branch 'main'
            }
            steps {
                echo 'Running deploy jobs...'
                build job: 'helath-check', wait: true
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
