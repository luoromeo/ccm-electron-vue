<template>
  <div class="login-container">
    <vue-particles color="#969696" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle" :particleSize="4" linesColor="#C9C9C9" 
    :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="100" :moveSpeed="1" 
    :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi">
    </vue-particles>
    <!-- <div class="login-container"> -->
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h3 class="title">WELCOME TO CCM</h3>
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
            placeholder="密码"></el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div class="tips">
          <span style="margin-right:20px;">username: admin</span>
          <span> password: admin</span>
        </div>
      </el-form>
      <div class="welcome-text">
        <p class="welcome-text-title">欢迎来到意外艺术后台管理系统</p>
        <p class="welcome-text-title2">Welcome to the accident arts background management system</p>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
}
/* reset element-ui css */
.login-form {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      box-sizing: border-box;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      background:rgba(255,255,255,1);
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border:1px solid rgba(0,0,0,0.15);
    background:rgba(255,255,255,1);
    border-radius:4px;
    color: #454545;
  }
  .el-button--default {
    width:285px;
    height:40px;
    background:rgba(248,231,28,1);
    border-radius:4px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#FFFFFF;
$dark_gray:#889aa4;
$light_gray:#eee;
  .login-form {
    padding: 60px;
    width: 403px;
    height: 481px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    filter: blur(0px);
    position: absolute;
    top: 50%;
    // left: 368px;
    left: 100px;

    transform: translate(0, -50%);
  }
  .welcome-text {
    position: absolute;
    // right: 138px;
    right: 10%;
    top: 50%;
    transform: translate(0, -50%);
    .welcome-text-title {
      width:504px;
      height:50px;
      font-size:36px;
      font-family:PingFangSC-Light;
      font-weight:300;
      color:rgba(89,89,89,1);
      line-height:50px;
    }
    .welcome-text-title2 {
      width:472px;
      height:22px;
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(89,89,89,1);
      line-height:22px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    // color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    font-family:PingFangSC-Medium;
    color:rgba(38,38,38,1);
    line-height:33px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
.lizi {
  position: absolute;
  width: 100%;
  height: 99.5%;
  background-color: #F5F5F5;
}
@media screen and (max-width: 1150px) {
  .login-form {
    left: 50%;

    transform: translate(-50%, -50%);
  }

  .welcome-text {
    display: none;
  }
}
</style>
