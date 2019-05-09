# https://nodejs.org/en/download/package-manager/#macos

if [[ $CIRCLE_JOB == 'build-mac' ]]
then
  brew unlink node
  brew install node@10
  brew link --overwrite node@10 --force
  brew upgrade yarn
fi;

echo `node --version`
echo `yarn --version`
