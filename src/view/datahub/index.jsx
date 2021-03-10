// 主控台
import React, { useState } from 'react';
import { Button } from 'antd';
import DataHub3D from './datahub3D'; // 3D主控台
import DataHub2D from './datahub2D'; // 2D主控台

const DataHub = () => {
    const [select2DOr3D, setSelect2DOr3D] = useState(false); // true 3D, false 2D

    return <div className='ui_datahub_container'>
        {
            select2DOr3D ?
                <DataHub3D setSelect2DOr3D={setSelect2DOr3D} /> :
                <DataHub2D setSelect2DOr3D={setSelect2DOr3D} />
        }
        {/* 2D/3D切换按钮 */}
        {
            select2DOr3D ?
                <Button className='select_2D3D_btn' onClick={() => { setSelect2DOr3D(false); }}>切换到2D</Button> :
                <Button className='select_2D3D_btn' onClick={() => { setSelect2DOr3D(true); }}>切换到3D</Button>
        }
    </div>;
};
export default DataHub;