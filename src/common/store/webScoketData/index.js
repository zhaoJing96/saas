/**
 * websocket推送消息 数据处理
 * */

import {
    observable,
    action
} from 'mobx';

class WebsocketData {
    @observable data = {}
    @action.bound webOnMessage(res) {
        if (res) {
            console.log(res);
        }
    }
}
let websocketData = new WebsocketData();
export default websocketData;
