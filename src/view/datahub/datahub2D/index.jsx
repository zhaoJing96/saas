// 2D主控台
import React from 'react';
import { Button } from 'antd';

const DataHub2D = ({ setSelect2DOr3D }) => {
    return <div className='ui_datahub2D_container'>
        2D主控台
        <Button onClick={() => { setSelect2DOr3D(true); }}>切换到3D</Button>
    </div>;
};
export default DataHub2D;