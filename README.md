
# deploy init
```
sudo apt update
sudo apt install curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

git fetch
git reset --hard origin/dev
npm i

vim ./node_modules/mind-ar/dist/mindar-image-three.prod.js
import { CSS3DRenderer as Vd } from "three/examples/jsm/renderers/CSS3DRenderer.js";

sudo apt install screen

啟動一個新的screen會話：
screen -S devsession

在screen會話中，運行你的命令：
npm run dev
按下Ctrl + A然後按下D來脫離screen會話。這樣，你的命令會在後台繼續運行。

要重新連接到你的screen會話，使用以下命令：
screen -r devsession
```

# connect
```
ssh ictserver@192.168.1.220
你的密碼

sudo su
你的密碼

cd projects/guandu_dock/
git pull
npm run dev
```