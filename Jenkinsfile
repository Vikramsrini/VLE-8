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
                    docker save ${DOCKER_IMAGE}:v1 | sudo k3s ctr images import -
                '''
            }
        }
        
        stage('Deploy Blue') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment-blue.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl rollout status deployment/myapp-blue
                '''
            }
        }
        
        stage('Build Green Version') {
            steps {
                sh '''
                    cd app
                    cp index-green.html index.html
                    docker build -t ${DOCKER_IMAGE}:v2 .
                    docker save ${DOCKER_IMAGE}:v2 | sudo k3s ctr images import -
                    git checkout index.html
                '''
            }
        }
        
        stage('Deploy Green') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment-green.yaml
                    kubectl rollout status deployment/myapp-green
                '''
            }
        }
        
        stage('Switch Traffic to Green') {
            steps {
                input message: 'Switch traffic to Green environment?', ok: 'Switch'
                sh '''
                    kubectl patch service myapp-service -p '{"spec":{"selector":{"color":"green"}}}'
                    echo "Traffic switched to Green!"
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Blue-Green deployment completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Rolling back to Blue...'
            sh '''
                kubectl patch service myapp-service -p '{"spec":{"selector":{"color":"blue"}}}'
            '''
        }
    }
}
