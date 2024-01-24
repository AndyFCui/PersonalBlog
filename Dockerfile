FROM node:14

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有项目文件到工作目录
COPY . .

# 暴露容器的端口号
EXPOSE 3000

# 运行应用
CMD ["npm", "start"]