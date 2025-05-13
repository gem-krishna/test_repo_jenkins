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


// pipeline {
//     agent any
//     triggers {
//         githubPush()
//     }
//     parameters {
//         string(name: 'ENV', defaultValue: '', description: 'Environment to deploy')
//         booleanParam(name: 'IS_CHILD', defaultValue: false, description: 'Internal flag to prevent re-trigger loop')
//     }
//     environment {
//         BASE_BRANCH = 'main'
//         UI_CHANGED = false
//         API_CHANGED = false
//     }
//     stages {
//         stage('Trigger Self Twice with Params demo') {
//             when {
//                 expression { return !params.IS_CHILD }
//             }
//             steps {
//                 script {
//                     // Run for both dev and qa
//                     build job: env.JOB_NAME, parameters: [
//                         string(name: 'ENV', value: 'dev'),
//                         booleanParam(name: 'IS_CHILD', value: true)
//                     ]

//                     build job: env.JOB_NAME, parameters: [
//                         string(name: 'ENV', value: 'qa'),
//                         booleanParam(name: 'IS_CHILD', value: true)
//                     ]
//                 }
//             }
//         }

//        stage('Actual Work') {
//     when {
//         expression { return params.IS_CHILD }
//     }
//     steps {
//         script {
//             checkout scm
// sh "git fetch origin ${BASE_BRANCH}"
// sh "git branch -a" // Optional: just for debugging

// // Now perform diff
// def diffFiles = sh(script: "git diff --name-only origin/${BASE_BRANCH}...", returnStdout: true).trim()

//             echo "Changed files:\n${diffFiles}"

//             def changedFiles = diffFiles.split("\n")

//             def uiChanged = changedFiles.any { it.startsWith("ui/") }
//             def apiChanged = changedFiles.any { it.startsWith("api/") }

//             if (uiChanged) {
//                 echo "UI changes detected. Triggering ui-job..."
//                 build job: 'ui_job', wait : true
//             }

//             if (apiChanged) {
//                 echo "API changes detected. Triggering api-job..."
//                 build job: 'api-job', wait : true
//             }

//             if (!uiChanged && !apiChanged) {
//                 echo "No changes detected in UI or API folders. Nothing to trigger."
//             }
//         }
//     }
//     }
//     }
// }


//try -1 

pipeline {
    agent any
    triggers {
        githubPush() // Trigger on PR events (adjust based on your GitHub plugin setup)
    }
    parameters {
        string(name: 'ENV', defaultValue: '', description: 'Environment to deploy')
        string(name: 'COMPONENT', defaultValue: '', description: 'Component to build (api/ui)')
        booleanParam(name: 'IS_CHILD', defaultValue: false, description: 'Internal flag to prevent re-trigger loop')
    }
    stages {
        stage('Check Changed Components') {
            when {
                expression { return !params.IS_CHILD }
            }
            steps {
                script {
                    // Checkout source code to access git history
                    checkout scm

                    sh 'git fetch origin main:refs/remotes/origin/main'

                    sh 'git branch -a'
                    
                    // Get target branch from PR (assuming GitHub plugin environment variables)
                    def targetBranch = env.CHANGE_TARGET ?: 'main'
                    
                    // Get list of changed files
                    def changedFiles = sh(
                        script: "git diff --name-only HEAD origin/${targetBranch}",
                        returnStdout: true
                    ).trim().split('\n')
                    
                    // Determine which components were changed
                    def changedComponents = [] as Set
                    changedFiles.each { file ->
                        if (file.startsWith('api/')) {
                            changedComponents.add('api')
                        } else if (file.startsWith('ui/')) {
                            changedComponents.add('ui')
                        }
                    }
                    
                    // Fallback if no components detected (remove if you want to skip)
                    if (changedComponents.isEmpty()) {
                        changedComponents = ['api', 'ui'] // Default to both if no changes detected
                        echo 'No component changes detected, triggering both components'
                    }
                    
                    // Trigger jobs for each changed component and environment
                    def environments = ['dev', 'qa']
                    changedComponents.each { component ->
                        environments.each { envName ->
                            build job: env.JOB_NAME, parameters: [
                                string(name: 'ENV', value: envName),
                                string(name: 'COMPONENT', value: component),
                                booleanParam(name: 'IS_CHILD', value: true)
                            ]
                        }
                    }
                }
            }
        }
        
        stage('Run Component Deployment') {
            when {
                expression { return params.IS_CHILD }
            }
            steps {
                script {
                    echo "Running deployment for ${params.COMPONENT} to ${params.ENV}"
                    // Add your actual deployment logic here based on component and environment
                    if (params.COMPONENT == 'api') {
                        sh "echo 'Deploying API to ${params.ENV}'"
                        // Add API-specific deployment commands
                    } else if (params.COMPONENT == 'ui') {
                        sh "echo 'Deploying UI to ${params.ENV}'"
                        // Add UI-specific deployment commands
                    }
                }
            }
        }
    }
}