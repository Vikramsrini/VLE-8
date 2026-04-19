pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'myapp'
    }
    
    stages {
        stage('Build Blue Version') {
            steps {
                sh '''
                    cd app
                    docker build -t ${DOCKER_IMAGE}:v1 .
                '''
            }
        }
        
        stage('Build Green Version') {
            steps {
                sh '''
                    cd app
                    cp index-green.html index.html
                    docker build -t ${DOCKER_IMAGE}:v2 .
                    cp index.html.backup index.html
                '''
            }
        }
        
        stage('Deploy Blue') {
            steps {
                sh '''
                    echo "Blue deployment - Docker image ${DOCKER_IMAGE}:v1 built successfully"
                    docker images | grep ${DOCKER_IMAGE}
                '''
            }
        }
        
        stage('Deploy Green') {
            steps {
                sh '''
                    echo "Green deployment - Docker image ${DOCKER_IMAGE}:v2 built successfully"
                    docker images | grep ${DOCKER_IMAGE}
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Blue-Green deployment completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
