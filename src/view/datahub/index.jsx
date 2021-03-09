// 主控台
import React, { useState } from 'react';
import DataHub3D from './datahub3D'; // 3D主控台
import DataHub2D from './datahub2D'; // 2D主控台

const DataHub = () => {
    const [select2DOr3D, setSelect2DOr3D] = useState(true); // true 3D, false 2D

    return <div className='ui_datahub_container'>
        {
            select2DOr3D ?
                <DataHub3D setSelect2DOr3D={setSelect2DOr3D} /> :
                <DataHub2D setSelect2DOr3D={setSelect2DOr3D} />
        }
    </div>;
};
export default DataHub;