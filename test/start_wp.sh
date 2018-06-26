echo "starting"
cd src
gnome-terminal -x bash -c "mongod --dbpath ../data/ --port 27018;"
gnome-terminal -x bash -c "sleep 5s;node server.js;"
gnome-terminal -x bash -c "npm start;"