import React, { useState } from "react";
import { StatusBar, Image } from "react-native";
// import { AppLoading } from "expo";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import Navigation from "./navigations";
/* 파일이 아닌 폴더로 지정하면, index.js로부터 익스포트된 Navigation을 가져온다 */
import { images } from "./utils/images";
/* 주소를 폴더로 지정하면 파일명까지 안하더라도 알아서 찾아서 가져온다. */

const cacheImages = images => {
  /* 이미지 미리 불러오기 함수 */
  return images.map(image => {
    /* 주소배열의 각 요소를 기반으로 맵핑해서 이미지들 미리 불러오기 */
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
    /* 배열내 개별 인자가 string(웹주소 형태면)이면 prefetch로 웹에서 이미지 가져오기, 
    아니(파일명이면)면 fromModule~downloadAsync로 로컬에 이미지 splash.png 가져오기 */
  });
};

const cacheFonts = fonts => {
  /* 폰트 미리 불러오기 함수 */
  return fonts.map(font => Font.loadAsync(font));
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  const _loadAssets = async () => {
    /* 이미지와 폰트 미리 불러오기: 앱 환경에 따라 이미지나 폰트가 느리게 적용되는 문제 개선 */
    const imageAssets = cacheImages([
      /* 이미지 불러오기 함수 실행: 로컬폴더와 유틸폴더로부터 경로주소를 배열인자로 가져오기 */
      require("../assets/splash.png"),
      ...Object.values(images),
    ]);
    /* 배열 후자인 Object.values(images)의 images는 utils폴더로부터 임포트된 것 */
    const fontAssets = cacheFonts([]);

    await Promise.all([...imageAssets, ...fontAssets]);
  };

  return isReady ? (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={_loadAssets}
      /* 앱로딩시 실행되는 함수지 */
      onFinish={() => setIsReady(true)}
      /* 함수의 이지지,폰트 미리불러오기가 끝나면 실행되는 함수 */
      onError={console.warn}
    />
  );
};

export default App;
