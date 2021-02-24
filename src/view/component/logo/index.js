import React from 'react';
import { Link } from 'react-router-dom';
const logoWhite = require('@/static/images/logo-white.svg');
const logoBlack = require('@/static/images/logo-black.svg');
const logoYellow = require('@/static/images/logo_yellow.svg');
/**
*Logo,智安汇
*@param link,路由路径,如:'/','/login',也可以不传
*@param type,logo颜色,0是黑色,1是白色,2是黄色,如:1,默认2
*@param size,logo大小,如:40,默认40
*,使用方式: <Logo link="/" type={1}  size={40} />
*/
export default function Logo(props) {
    const { link, type, size } = props;
    let logoIcon = null;
    let logoSize = null;
    if (type === 0) {
        logoIcon = logoBlack;
    } else if (type === 1) {
        logoIcon = logoWhite;
    } else {
        logoIcon = logoYellow;
    }
    if (size) {
        logoSize = size;
    } else {
        logoSize = 40;
    }
    const logoStyle = { width: logoSize + 'px', height: logoSize + 'px', verticalAlign: 'middle' };
    const textStyle = { paddingLeft: '16px', color: type === 1 ? '#fff' : '#000', fontSize: '1.7em', verticalAlign: 'middle', fontWeight: '600' };
    let logoNode = null;
    if (link) {
        logoNode = <Link to={link}>
            <img src={logoIcon} style={logoStyle} />
            <span style={textStyle}>智安汇</span>
        </Link>;
    } else {
        logoNode = <span>
            <img src={logoIcon} style={logoStyle} />
            <span style={textStyle}>智安汇</span>
        </span>;
    }
    return logoNode;
}