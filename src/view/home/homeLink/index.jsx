import React, { Fragment } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { setMenuKeys, setOpenSubMenuKeys, getMenuKeys, getOpenSubMenuKeys } from '@/common/store/storage';
const { SubMenu } = Menu;

const HomeLink = observer(({ collapsed, collapsedEvent }) => {
    //设置一级导航Menu的KEY
    function onClickMunuEvent({ keyPath }) {
        setMenuKeys(keyPath);
    }
    //设置展开的SubMenu keys
    function onOpenChange(openKeys) {
        setOpenSubMenuKeys(openKeys);
    }
    //折叠
    function handleOnCollapsed() {
        onOpenChange([]);
        collapsedEvent();
    }
    const openKeys = getOpenSubMenuKeys();
    return <Fragment>
        <span className={collapsed ? 'collControl coll-ok' : 'collControl coll-no'} onClick={handleOnCollapsed}>
            <Icon type={collapsed ? 'right' : 'left'} />
        </span>
        <Menu
            mode="inline"
            selectedKeys={getMenuKeys()}
            openKeys={openKeys}
            onClick={onClickMunuEvent}
            onOpenChange={onOpenChange}
            inlineCollapsed={collapsed}>
            <Menu.Item key="saas_employee">
                <Link to="/home/member" replace>
                    <span>成员管理</span>
                </Link>
            </Menu.Item>
            <SubMenu
                key="device"
                title={
                    <a>
                        <span>设备管理</span>
                    </a>
                }>
                <Menu.Item key="saas_bind_device">
                    <Link to="/home/device/deviceBound" replace>已绑定设备</Link>
                </Menu.Item>
                <Menu.Item key="saas_unbind_device">
                    <Link to='/home/device/deviceUnbound' replace>未绑定设备</Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    </Fragment >;
});
export default HomeLink;
