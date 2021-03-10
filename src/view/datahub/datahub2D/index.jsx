// 2D主控台
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { Map, View } from 'ol';
import * as Proj from 'ol/proj';
import TileLayer from 'ol/layer/Tile'; // 图层
import XYZ from 'ol/source/XYZ';
import dataHubStore from '@/common/store/datahub'; // 主控台store
import dataHub2DStore from '@/common/store/datahub/datahub2D'; // 2D主控台store
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
        // 设置当前模型数据
        dataHub2DStore.setCurrentSelectData(value);
        setReturnBtnOrList(value);
    }
    // 返回上一级
    function returnLast() {
        const currentSelectData = { ...dataHub2DStore.currentSelectData };
        // 判断是上一级是项目还是标段
        if (currentSelectData.pModelName === dataHubStore.data.modelName) {
            // 设置当前数据为项目数据
            dataHub2DStore.setCurrentSelectData(dataHubStore.data);
            // 返回项目后隐藏返回按钮、重置列表数据
            setReturnBtnOrList(dataHubStore.data);
        } else {
            for (let i = 0; i < dataHubStore.data.bidSectionList.length; i++) {
                const item = dataHubStore.data.bidSectionList[i];
                if (item.modelName === currentSelectData.pModelName) {
                    // 设置当前模型数据
                    dataHub2DStore.setCurrentSelectData(item);
                    // 设置模型列表数据，按钮状态
                    setReturnBtnOrList(item);
                }
            }
        }
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

    useEffect(() => {
        return () => {
            // 重置数据
            dataHub2DStore.reset2DSetting();
        };
    }, []);

    return <div className='ui_datahub2D_container'>
        {/* 地图盒子 */}
        <div className='ui_map_box' id='map'></div>
        <div className="ui_model_list_box">
            {
                showReturnBtn ? <Button className='return_btn' onClick={() => returnLast()}><LeftOutlined />返回</Button> : null
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