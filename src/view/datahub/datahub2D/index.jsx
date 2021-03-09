// 2D主控台
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Map, View } from 'ol';
import * as Proj from 'ol/proj';
import { Tile as TileLayer } from 'ol/layer'; // 图层
import { XYZ } from 'ol/source';
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'; // 图层
// import { XYZ, Vector as VectorSource } from 'ol/source';

const DataHub2D = ({ setSelect2DOr3D }) => {
    const [map, setMap] = useState(null); // map对象
    const [view, setView] = useState(null); // view对象

    useEffect(() => {

    }, [map]);

    useEffect(() => {
        // 监听地图视图，创建地图
        if (view) {
            // 创建实例
            const _map = new Map({
                target: 'map',
                layers: [new TileLayer({
                    source: new XYZ({
                        maxZoom: 20,
                        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&scl=1&size=1&style=7&x={x}&y={y}&z={z}'
                    })
                })],
                view: view
            });
            setMap(_map);
        }

    }, [view]);
    useEffect(() => {
        // View用于创建2D视图
        const viewObj = new View({
            center: Proj.transform([103.9271879196, 30.7462617980], 'EPSG:4326', 'EPSG:3867'),
            zoom: 5
        });
        setView(viewObj);
    }, []);

    return <div className='ui_datahub2D_container datahub_container'>
        {/* 地图盒子 */}
        <div className='ui_map_box' id='map'></div>
        <Button className='select_2D3D_btn' onClick={() => { setSelect2DOr3D(true); }}>切换到3D</Button>
    </div>;
};
export default DataHub2D;