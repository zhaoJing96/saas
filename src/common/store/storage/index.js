import constant from '@/common/utils/constant.js';
/**
 *设置当前项目ID
 *@params pid,当前获取的项目ID
 */
export function setCurrentProjectId(pid) {
    if (typeof pid === 'object' || pid === null) {
        throw '错误的参数类型,参数pid应为Number或String';
    }
    sessionStorage.setItem(constant.storage.currentProjectId, JSON.stringify(pid ? pid : null));
    localStorage.setItem(constant.storage.currentProjectId, JSON.stringify(pid ? pid : null));
}
/**获取当前项目ID**/
export function getCurrentProjectId() {
    let pid = JSON.parse(sessionStorage.getItem(constant.storage.currentProjectId)) ||
        JSON.parse(localStorage.getItem(constant.storage.currentProjectId));
    return pid;
}
/**
 *设置当前用户
 *@param obj,object,当前用户基本信息
 **/
export function setCurrentUser(obj) {
    localStorage.setItem(constant.storage.currentUser, JSON.stringify(obj || null));
}
/**获取当前用户,返回当前用户*/
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(constant.storage.currentUser));
}
/**
 * 设置当前用户类型[正式用户还是体验用户]
 * @params type,1体验用户,2正式用户
 * **/
export function setCurrentUserType(type) {
    if (!type) {
        throw new Error('缺少必要参数,当前用户类型');
    }
    const data = {
        type: type,
        description: type === 1 ? '体验用户' : type === 2 && '正式用户'
    };
    localStorage.setItem(constant.storage.currentUserType, JSON.stringify(data));
}
/**获取当前用户类型[正式用户还是体验用户]**/
export function getCurrentUserType() {
    return JSON.parse(localStorage.getItem(constant.storage.currentUserType));
}
//获取当前用户ID
export function getCurrentUserId() {
    return getCurrentUser().id;
}
/**获取当前跳转类型**/
export function getJumpPageType() {
    return JSON.parse(sessionStorage.getItem(constant.storage.jumpPageType));
}
//设置主导航KEY,array
export function setMenuKeys(keys) {
    localStorage.setItem(constant.storage.currentMenuKey, JSON.stringify(keys));
}
//获取主导航KEY
export function getMenuKeys() {
    return JSON.parse(localStorage.getItem(constant.storage.currentMenuKey));
}
//设置子导航submenu的key
export function setOpenSubMenuKeys(keys) {
    localStorage.setItem(constant.storage.currentSubMenuKey, JSON.stringify(keys));
}
//获取子导航submenu的key
export function getOpenSubMenuKeys() {
    return JSON.parse(localStorage.getItem(constant.storage.currentSubMenuKey));
}
export function setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 设置当前选择部门id
 * @params did,当前部门id
 * 部门脱帽统计查看统计详情使用
 */
export function setCurrentDepartId(did) {
    sessionStorage.setItem(constant.storage.currentDepartId, JSON.stringify(did ? did : null));
}
/**获取当前部门ID**/
export function getCurrentDepartId() {
    return JSON.parse(sessionStorage.getItem(constant.storage.currentDepartId));
}

export function getLocalStorage(key) {
    let obj = JSON.parse(window.localStorage.getItem(key));
    if (obj && obj !== 'undefined' && obj !== 'null') {
        return obj;
    }
    return '';
}

export function removeLocalStorage(key) {
    if (key) {
        window.localStorage.removeItem(key);
    } else {
        for (let i in arguments) {
            window.localStorage.removeItem(arguments[i]);
        }
    }
}
export function setSessionStorage(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorage(key) {
    let obj = window.sessionStorage.getItem(key);
    if (obj && obj !== 'undefined' && obj !== 'null') {
        return JSON.parse(obj);
    }
    return '';
}

export function removeSessionStorage(key) {
    if (key) {
        window.sessionStorage.removeItem(key);
    } else {
        for (let i in arguments) {
            window.sessionStorage.removeItem(arguments[i]);
        }
    }
}
/**
 *设置报警处理 是否显示已结束
 *@param obj,是否显示状态
 **/
export function setShowEnded(obj) {
    sessionStorage.setItem(constant.storage.showEnded, JSON.stringify(obj || null));
}
/**获取报警处理显示已结束状态*/
export function getShowEnded() {
    return JSON.parse(sessionStorage.getItem(constant.storage.showEnded));
}
// 当前用户token
/**设置sessionStorage**/
export function setSessionStorageToken(token) {
    sessionStorage.setItem(constant.storage.currentToken, token);
}
/**获取sessionStorage **/
export function getSessionStorageToken() {
    return sessionStorage.getItem(constant.storage.currentToken);
}
/**设置localStorage**/
export function setLocalStorageToken(token) {
    window.localStorage.setItem(constant.storage.currentToken, token);
}
/**获取localStorage**/
export function getLocalStorageToken() {
    return localStorage.getItem(constant.storage.currentToken);
}
