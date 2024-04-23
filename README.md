
# env setting
```
sudo apt update
sudo apt install curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs 

git fetch
git reset --hard origin/dev
```

# how to deploy a new project

## 1. connect (as below)
```
// 登入機器
ssh ictserver@192.168.1.220
密碼

// 取得root權限
sudo su
密碼
```
## 2. 建立git專案
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

## 3.修正資源庫
```
// 更新node module
npm i

// 修改以下code import { CSS3DRenderer as Vd } from "three/examples/jsm/renderers/CSS3DRenderer.js";
vim ./node_modules/mind-ar/dist/mindar-image-three.prod.js

// 找到該行 按 "I" 進行change 
// 改完後按 "esc" 然後輸入 ":wq" 表示儲存 
``` 

## 4.新建.env
```
touch .env

// 進入文件
vim .env

// 按 "I" 進行change 
// 改完後按 "esc" 然後輸入 ":wq" 表示儲存 

// 看是否存成功
cat .env
``` 


## 5.run in background 
```
// 背景執行
nohup npm run dev &
// 看log
cat nohup.out
// 關閉程式
pkill -f "node"
```