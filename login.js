/* global $ */
var login = document.querySelector('.login')
var loginForm = document.querySelector('.login-form')
var register = document.querySelector('.register')
var registerForm = document.querySelector('.register-form')
// var inputUserName = document.querySelector('.input-user-name')
// var url = window.location.search

// 点击登录注册切换
login.onclick = function () {
  console.log(login.classList)
  if (!login.classList.contains('active')) {
    login.classList.add('active')
    loginForm.classList.add('active')
    register.classList.remove('active')
    registerForm.classList.remove('active')
  }
}
register.onclick = function () {
  if (!register.classList.contains('active')) {
    register.classList.add('active')
    registerForm.classList.add('active')
    login.classList.remove('active')
    loginForm.classList.remove('active')
  }
}
// 正确或错误提示
function change (item, judge) {
  var parent = item.parentNode.parentNode
  if (judge) {
    parent.querySelector('.icon-true').style.display = 'inline-block'
    parent.querySelector('.tip').style.display = 'none'
  } else {
    parent.querySelector('.icon-true').style.display = 'none'
    parent.querySelector('.tip').style.display = 'block'
  }
}
$(document).ready(function () {
  var user = $.cookie('uu')
  var pwd = $.cookie('pp')
  var userNameIsV = false
  var passwordIsV = false
  var registerPhoneIsV = false
  // var registerVerCodeIsV = false
  var registerUserNameIsV = false
  var registerPasswordIsV = false
  var registerPassword2IsV = false
  // var verCode = ''
  // var verCodeTime = 0
  // 将cookie中的用户名和密码显示
  console.log(user, pwd)
  if (user) {
    $('.input-user-name').val(user)
    $('.input-password').val(pwd)
  }
  // // 查找后台数据是否有该用户名
  // var findUsername = function (arr, userName) {
  //   for (var i = 0; i < arr.length; i++) {
  //     if (arr[i]['user-name'] === userName) {
  //       userNameIsV = true
  //       return arr[i]
  //     }
  //   }
  //   userNameIsV = false
  //   return null
  // }
  // // 查找后台数据是否有该手机号
  // var findphoneNumber = function (arr, phoneNumber) {
  //   // console.log(arr, phoneNumber)
  //   for (var i = 0; i < arr.length; i++) {
  //     if (arr[i]['phone-number'] === phoneNumber) {
  //       return arr[i]
  //     }
  //   }
  //   return null
  // }
  // 查找后台数据是否存在该用户
  var findUser = function (arr, userName, password) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]['user-name'] === userName && arr[i].password === password) {
        return arr[i]
      }
      if (arr[i]['phone-number'] === userName && arr[i].password === password) {
        return arr[i]
      }
    }
    return null
  }
  // 用户名/手机存在验证
  $('.input-user-name').on('change', function () {
    var userName = this.value
    var input = this
    $.get('http://localhost:3000/users?user-name=' + userName, function (data, status) {
      console.log(data, status)
      if (data.length === 0) {
        $.get('http://localhost:3000/users?phone-number=' + userName, function (data, status) {
          // console.log(data, status)
          // var user = findUsername(data, userName)
          // var user2 = findphoneNumber(data, userName)
          if (data.length !== 0) {
            userNameIsV = true
            change(input, true)
          } else {
            userNameIsV = false
            change(input, false)
          }
        })
      } else {
        // var user = findUsername(data, userName)
        // var user2 = findphoneNumber(data, userName)
        if (data.length !== 0) {
          userNameIsV = true
          change(input, true)
        } else {
          userNameIsV = false
          change(input, false)
        }
      }
    })
  })
  // 密码验证
  $('.input-password').on('change', function () {
    var password = this.value
    if (/^(?=.*[a-zA-Z])(?=.*\d)[^]{6,}$/.test(password)) {
      passwordIsV = true
      change(this, true)
    } else {
      passwordIsV = false
      change(this, false)
    }
  })
  // 登录事件处理
  $('.button-login').on('click', function (e) {
    e.preventDefault()
    if (userNameIsV && passwordIsV) {
      console.log(userNameIsV, passwordIsV)
      var userName = $('.input-user-name').val()
      var password = $('.input-password').val()
      $.get('http://localhost:3000/users', function (data, status) {
        var user = findUser(data, userName, password)
        if (user) {
          $('.message-container .icon-true').css('background-image', 'url("img/正确.png")')
          $('.message-container .message-text').text('登录成功,1s后进入主页')
          $('.message-container').show()
          setTimeout(function () {
            window.location.href = 'home.html'
          }, 1000)
        } else {
          $('.message-container .icon-true').css('background-image', 'url("img/错误.png")')
          $('.message-container .message-text').text('登录失败,请重新输入')
          $('.message-container').show()
          console.log('账号或密码错误')
        }
      })
    } else {
      $('.message-container .icon-true').css('background-image', 'url("img/错误.png")')
      $('.message-container .message-text').text('输入错误,无法登录')
      $('.message-container').show()
      $('.input-user-name').change()
      $('.input-password').change()
    }
  })
  $('.message-container').on('click', function () {
    $('.message-container').hide()
  })
  // 注册设置

  // 手机号格式验证
  $('.input-register-phone').on('change', function () {
    var phoneNumber = this.value
    var input = this
    if (/^1[34578]\d{9}$/.test(phoneNumber)) {
      $.get('http://localhost:3000/users?phone-number=' + phoneNumber, function (data, status) {
        // console.log(data)
        // var user = findUsername(data, userName)
        if (data.length === 0) {
          registerPhoneIsV = true
          change(input, true)
        } else {
          registerPhoneIsV = false
          change(input, false)
        }
      })
    } else {
      registerPhoneIsV = false
      change(this, false)
    }
  })
  // 用户名重复验证
  $('.register-user-name').on('change', function () {
    var userName = this.value
    var input = this
    if (!userName) {
      registerUserNameIsV = false
      change(input, false)
      return
    }
    $.get('http://localhost:3000/users?user-name=' + userName, function (data, status) {
      // console.log(data)
      // var user = findUsername(data, userName)
      if (data.length === 0) {
        registerUserNameIsV = true
        change(input, true)
      } else {
        registerUserNameIsV = false
        change(input, false)
      }
    })
  })
  // 密码格式验证
  $('.register-password').on('change', function () {
    var password = this.value
    if (/^(?=.*[a-zA-Z])(?=.*\d)[^]{6,}$/.test(password)) {
      registerPasswordIsV = true
      change(this, true)
    } else {
      registerPasswordIsV = false
      change(this, false)
    }
  })
  // 二次密码验证
  $('.register-password2').on('input', function () {
    var password = $('.register-password').val()
    var password2 = this.value
    if (password === password2) {
      registerPassword2IsV = true
      change(this, true)
    } else if (password.slice(0, password2.length) === password2) {
      registerPassword2IsV = false
      var parent = this.parentNode.parentNode
      parent.querySelector('.icon-true').style.display = 'none'
      parent.querySelector('.tip').style.display = 'none'
    } else {
      registerPassword2IsV = false
      passwordIsV = false
      change(this, false)
    }
  })
  // 验证码验证
  // $('.register-ver-code').on('change', function () {
  //   var registerVerCode = this.value
  //   if (registerVerCode === verCode && registerVerCode !== '') {
  //     registerVerCodeIsV = true
  //     change(this, true)
  //   } else {
  //     registerVerCodeIsV = false
  //     change(this, false)
  //   }
  // })
  // 注册事件处理
  $('.button-register').on('click', function (e) {
    e.preventDefault()
    if (registerPhoneIsV && registerUserNameIsV && registerPasswordIsV && registerPassword2IsV) {
      // console.log(userNameIsV, passwordIsV)
      var phoneNumber = $('.input-register-phone').val()
      var userName = $('.register-user-name').val()
      var password = $('.register-password').val()
      console.log('开始注册1')
      $.post('http://localhost:3000/users', {
        'user-name': userName,
        'phone-number': phoneNumber,
        password: password
      }, function (data, status) {
        console.log('开始注册2')
        console.log(data, status)
        // var user = findUser(data, userName, password)
        if (status === 'success') {
          $('.message-container .icon-true').css('background-image', 'url("img/正确.png")')
          $('.message-container .message-text').text('注册成功,2s后返回登录')
          $('.message-container').show()
          console.log('注册成功')
          setTimeout(function () {
            window.location.href = 'login.html'
          }, 2000)
        } else {
          $('.message-container .icon-true').css('background-image', 'url("img/错误.png")')
          $('.message-container .message-text').text('注册失败,请重试')
          $('.message-container').show()
          console.log('注册失败')
        }
      })
    } else {
      $('.message-container .icon-true').css('background-image', 'url("img/错误.png")')
      $('.message-container .message-text').text('输入错误,无法注册')
      $('.message-container').show()
      console.log('无法注册1', registerPhoneIsV, registerUserNameIsV, registerPasswordIsV, registerPassword2IsV)
      $('.input-register-phone').change()
      $('.register-ver-code').change()
      $('.register-user-name').change()
      $('.register-password').change()
      $('.register-password2').change()
    }
  })
  // 记住密码事件
  $('.input-remember').on('change', function () {
    if ($('.input-remember')[0].checked) {
      console.log('记录cookie', $('.input-user-name').val(), $('.input-password').val())
      $.cookie('uu', $('.input-user-name').val(), { expires: 7 })
      $.cookie('pp', $('.input-password').val(), { expires: 7 })
      console.log($.cookie('uu'), $.cookie('pp'))
    } else {
      console.log('无记录cookie', $('.input-user-name').val(), $('.input-password').val())
      $.cookie('uu', '')
      $.cookie('pp', '')
    }
  })
})
