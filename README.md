# Guandu Dock (關渡碼頭_中華電信_時藝)


## Project Description
This project uses MindAR and Three.js to implement a feature where the camera scans specific images, triggering various 3D models to appear. These models include food from vendors at Guandu Wharf and dinosaur models.


## Table of Contents
- [Installation](#Installation)
- [Usage](#Usage)
- [Project Structure](#Project-structure)
- [Tech Stack](#Tech-stack)
- [Env Setting](#env-setting)
- [Deployment](#Deployment)

## Installation
Instructions on how to install and set up the project.
### Prerequisites
- Node.js (>16.9.1)
- npm or yarn (recomand yarn)

### Steps
1. Clone the repository
    ```bash
    git clone https://gitlab.com/picbot/guandu_dock.git
    ```
2. Install dependencies
    ```bash
    cd guandu_dock
    yarn 
    ```
    
    
    
## Usage
Instructions on how to run and use the project.
### Development Mode
    yarn dev
### Build for Production
    yarn build
    
    
## Project Structure
A brief explanation of the project's directory and file structure.

    ```
    ├── public            
    │   ├── music          # svgs and test contents
    │   ├── model          # 3D model .json
    │   ├── image          # 2D scene frame / textureForBox / logo
    ├── src
    │   ├── App.jsx        # Entry point
    │   ├── model          # pageStage for most rematch management
    │   ├── helper         # api methods / js handles
    │   ├── scss           # scss
    │   ├── main.tsx       # Application entry point
    │   └── components     # components
    │        ├── Loading   # loading cover
    │        ├── DeviceO...# cover for orientation to small width
    │        ├── ARView    # Main page for whole AR experience
    │        ├── ViewPhoto # preview for photo
    │        └── ViewVideo # preview for record video
    ├── package.json       # Project dependencies and scripts
    ├── tsconfig.json      # TypeScript configuration
    ├── env                # env variables
    ├── dockerfile         # docker file
    └── vite.config.ts     # Vite configuration
    
    ```
    
    
## Tech Stack
List the main technologies and tools used in the project.
- React
- Vite
- [MindAR](https://hiukim.github.io/mind-ar-js-doc/)
- Threejs **(v0.136)**
- Rematch
- Axios
- Tailwind
- Sass

## env-setting
```
sudo apt update
sudo apt install curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs 

git fetch
git reset --hard origin/dev
```

## Deployment

### 1. connect (as below)
```
// 登入機器
ssh ictserver@192.168.1.220
密碼

// 取得root權限
sudo su
密碼
```
### 2. 建立git專案
```
// 建立新資料夾並進入
mkdir your_folder_name
cd your_folder_name

// Git
git clone git@github.com:spe3d/guandu_dock.git your_folder_name
git fetch origin                              //拉取最新的遠端儲存庫資訊
git checkout "Feature_UI_delete&music-button" //切換到遠端 branch
git branch                                    //確認你現在處於正確的 branch
```

### 3.修正資源庫
```
// 更新node module
npm i

// 修改以下code import { CSS3DRenderer as Vd } from "three/examples/jsm/renderers/CSS3DRenderer.js";
vim ./node_modules/mind-ar/dist/mindar-image-three.prod.js

// 找到該行 按 "I" 進行change 
// 改完後按 "esc" 然後輸入 ":wq" 表示儲存 
``` 

### 4.新建.env
```
touch .env

// 進入文件
vim .env

// 按 "I" 進行change 
// 改完後按 "esc" 然後輸入 ":wq" 表示儲存 

// 看是否存成功
cat .env
``` 


### 5.run in background 
```
// 背景執行
nohup npm run dev &
// 看log
cat nohup.out
// 關閉程式
pkill -f "node"
```