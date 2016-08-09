goog.provide('API.Client.UserResponse');

/**
 * 登录之后返回用户信息
 * @record
 */
API.Client.UserResponse = function() {}

/**
 * @type {!API.Client.BasicMeta}
 * @export
 */
API.Client.UserResponse.prototype.meta;

/**
 * @type {!API.Client.User}
 * @export
 */
API.Client.UserResponse.prototype.data;

/**
 * @type {!API.Client.Error}
 * @export
 */
API.Client.UserResponse.prototype.error;

