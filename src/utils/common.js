export const validateEmail = email => {
  /* 올바른 이메일 형식인지 확인하는 함수. regex에 부합하는지 test()한다 */
  const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
  return regex.test(email);
};

export const removeWhitespace = text => {
  /* 입력된 문자열에서 공백을 ""로 바꾸어 제거하는 함수 */
  const regex = /\s/g;
  return text.replace(regex, "");
};
