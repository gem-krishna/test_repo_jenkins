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

//         stage('Trigger PR Jobs') {
//             when {
//                 changeRequest() // Only for PRs
//             }
//             steps {
//                 script {
//                     echo 'Triggering PR test job in folder...'

//                     def result = build job: 'pr_test', wait: true, propagate: false

//                     echo "Triggered job finished with status: ${result.result}"

//                     if (result.result == 'SUCCESS') {
//                         echo '✅ PR job passed.'
//                     } else {
//                         echo '❌ PR job failed.'
//                         error("Stopping pipeline because PR job failed.")
//                     }
//                 }
//             }
//         }

//         stage('Trigger Deploy Jobs') {
//             when {
//                 branch 'main'
//             }
//             steps {
//                 echo 'Running deploy jobs...'
//                 build job: 'helath-check', wait: true
//             }
//         }
//     }

//     post {
//         success {
//             echo '✅ Pipeline succeeded!'
//         }
//         failure {
//             echo '❌ Pipeline failed!'
//         }
//     }
// }

pipeline {
    agent any

    environment{
        PR_TRIGGERED='false'
    }
        

   
    stages {
        // stage('Init') {
        //     steps {
        //         script {
        //             // Set a global variable
        //             PR_TRIGGERED='false'
        //         }
        //     }
        // }

        stage('Debug') {
            steps {
                echo "CHANGE_ID: ${env.CHANGE_ID ?: 'Not set'}"
                echo "PR_TRIGGERED: ${env.PR_TRIGGERED}"
            }
        }

        stage('Check PR Trigger') {
            steps {
                script {
                    // Check if the build was triggered by a PR
                    if (env.CHANGE_ID) {
                        env.PR_TRIGGERED='true'
                        echo "successfull trigger"
                    }else{
                        echo "trigger failed"
                    }
                    // env.xyz
                }
            }
        }

        stage('Run Jenkins Job 1') {
            when {
                expression { ${env.PR_TRIGGERED} == 'true' }
            }
            steps {
                script {
                    // Trigger Job 1
                    build job: 'job1_test_repo_jenkins', wait: false, propagate: false
                }
            }
        }

        // stage('Run Jenkins Job 2') {
        //     when {
        //         expression { PR_TRIGGERED }
        //     }
        //     steps {
        //         script {
        //             // Trigger Job 2
        //             build job: 'Job-2', wait: false, propagate: false
        //         }
        //     }
        // }

        stage('Other Jobs') {
            steps {
                // These jobs should run for all PRs, not just the specific ones
                echo "Other jobs go here"
            }
        }
    }
    post {
        success {
            // script {
                // This block will run only if both Job 1 and Job 2 are successful
            //     if (currentBuild.result == 'SUCCESS') {
            //         // Ensure both triggered jobs were successful
            //         def job1Success = currentBuild.getBuildByName('job1_test_repo_jenkins').result == 'SUCCESS'
            //         // def job2Success = currentBuild.getBuildByName('Job-2').result == 'SUCCESS'
                    
            //         if (job1Success) {
            //             echo "Both PR-triggered jobs succeeded. Proceeding with post-success actions."
            //             // Perform your post-success actions here, for example:
            //             // - Notify team
            //             // - Deploy to a staging environment
            //             // - Trigger another job
            //         } else {
            //             echo "One or both PR-triggered jobs failed. Skipping post-success actions."
            //         }
            //     }
            // }
            script{
                if(env.PR_TRIGGERED =='true'){
                    echo 'All Pr-Specific jobs are completed and passed'
                }
            }
        }
        failure {
            script {
                // Optional: You can handle failure cases here
                echo "Pipeline failed. Performing failure actions."
            }
        }
    }
}
