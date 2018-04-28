echo "starting"
cd src
gnome-terminal -x bash -c "mongod --dbpath /home/daddabarba/Desktop/testApp/test/data/ --port 27018;"
gnome-terminal -x bash -c "node server.js;"
npm start