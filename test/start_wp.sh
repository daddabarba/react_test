echo "starting"
cd src
gnome-terminal -x bash -c "mongod --dbpath ../data/ --port 27018;"
gnome-terminal -x bash -c "node server.js;"
npm start