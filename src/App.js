import React, { useState } from "react";
import { StatusBar, Image } from "react-native";
// import { AppLoading } from "expo";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

const cacheImages = images => {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const cacheFonts = fonts => {
  return fonts.map(font => Font.loadAsync(font));
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  const _loadAssets = async () => {
    /* 이미지와 폰트 미리 불러오기: 앱 환경에 따라 이미지나 폰트가 느리게 적용되는 문제 개선 */
    const iamgeAssets = cacheImages([require("../assets/splash.png")]);
    const fontAssets = cacheFonts([]);

    await Promise.all([...iamgeAssets, ...fontAssets]);
  };

  return isReady ? (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={_loadAssets}
      /* 리스너에 목표 함수지정 */
      onFinish={() => setIsReady(true)}
      /* 지정된 함수가 끝나면 실행되는 함수 */
      onError={console.warn}
    />
  );
};

export default App;
