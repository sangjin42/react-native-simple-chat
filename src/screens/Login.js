import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components/native";
import { Image, Input, Button } from "../components";
import { images } from "../utils/images";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail, removeWhitespace } from "../utils/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { login } from "../utils/firebase";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
  padding-top: ${({ insets: { top } }) => top}px;
  /* 노치디자인의 길이 상단 */
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
  /* 노치디자인의 길이 하단 */
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Login = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  /* useSafeAreaInsets함수가 알려주는 노치디자인의 길이 값 */
  const passwordRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!(email && password && !errorMessage));
  }, [email, password, errorMessage]);
  /* 로그인버튼 활성화: 
  (email && password && !errorMessage)
  이메일과 비번이 입력돼 있고, 오류메시지가 없으면, 
  기본값인 disabled의 값 true를 !로 false로 만든다. disabled의 flase. 즉 활성화됨. */
  /* 
  useEffect : 컴퍼넌트가 렌더링될때마다 특정작업 실행
  useEffect(()=>{}, [])
  후자 []안의 트리거요소가 변경될때마다, 전자의 함수가 실행.
  */

  const _handleEmailChange = email => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setErrorMessage(
      validateEmail(changedEmail) ? "" : "please verify your email."
      /* 공백제거후, 
      이메일 형식 확인해서 참이면 "", 아니면 경고문. 해당 결과를 errorMessage에 저장 */
    );
    console.log("email:", email);
  };

  const _handlePasswordChange = password => {
    setPassword(removeWhitespace(password));
    console.log("password:", password);
    /* 입력된 비번의 공백을 제거해서 해당 결과를 password에 저장 */
  };

  const _handleLoginButtonPress = async () => {
    console.log("handleLoginButton click!!");
    try {
      /* 로그인 통신해서 성공 */
      const user = await login({ email, password });
      Alert.alert("Login Success", user.email);
      console.log("login sucess!!");
    } catch (e) {
      /* 로그인 통신해서 실패 */
      Alert.alert("Login Error", e.message);
      console.log("login fail!!");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
      /* TouchableWithoutFeedback보다 개선된 키보드 감추기 라이브러리. 화면 안가림. */
    >
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      {/* 키보드 감추는 컴퍼넌트와 Keyboard API dismiss함수로의 연결 */}

      <Container insets={insets}>
        <Image url={images.logo} imageStyle={{ borderRadius: 8 }} />
        {/* 화면구현은 이미지컴퍼넌트, 이미지 주소는 utils-images */}
        <Input
          label="Email"
          value={email}
          onChangeText={_handleEmailChange}
          onSubmitEditing={() => {
            passwordRef.current.focus(), console.log("next!!");
          }}
          /* submit시 passwordRef좌표로 포커스 시킴 */
          placeholder="Email"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={_handlePasswordChange}
          onSubmitEditing={() => {
            _handleLoginButtonPress;
            // console.log("sumit!!");
          }}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <ErrorText>{errorMessage}</ErrorText>
        {/* errorMessage는 빨간색인데, 초기값 ""으로 안보이다 email타이핑시 값을 재결정. */}
        <Button
          title="Login"
          onPress={_handleLoginButtonPress}
          disabled={disabled}
        />
        <Button
          title="Sign up with email"
          onPress={() => navigation.navigate("Signup")}
          isFilled={false}
        />
      </Container>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAwareScrollView>
  );
};

export default Login;
