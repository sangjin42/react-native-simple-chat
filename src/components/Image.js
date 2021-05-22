import React, { useEffect } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
// import * as Permissions from "expo-permissions/";

const Container = styled.View`
  align-items: center;
  margin-bottom: 30px;
`;

const StyledImage = styled.Image`
  background-color: ${({ theme }) => theme.imageBackground};
  width: 100px;
  height: 100px;
  border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.imageButtonBackground};
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const ButtonIcon = styled(MaterialIcons).attrs({
  name: "photo-camera",
  size: 22,
})`
  color: ${({ theme }) => theme.imageButtonIcon};
`;

const PhotoButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonIcon />
    </ButtonContainer>
  );
};

const Image = ({ url, imageStyle, rounded, showButton, onChangeImage }) => {
  useEffect(() => {
    /* IOS("web")에서는 사진첩에 접근하기 위해 사용자에게 권한을 요청하는 과정이 따로 필요 */
    (async () => {
      try {
        // if (Platform.OS === "ios") {
        if (Platform.OS !== "web") {
          /* 모바일일시 사진접근 권한받기 */
          // const { status } = await Permissions.askAsync(
          //   Permissions.CAMERA_ROLL
          // );
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Photo Permission",
              "Please turn on the camera roll permissions."
            );
          }
        }
      } catch (e) {
        Alert.alert("Photo Permission Error", e.message);
      }
    })();
  }, []);

  const _handleEditButton = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowEditing: true,
        aspect: [1, 1], //이미지 편집시 비율
        quality: 1, // 압축품질
      });
      if (!result.cancelled) {
        onChangeImage(result.uri);
        /* props onChangeImage를 통해서 setPhotoUrl 함수로 스테이트값 변경 */
        console.log("result:", result);
        /* result가 가져오는 값 {cancelled, height, type, uri,} */
      }
    } catch (e) {
      Alert.alert("Photo Error", e.message);
    }
  };

  return (
    /* url을 렌더링하고, imageStyle로 스타일링 */
    <Container>
      <StyledImage source={{ uri: url }} style={imageStyle} rounded={rounded} />
      {showButton && <PhotoButton onPress={_handleEditButton} />}
    </Container>
  );
};

Image.defaultProps = {
  rounded: false,
  showButton: false,
  /* 이미지 컴퍼넌트의 기본값 */
  onChangeImage: () => {},
};

Image.propTypes = {
  uri: PropTypes.string,
  imageStyle: PropTypes.object,
  rounded: PropTypes.bool,
  showButton: PropTypes.bool,
  onChangeImage: PropTypes.func,
};

export default Image;
