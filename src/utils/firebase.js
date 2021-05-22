import * as firebase from "firebase";
import config from "../../firebase.json";

const app = firebase.initializeApp(config);

const Auth = app.auth();

const uploadImage = async uri => {
  /* 사진을 업로드하고, 해당사진의 url을 반환 */
  console.log("유틸의 uploadImage 함수 실행");
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    /* 통신(로컬인듯..) */
    xhr.onload = function () {
      /* 통신해서 응답처리 */
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      /* 통신해서 에러처리 */
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    /* 응답형식 설정 */
    xhr.open("GET", uri, true);
    /* 통신해서 uri(로컬주소인듯..) 값 GET하기 */
    xhr.send(null);
    /* 통신해서 send하는 것은 null */
  });

  const user = Auth.currentUser;
  /* 현재유저로 파이어베이스 접속 */
  const ref = app.storage().ref(`/profile.${user.uid}/photo.png`);
  /* 접속한 파이어베이스 스토리지의 유저아이디 주소 (photo.png가 있음) */
  const snapshot = await ref.put(blob, { contentType: "image/png" });
  /* 접속한 유저아이디 스토리지 주소에 blob(uri 이미지 로컬주소) 값을 이미지로 저장.  */

  blob.close();
  /* 통신을 종료 */
  return await snapshot.ref.getDownloadURL();
  /* 스토리지에 저장된 이미지의 주소를 getDownloadURL()함수를 통해 반환 */
};

export const login = async ({ email, password }) => {
  const { user } = await Auth.signInWithEmailAndPassword(email, password);
  return user;
};

export const signup = async ({ email, password, name, photoUrl }) => {
  /* 회원가입정보생성 to 파이어베이스Authentic 및 스토리지(이미지저장 후 url 따기)*/

  const { user } = await Auth.createUserWithEmailAndPassword(email, password);

  const storageUrl = photoUrl.startsWith("https")
    ? photoUrl
    : await uploadImage(photoUrl);
  /* storageUrl에 https주소가 있으면 주소 그대로 적용, 
  https주소가 없으면 로컬이미지 스토리지 저장후 url 구하는 함수 uploadImage 실행 */

  await user.updateProfile({
    /* 회원가입정보 생성시 프로필을 업데이트하는 내장함수. 업데이트 내용을 객체인자로 보냄. */
    displayName: name,
    photoURL: storageUrl,
  });

  return user;
};
