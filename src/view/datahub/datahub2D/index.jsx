// 2D主控台
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { Map, View } from 'ol';
import * as Proj from 'ol/proj';
import TileLayer from 'ol/layer/Tile'; // 图层
import XYZ from 'ol/source/XYZ';
import dataHubStore from '@/common/store/datahub';
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'; // 图层
// import { XYZ, Vector as VectorSource } from 'ol/source';

const DataHub2D = () => {
    const [map, setMap] = useState(null); // map对象
    const [view, setView] = useState(null); // view对象
    const [modelList, setModelList] = useState([]); // 作业面标段列表
    const [showReturnBtn, setShowReturnBtn] = useState(false); // 返回按钮展示

    function amapFn() {
        let Amap = new TileLayer({
            source: new XYZ({
                maxZoom: 20,
                url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&scl=1&size=1&style=7&x={x}&y={y}&z={z}'
            })
        });
        return Amap;
    }
    // 设置列表数据和返回按钮状态
    function setReturnBtnOrList(currentSelectData) {
        const data = { ...dataHubStore.data };
        let lists = [];
        if (currentSelectData.pModelName) {
            setShowReturnBtn(true);
            // 确认对比是处于标段模型还是作业面
            if (currentSelectData.pModelName === data.modelName) {
                // 标段时，展示作业面列表，获取作业面列表
                for (let i = 0; i < data.bidSectionList.length; i++) {
                    const item = data.bidSectionList[i];
                    if (currentSelectData.modelName === item.modelName) {
                        lists = item.workFaceList;
                    }
                }
            } else {
                // 作业面时，无下级模型列表
                lists = [];
            }
        } else {
            // 项目模型时，无返回按钮，展示标段列表
            setShowReturnBtn(false);
            lists = data.bidSectionList;
        }
        setModelList(lists);
    }

    // 选择当前标段或者作业面
    function selectChildData(value) {
        console.log(value);
        // dataHubStore.setCurrentSelectData(value);
        setReturnBtnOrList(value);
    }

    useEffect(() => {
        if (dataHubStore.data) {
            // 设置初始选择模型
            setReturnBtnOrList(dataHubStore.data);
        }
    }, [dataHubStore.data]);

    useEffect(() => {

    }, [map]);

    useEffect(() => {
        // 监听地图视图，创建地图
        if (view) {
            // 创建实例
            const _map = new Map({
                target: 'map',
                layers: [amapFn()],
                view: view
            });
            setMap(_map);
        }

    }, [view]);
    useEffect(() => {
        // View用于创建2D视图
        const viewObj = new View({
            center: Proj.transform([103.9271879196, 30.7462617980], 'EPSG:4326', 'EPSG:3857'),
            zoom: 12
        });
        setView(viewObj);
    }, []);

    return <div className='ui_datahub2D_container'>
        {/* 地图盒子 */}
        <div className='ui_map_box' id='map'></div>
        <div className="ui_model_list_box">
            {
                showReturnBtn ? <Button className='return_btn'><LeftOutlined />返回</Button> : null
                // showReturnBtn ? <Button className='return_btn' onClick={() => returnLast()}><LeftOutlined />返回</Button> : null
            }
            {
                modelList.length > 0 ? modelList.map((item) => {
                    return <div className='model_item' key={item.modelName} onClick={() => selectChildData(item)}>{item.name}</div>;
                }) : <div className='model_item noData'>暂无数据</div>
            }
        </div>
    </div>;
};
export default DataHub2D;