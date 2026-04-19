pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'myapp'
        KUBECONFIG = '/home/ubuntu/.kube/config'
    }
    
    stages {
        stage('Build Blue Version') {
            steps {
                sh '''
                    cd /home/ubuntu/app
                    cp index.html index.html.backup
                    docker build -t ${DOCKER_IMAGE}:v1 .
                '''
            }
        }
        
        stage('Deploy Blue') {
            steps {
                sh '''
                    export KUBECONFIG=/home/ubuntu/.kube/config
                    kubectl apply -f /home/ubuntu/k8s/deployment-blue.yaml
                    kubectl apply -f /home/ubuntu/k8s/service.yaml
                    kubectl rollout status deployment/myapp-blue
                '''
            }
        }
        
        stage('Build Green Version') {
            steps {
                sh '''
                    cd /home/ubuntu/app
                    cp index-green.html index.html
                    docker build -t ${DOCKER_IMAGE}:v2 .
                '''
            }
        }
        
        stage('Deploy Green') {
            steps {
                sh '''
                    export KUBECONFIG=/home/ubuntu/.kube/config
                    kubectl apply -f /home/ubuntu/k8s/deployment-green.yaml
                    kubectl rollout status deployment/myapp-green
                '''
            }
        }
        
        stage('Switch Traffic to Green') {
            steps {
                input message: 'Switch traffic to Green environment?', ok: 'Switch'
                sh '''
                    export KUBECONFIG=/home/ubuntu/.kube/config
                    kubectl patch service myapp-service -p '{"spec":{"selector":{"app":"myapp","color":"green"}}}'
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
                export KUBECONFIG=/home/ubuntu/.kube/config
                kubectl patch service myapp-service -p '{"spec":{"selector":{"app":"myapp","color":"blue"}}}'
            '''
        }
    }
}
