# https://nodejs.org/en/download/package-manager/#macos

if [[ $CIRCLE_JOB == 'build-mac' ]]
then
  curl "https://nodejs.org/dist/v10.0.0/node-v10.0.0.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
  curl https://www.npmjs.com/install.sh | sudo bash
fi;

echo `node -v`
