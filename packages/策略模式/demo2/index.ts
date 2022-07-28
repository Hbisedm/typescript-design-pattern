let registerForm = document.getElementById("registerForm");
const p = /(^1[3|5|8][0-9]{9}$)/;
registerForm.onsubmit = () => {
  console.log("123");
  console.log(registerForm.userName.value);
  if (registerForm.userName.value === "") {
    alert("用户名不能为空");
    return false;
  }
  if (registerForm.password.value.length < 6) {
    alert("密码长度不能少于6位");
    return false;
  }
  if (!p.test(registerForm.phoneNumber.value)) {
    alert("手机号码格式不正确");
    return false;
  }
};
