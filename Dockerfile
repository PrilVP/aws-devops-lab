- name: Build, tag and push image to ECR
  run: |
    # Собираем образ из корня репозитория (где лежит Dockerfile)
    docker build -t $ECR_REPOSITORY:latest .

    docker tag $ECR_REPOSITORY:latest \
      $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG

    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG
