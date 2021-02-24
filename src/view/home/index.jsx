// 后台页面框架结构
import React, { Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import HomeHead from './homeHead';
import HomeLink from './homeLink';

const HomeRouterWapper = observer(({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    //切换折叠
    function toggleCollapsed() {
        setCollapsed(!collapsed);
    }
    const homeRenderNode = (
        <Fragment>
            <div className="sass-ui-container">
                {/* 头部 */}
                <HomeHead />
                <div className="sass-ui-content">
                    <Fragment>
                        <div className={collapsed ? "sass-ui-left active" : "sass-ui-left"}>
                            {/* 菜单 */}
                            <HomeLink
                                collapsed={collapsed}
                                collapsedEvent={() => toggleCollapsed()}
                            />
                        </div>
                        <div className={collapsed ? "sass-ui-right" : "sass-ui-right active"}>
                            {/* 内容 */}
                            {children}
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
    return homeRenderNode;
});
export default HomeRouterWapper;
