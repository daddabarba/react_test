echo "starting"
cd src
mongod --dbpath ../data/ --port 27018 &
sleep 5s;node server.js &
npm start &