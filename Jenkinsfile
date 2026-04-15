pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        DOTNET_CLI_TELEMETRY_OPTOUT = '1'
        DOTNET_NOLOGO = '1'
        CONFIGURATION = 'Release'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Restore & Build') {
            steps {
                bat '''
                    dotnet restore Restore.sln
                    dotnet build Restore.sln --configuration "%CONFIGURATION%" --no-restore
                '''
            }
        }

        stage('Publish API') {
            steps {
                bat '''
                    dotnet publish API\API.csproj --configuration "%CONFIGURATION%" --no-build --output artifacts\api
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'artifacts/api/**', fingerprint: true
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
