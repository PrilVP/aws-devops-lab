FROM nginx:alpine

# Стандартный команд для nginx в foreground
CMD ["nginx", "-g", "daemon off;"]
