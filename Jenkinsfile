//test

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


//success for job trigger 
// pipeline {
//     agent any
//     triggers {
//         githubPush() // Use githubPush() if not using the PR plugin
//     }
//     parameters {
//         string(name: 'ENV', defaultValue: '', description: 'Environment to deploy')
//         booleanParam(name: 'IS_CHILD', defaultValue: false, description: 'Internal flag to prevent re-trigger loop')
//     }
//     stages {
//         stage('Trigger Self Twice with Params demo') {
//             when {
//                 expression { return !params.IS_CHILD } // Prevent infinite loop
//             }
//             steps {
//                 script {

//                     // def diff = sh "git diff origin/master origin/${git_branch}"
//                     // if(diff.contains("ui")){
//                     //

//                     // }
//                     // First run with ENV=dev
//                     build job: env.JOB_NAME, parameters: [
//                         string(name: 'ENV', value: 'dev'),
//                         booleanParam(name: 'IS_CHILD', value: true)
//                     ]

//                     // Second run with ENV=qa
//                     build job: env.JOB_NAME, parameters: [
//                         string(name: 'ENV', value: 'qa'),
//                         booleanParam(name: 'IS_CHILD', value: true)
//                     ]
//                 }
//             }
//         }

//         stage('Actual Work') {
//             when {
//                 expression { return params.IS_CHILD } // Only run in child execution
//             }
//             steps {
//                 echo "Running actual logic with ENV=${params.ENV}"
//                 sh "echo Deploying to ${params.ENV}"
//             }
//         }
//     }
// }




//api and ui seperately


pipeline {
    agent any
    triggers {
        githubPush()
    }
    parameters {
        string(name: 'ENV', defaultValue: '', description: 'Environment to deploy')
        booleanParam(name: 'IS_CHILD', defaultValue: false, description: 'Internal flag to prevent re-trigger loop')
    }
    environment {
        BASE_BRANCH = 'main'
        UI_CHANGED = false
        API_CHANGED = false
    }
    stages {
        stage('Trigger Self Twice with Params demo') {
            when {
                expression { return !params.IS_CHILD }
            }
            steps {
                script {
                    // Run for both dev and qa
                    build job: env.JOB_NAME, parameters: [
                        string(name: 'ENV', value: 'dev'),
                        booleanParam(name: 'IS_CHILD', value: true)
                    ]

                    build job: env.JOB_NAME, parameters: [
                        string(name: 'ENV', value: 'qa'),
                        booleanParam(name: 'IS_CHILD', value: true)
                    ]
                }
            }
        }

        stage('Actual Work') {
            when {
                expression { return params.IS_CHILD }
            }
            steps {
                script {
                    echo "Running actual logic with ENV=${params.ENV}"

                    // Fetch and diff from base branch
                    checkout scm
                    sh "git fetch origin ${BASE_BRANCH}:${BASE_BRANCH}"

                    def diffFiles = sh(script: "git diff --name-only origin/${BASE_BRANCH}...HEAD", returnStdout: true).trim()
                    echo "Changed files:\n${diffFiles}"

                    def changedFiles = diffFiles.split("\n")

                    def uiChanged = changedFiles.any { it.startsWith("ui/") }
                    def apiChanged = changedFiles.any { it.startsWith("api/") }

                    if (uiChanged) {
                        echo "UI changes detected. Triggering ui-job..."
                        build job: 'ui_job', wait : true
                    }

                    if (apiChanged) {
                        echo "API changes detected. Triggering api-job..."
                        build job: 'api-job', wait : true
                    }

                    if (!uiChanged && !apiChanged) {
                        echo "No changes detected in UI or API folders. Nothing to trigger."
                    }
                }
            }
        }
    }
}
