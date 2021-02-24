import http from '@/common/http';
import {
    getUUid
} from '@/common/utils';
import websocketGlobal from '@/common/websocket/websocketGlobal.js';
import { getToken } from '@/common/utils';
import user from '@/common/store/user';
import routers from '@/common/router';
const server = require('@/common/api');
//登录令牌
export const LOGINSECRET = {
    id: 'web',
    secret: 'sKuBjFlMsUiPsKlO',
    wxAppid: 'wx4a11ae335e843db1',
    key: getUUid()
};

/**
 * 获取图形验证码,图片的参数
 * @param "height": 40,
 * @param "key": "string",
 * @param "lineSize": 0,
 * @param "stringNum": 4,
 * @param "width": 100
 * */

export const getImgCode64 = data => http.POST(server.versatile + '/verifyCode/base64', data);
//手机号和密码登录
export const loginWithMobilePassword = data => http.POST(server.business + '/login/mobile', data);
// 手机短信登录
export const loginWithMobileNote = data => http.POST(server.business + '/login/sms', data);
// 手机短信登录(体验用户登录)
export const loginWithMobileNoteAuth = data => http.POST(server.authentication + '/authorize/sms', data);
// 发送短信验证码(手机注册/登录)
export const sendSMSVerificationCode = data => http.POST(server.versatile + '/sms/register', data);
// 发送短信验证码(已注册重置密码)
export const sendResetSMSVerificationCode = data => http.POST(server.versatile + '/sms/reset', data);
//登录界面的忘记密码,用于修改密码,传短信,密码,手机
export const updatePassword = data => http.PUT(server.account + '/user/fpw', data);
// 检测客户是否变为正式客户
export const loginCheckCustomerOfficial = data => http.GET(server.business + '/login/check/customer/official/' + data.phone);
//退出登录
export const tokenLogout = data => http.DELETE(server.authentication + '/token/logout', data);

export const logout = () => {
    if (getToken()) {
        tokenLogout().then((res) => {
            if (res && res.code === 200) {
                localStorage.clear();
                sessionStorage.clear();
                user.clearUser();
                routers.push('/');
                if (websocketGlobal && websocketGlobal.ws && websocketGlobal.ws.url) {
                    websocketGlobal.ws.onclose();
                }
            }
        });
    } else {
        routers.push('/');
    }
};
