import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components/native";
import { Image, Input, Button } from "../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail, removeWhitespace } from "../utils/common";
import { images } from "../utils/images";
import { Alert } from "react-native";
import { signup } from "../utils/firebase";

const Container = styled.View`
  /* flex: 1; */
  /* flex: 1은 차지영역이 부모 컴퍼넌트 영역만큼으로 한정 */
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  //기본은 disabled true. 즉 비활성화.

  const [photoUrl, setPhotoUrl] = useState(images.photo);

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const didMountRef = useRef();

  useEffect(() => {
    /* 특정 state값 변경시 조건에 따른 에러메시지 변경 함수. 에러가 없으면 에러메시지는 "" */
    if (didMountRef.current) {
      /* 스테이트값 변화뿐만 아니라, 처음 렌더링시 컴퍼넌트가 마운트 될때도 함수가 실행되는 문제 해결 */
      let _errorMessage = "";
      if (!name) {
        _errorMessage = "Please enter your name.";
      } else if (!validateEmail(email)) {
        _errorMessage = "Please verify your email.";
      } else if (password.length < 6) {
        _errorMessage = "The password must contain 6 charcters at least.";
      } else if (password !== passwordConfirm) {
        _errorMessage = "Password need to match.";
      } else {
        _errorMessage = "";
      }
      setErrorMessage(_errorMessage);
    } else {
      didMountRef.current = true;
    }
  }, [name, email, password, passwordConfirm]);

  useEffect(() => {
    /* 특정 state값 변경시 활성화 함수 */
    setDisabled(
      !(name && email && password && passwordConfirm && !errorMessage)
    );
  }, [name, email, password, passwordConfirm, errorMessage]);
  /* 활성화: 
  !(email && password && !errorMessage) -> 괄호 내용은 일종의 조건이고, 만족시 불리언 전환.
  이메일과 비번이 입력돼 있고, 오류메시지가 없으면, 
  기본값인 disabled의 값 true를 !로 false로 만든다. disabled의 flase. 즉 활성화됨. */

  const _handleSignupButtonPress = async () => {
    console.log("버튼클릭 _handleSignupButtonPress!!");
    try {
      const user = await signup({ email, password, name, photoUrl });
      console.log("가입회원 생성성공 user:", user);
      Alert.alert("Signup Success", user.email);
    } catch (e) {
      Alert.alert("Signup Error", e.message);
      console.log("가입실패");
    }
  };

  const _test = () => {
    console.log("므야호!!");
  };

  return (
    <KeyboardAwareScrollView
      // contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container>
        <Image
          rounded
          url={photoUrl}
          showButton
          onChangeImage={url => setPhotoUrl(url)}
        />
        {/* rounded와 showButton을 "={}"생략하고 주면, 
        "={true}"로 주는 모양이다 */}
        <Input
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          onSubmitEditing={() => {
            setName(name.trim());
            emailRef.current.focus();
          }}
          onBlur={() => setName(name.trim())}
          placeholder="Name"
          returnKeyType="next"
        />
        <Input
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={text => setEmail(removeWhitespace(text))}
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
          placeholder="Email"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={text => setPassword(removeWhitespace(text))}
          onSubmitEditing={() => {
            passwordConfirmRef.current.focus();
          }}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <Input
          ref={passwordConfirmRef}
          label="Password Confirm"
          value={passwordConfirm}
          onChangeText={text => setPasswordConfirm(removeWhitespace(text))}
          onSubmitEditing={_handleSignupButtonPress}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <ErrorText>{errorMessage}</ErrorText>
        <Button
          title="Signup"
          onPress={_handleSignupButtonPress}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
