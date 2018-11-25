cd android
sudo rm -rf build
./gradlew clean
./gradlew -stop
./gradlew assembleRelease > release_logs.txt
ls -lS --block-size=MB ./app/build/outputs/apk/release