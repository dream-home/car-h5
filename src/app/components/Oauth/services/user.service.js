export default class UserService {
  constructor($http, $httpParamSerializer, $injector) {
      "ngInject";
      this.$injector = $injector;
      /** @private {!string} */
      this.basePath_ = $injector.has('UserApiBasePath') ?
        /** @type {!string} */
        ($injector.get('UserApiBasePath')) :
        'http://car.mytianhui.com/api/v1';

      /** @private {!Object<string, string>} */
      this.defaultHeaders_ = $injector.has('UserApiDefaultHeaders') ?
        /** @type {!Object<string, string>} */
        (
          $injector.get('UserApiDefaultHeaders')) : {};

      /** @private {!angular.$http} */
      this.http_ = $http;

      /** @package {!Object} */
      this.httpParamSerializer = $injector.get('$httpParamSerializer');

    }
    /**
     * @constructor
     * @param {!angular.$http} $http
     * @param {!Object} $httpParamSerializer
     * @param {!angular.$injector} $injector
     * @struct
     */
  UserApi(){
    /** @private {!string} */
    this.basePath_ = $injector.has('UserApiBasePath') ?
      /** @type {!string} */
      ($injector.get('UserApiBasePath')) :
      'http://car.mytianhui.com/api/v1';

    /** @private {!Object<string, string>} */
    this.defaultHeaders_ = $injector.has('UserApiDefaultHeaders') ?
      /** @type {!Object<string, string>} */
      (
        $injector.get('UserApiDefaultHeaders')) : {};

    /** @private {!angular.$http} */
    this.http_ = $http;

    /** @package {!Object} */
    this.httpParamSerializer = $injector.get('$httpParamSerializer');
  }

  /**
   * 登录之后修改密码， 通过原密码修改
   *
   * @param {!string} oldPassword 旧密码
   * @param {!string} password 新密码
   * @param {!string} rePassword 确认密码
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.UserResponse>}
   */
  userChangePwdPost(oldPassword, password, rePassword, opt_extraHttpRequestParams){
    /** @const {string} */
    var path = this.basePath_ + '/user/changePwd';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'oldPassword' is set
    if (!oldPassword) {
      throw new Error('Missing required parameter oldPassword when calling userChangePwdPost');
    }
    // verify required parameter 'password' is set
    if (!password) {
      throw new Error('Missing required parameter password when calling userChangePwdPost');
    }
    // verify required parameter 'rePassword' is set
    if (!rePassword) {
      throw new Error('Missing required parameter rePassword when calling userChangePwdPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['oldPassword'] = oldPassword;

    formParams['password'] = password;

    formParams['rePassword'] = rePassword;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 用户登录
   * 用户通过手机号，密码，验证码登录车门店系统。返回结构的lastShopId是最近选中门店id, 登录之后要选中该门店
   * @param {!string} mobile 登录手机号
   * @param {!string} password 登录密码
   * @param {!string} code 验证码
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.UserResponse>}
   */
  userLoginPost(mobile, password, code, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/login';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'mobile' is set
    if (!mobile) {
      throw new Error('Missing required parameter mobile when calling userLoginPost');
    }
    // verify required parameter 'password' is set
    if (!password) {
      throw new Error('Missing required parameter password when calling userLoginPost');
    }
    // verify required parameter 'code' is set
    if (!code) {
      throw new Error('Missing required parameter code when calling userLoginPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['mobile'] = mobile;

    formParams['password'] = password;

    formParams['code'] = code;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 我的账户
   *
   * @param {!string} token 用户的登录凭证
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.MyAcountResponse>}
   */
  userMeGet(token, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/me';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    // verify required parameter 'token' is set
    if (!token) {
      throw new Error('Missing required parameter token when calling userMeGet');
    }
    headerParams['token'] = token;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'GET',
      url: path,
      json: true,
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 发送找回密码验证码，和其他发短信不同， 这个接口要返回一个凭证sign， 通过这个凭证去修改密码
   *
   * @param {!string} mobile 手机号
   * @param {!string} rnd 4位随机数， 客户端生成
   * @param {!string} sign 签名, md5(phone+rnd+salt)， 其中salt&#x3D;thzs0708， 不符合签名的请求一律返回错误
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.PasswordResponse>}
   */
  userPasswordSmsPost(mobile, rnd, sign, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/password/sms';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'mobile' is set
    if (!mobile) {
      throw new Error('Missing required parameter mobile when calling userPasswordSmsPost');
    }
    // verify required parameter 'rnd' is set
    if (!rnd) {
      throw new Error('Missing required parameter rnd when calling userPasswordSmsPost');
    }
    // verify required parameter 'sign' is set
    if (!sign) {
      throw new Error('Missing required parameter sign when calling userPasswordSmsPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['mobile'] = mobile;

    formParams['rnd'] = rnd;

    formParams['sign'] = sign;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 用户注册
   *
   * @param {!string} mobile 手机号
   * @param {!string} password 密码
   * @param {!string} code 手机验证码
   * @param {!string} captcha 图形验证码
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.UserResponse>}
   */
  AuserRegisterPost(mobile, password, code, captcha, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/register';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'mobile' is set
    if (!mobile) {
      throw new Error('Missing required parameter mobile when calling userRegisterPost');
    }
    // verify required parameter 'password' is set
    if (!password) {
      throw new Error('Missing required parameter password when calling userRegisterPost');
    }
    // verify required parameter 'code' is set
    if (!code) {
      throw new Error('Missing required parameter code when calling userRegisterPost');
    }
    // verify required parameter 'captcha' is set
    if (!captcha) {
      throw new Error('Missing required parameter captcha when calling userRegisterPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['mobile'] = mobile;

    formParams['password'] = password;

    formParams['code'] = code;

    formParams['captcha'] = captcha;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 发送注册验证码， 注册验证码只能用在注册，后端放入reids，设置timeout，做单限制/单ip发送次数?
   *
   * @param {!string} mobile 手机号
   * @param {!string} rnd 4位随机数， 客户端生成
   * @param {!string} sign 签名, md5(phone+rnd+salt)， 其中salt&#x3D;thzs0708, 不符合签名的请求一律返回错误
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.CommonResponse>}
   */
  userRegisterSmsPost(mobile, rnd, sign, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/register/sms';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'mobile' is set
    if (!mobile) {
      throw new Error('Missing required parameter mobile when calling userRegisterSmsPost');
    }
    // verify required parameter 'rnd' is set
    if (!rnd) {
      throw new Error('Missing required parameter rnd when calling userRegisterSmsPost');
    }
    // verify required parameter 'sign' is set
    if (!sign) {
      throw new Error('Missing required parameter sign when calling userRegisterSmsPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['mobile'] = mobile;

    formParams['rnd'] = rnd;

    formParams['sign'] = sign;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 切换门店时候调用该方法， 服务端保存用户选择的门店，下次登录默认显示该门店
   *
   * @param {!string} shopId 手机号
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.CommonResponse>}
   */
  userShopCurrentPost(shopId, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/shop/current';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'shopId' is set
    if (!shopId) {
      throw new Error('Missing required parameter shopId when calling userShopCurrentPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['shopId'] = shopId;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }

  /**
   * 不用登录系统, 通过手机验证码验明身份后修改密码。 通过凭证去修改密码， 服务端要验证凭证可靠性，和手机号关联, 5分钟timeout
   *
   * @param {!string} password 密码
   * @param {!string} rePassword 确认密码
   * @param {!string} sign /user/password/sms返回的sign
   * @param {!angular.$http.Config=} opt_extraHttpRequestParams Extra HTTP parameters to send.
   * @return {!angular.$q.Promise<!API.Client.UserResponse>}
   */
  userUpdatePwdPost(password, rePassword, sign, opt_extraHttpRequestParams) {
    /** @const {string} */
    var path = this.basePath_ + '/user/updatePwd';

    /** @type {!Object} */
    var queryParameters = {};

    /** @type {!Object} */
    var headerParams = angular.extend({}, this.defaultHeaders_);
    /** @type {!Object} */
    var formParams = {};

    // verify required parameter 'password' is set
    if (!password) {
      throw new Error('Missing required parameter password when calling userUpdatePwdPost');
    }
    // verify required parameter 'rePassword' is set
    if (!rePassword) {
      throw new Error('Missing required parameter rePassword when calling userUpdatePwdPost');
    }
    // verify required parameter 'sign' is set
    if (!sign) {
      throw new Error('Missing required parameter sign when calling userUpdatePwdPost');
    }
    headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

    formParams['password'] = password;

    formParams['rePassword'] = rePassword;

    formParams['sign'] = sign;

    /** @type {!Object} */
    var httpRequestParams = {
      method: 'POST',
      url: path,
      json: false,
      data: this.httpParamSerializer(formParams),
      params: queryParameters,
      headers: headerParams
    };

    if (opt_extraHttpRequestParams) {
      httpRequestParams = angular.extend(httpRequestParams, opt_extraHttpRequestParams);
    }

    return ( /** @type {?} */ (this.http_))(httpRequestParams);
  }
}
class User {
  constructor() {
    /**
     * 用户uid
     * @type {!string}
     * @export
     */
    this.id;
    /**
     * 手机号
     * @type {!string}
     * @export
     */
    this.mobile;

    /**
     * 默认是手机号
     * @type {!string}
     * @export
     */
    this.name;

    /**
     * 用户登录凭证， 以后的每次请求，客户端务必将token置入httpheader
     * @type {!string}
     * @export
     */
    this.token;

    /**
     * 最近登录时间
     * @type {!API.Client.date}
     * @export
     */
    this.loginTime;

    /**
     * 上次用户选择的门店，如果第一次是null
     * @type {!string}
     * @export
     */
    this.lastShopId;
  }
}
class UserResponse {
  constructor() {
    /**
     * @type {!API.Client.BasicMeta}
     * @export
     */
    this.meta;

    /**
     * @type {!API.Client.User}
     * @export
     */
    this.data;

    /**
     * @type {!API.Client.Error}
     * @export
     */
    this.error;
  }
}
