sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -               u ubuntu --hp /home/ubuntu
sudo pm2 start ecosystem.config.js
