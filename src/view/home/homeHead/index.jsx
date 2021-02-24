import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Row } from 'antd';
import { localSocket } from '@/common/websocket/index.js';
import websocketGlobal from '@/common/websocket/websocketGlobal.js';

const HomeHead = observer(() => {
    useEffect(() => {
        // 判断websocket是否连接
        if (websocketGlobal.ws && websocketGlobal.ws.readyState === 1) {
            return;
        }
        localSocket();//连接websocket
    }, []);
    return <Row type="flex" justify="space-between" align="middle" className="sass-ui-head"></Row >;
});
export default HomeHead;
