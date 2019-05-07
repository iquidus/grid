# https://nodejs.org/en/download/package-manager/#macos

if [[ $CIRCLE_JOB == 'build-mac' ]]
then
  brew install node@10
  brew upgrade yarn
fi;

echo `node --version`
echo `yarn --version`
