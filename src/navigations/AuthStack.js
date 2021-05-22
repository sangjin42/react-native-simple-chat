import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, Signup } from "../screens";
/* 복수 임포트시 폴더까지만 입력할수 있다?? */

const Stack = createStackNavigator();

const AuthStack = () => {
  const theme = useContext(ThemeContext);
  /* 스타일드컴퍼넌트 내장 ThemeContext 이용 */
  return (
    /* 스택네비게이션은 크게 Navigator와 Screen으로 나뉜다 */
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: "center",
        /* 안드-IOS 일치 */
        cardStyle: { backgroundColor: theme.backgroundColor },
        headerTintColor: theme.headerTintColor,
        /* 헤더의 뒤로가기 버튼 "<" 색깔 */
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
