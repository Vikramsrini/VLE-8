pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'healthcare-app'
        IMAGE_TAG = 'latest'
    }
    
    stages {
        stage('Build') {
            steps {
                sh '''
                    cd app
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                '''
            }
        }
        
        stage('Security Scan') {
            steps {
                sh '''
                    trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    docker save ${DOCKER_IMAGE}:${IMAGE_TAG} | sudo k3s ctr images import -
                    kubectl apply -f k8s/rbac.yaml
                    kubectl apply -f k8s/secret.yaml
                    kubectl apply -f k8s/deployment-blue.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl rollout status deployment/myapp-blue
                '''
            }
        }
    }
    
    post {
        success {
            echo 'DevSecOps pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
