/* eslint-disable no-unused-vars */
// 主控台
import React, { useEffect, useRef, useState } from 'react';
import THREE from '@/common/three';
import { Button } from 'antd';
import { getCanvasIntersects } from '@/common/utils/three.js';
import { LeftOutlined } from '@ant-design/icons';
import dataHubStore from '@/common/store/datahub';
import { Fragment } from 'react';
// const modelUrl = require('@/static/images/model/SJKPr.glb');
let scene, camera, renderer, controls, composer, outlinePass;
let isComposer = false; // 是否组合渲染，现实选中高光效果
let delta = new THREE.Clock().getDelta();//getDelta()方法获得两帧的时间间隔

const Datahub = () => {
    const [modelData, setModelData] = useState([]); // 模型对象,处理筛选标段、作业面
    const [showReturnBtn, setShowReturnBtn] = useState(false); // 是否展示返回按钮
    const datahubBox = useRef(); // canvas盒子
    // 设置灯光
    function setLight() {
        //- 添加平行光光源
        let hemiLightTop = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
        let hemiLightBottom = new THREE.HemisphereLight(0xffffff, 1);
        let lightTop = new THREE.DirectionalLight(0xffffff, 0.1);
        let lightAfter = new THREE.DirectionalLight(0xffffff, 0.5);
        hemiLightTop.position.set(0, 2000, 0);
        hemiLightBottom.position.set(0, 0, 0);
        lightTop.position.set(4, 6, 4);
        lightAfter.position.set(0, 0, 2000);
        scene.add(hemiLightTop);
        scene.add(hemiLightBottom);
        scene.add(lightTop);
        scene.add(lightAfter);
        // 光源开启阴影
        lightTop.castShadow = true;
        lightTop.shadow.mapSize = new THREE.Vector2(1024, 1024);
        lightTop.shadow.bias = -0.001;
    }
    /**
     * 加载项目or标段模型
     * @param {*} model 模型数据
     * @param {*} init  是否是初始项目模型
     */
    function setGltfModel(model, init) {
        // 导入GlTF模型
        let gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(model.modelUrl, (gltf) => {

            // 设置当前模型对象
            dataHubStore.setCurrentModel(model);

            let modelArr = []; // 临时数组，储存标段作业面，用于高亮
            gltf.scene.traverse(obj => {
                if (obj.isMesh) {
                    // 模型Mesh开启阴影
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    // 判断是否是标段模型or作业面模型，用于高亮选中
                    let filterName = obj.name.substring(obj.name.length - 2);
                    if (filterName === 'BD' || filterName === 'WR') {
                        modelArr.push(obj);
                        setModelData(modelArr);
                    }
                    // 存储初始加载项目模型时可高亮对象
                    if (init) {
                        dataHubStore.setInitModel(modelArr);
                    }
                }
            });
            scene.add(gltf.scene);
        });
    }

    // 设置模型高亮选中
    function setComposer(width, height) {
        // 设置高亮
        composer = new THREE.EffectComposer(renderer); // 配置composer
        let renderPass = new THREE.RenderPass(scene, camera); // 配置通道
        composer.addPass(renderPass); // 将通道加入composer
        outlinePass = new THREE.OutlinePass(new THREE.Vector2(width, height), scene, camera);
        outlinePass.visibleEdgeColor.set('#fff000'); // 选中颜色
        outlinePass.edgeStrength = 1; // 强度
        outlinePass.edgeGlow = 2; // 边缘明暗度
        outlinePass.renderToScreen = true; // 设置这个参数的目的是马上将当前的内容输出
        composer.addPass(outlinePass);
        composer.selectedObjectEffect = function (objs) {
            let selectedObjects = [];
            selectedObjects.push(objs);
            outlinePass.selectedObjects = selectedObjects;
        };
    }

    // 移除模型, 隐藏前一个模型
    function removeModel() {
        const currentModel = { ...dataHubStore.currentModel };
        scene.traverse(function (child) {
            if (child.name === currentModel.modelName) {
                child.visible = false;
            }
        });
    }
    /**
     * 选择标段模型or作业面模型
     * @param {*} value 模型相关数据
     */
    function selectChildModel(value) {
        // 移除上一个模型
        removeModel();
        // 加载当前模型，设置模型初始值
        setGltfModel(value);
    }

    // 返回上一级
    function returnLast(type) {
        const currentModel = { ...dataHubStore.currentModel };
        if (!currentModel.pModelName) {
            return;
        }
        scene.traverse(function (child) {
            if (currentModel.pModelName) {
                // 显示上一级
                if (child.name === currentModel.pModelName) {
                    child.visible = true;
                }
                // 隐藏自身
                if (child.name === currentModel.modelName) {
                    child.visible = false;
                }
            }
        });
        // 返回到项目模型时，定义当前模型初始值
        if (type === 'product') {
            // 设置当前模型数据为项目模型数据
            dataHubStore.setCurrentModel(dataHubStore.data);
            // 返回项目模型后重置模型高亮部分数据
            setModelData([...dataHubStore.initModel]);
            // 返回项目模型后隐藏返回按钮
            setShowReturnBtn(false);
        }
    }
    // 渲染函数
    function renderFn() {
        requestAnimationFrame(renderFn);
        THREE.TWEEN.update(); // 补间动画执行
        if (isComposer) {
            // 组合渲染器，渲染高亮
            composer.render(delta);
        } else {
            // 用相机渲染一个场景
            renderer.render(scene, camera);
        }
    }
    // 监听窗体变化、自适应窗体事件
    function onWindowResize() {
        let width = datahubBox.current.offsetWidth;
        let height = datahubBox.current.offsetHeight;
        camera.left = width / - 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        // 更新相机投影矩阵，在相机任何参数被改变以后必须被调用
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    useEffect(() => {
        // 返回按钮展示
        const data = { ...dataHubStore.currentModel };
        if (data.pModelName) {
            setShowReturnBtn(true);
        }
    }, [dataHubStore.currentModel]);

    useEffect(() => {
        // 监听鼠标移动事件、设置高亮
        if (modelData) {
            datahubBox.current.addEventListener('mousemove', (event) => {
                let selectObj = getCanvasIntersects(event, modelData, camera, datahubBox.current);
                if (selectObj && selectObj.length > 0) {
                    isComposer = true;
                    composer.selectedObjectEffect(selectObj[0].object);
                } else {
                    isComposer = false;
                }
            });
        }
    }, [modelData]);

    useEffect(() => {
        // 监听点击事件，模型切换
        if (modelData) {
            datahubBox.current.addEventListener('click', (event) => {
                let selectObj = getCanvasIntersects(event, modelData, camera, datahubBox.current);
                if (selectObj && selectObj.length > 0) {
                    // 获取当前点击模型名称
                    let selectModelName = selectObj[0].object.name;
                    let data = dataHubStore.data;
                    // 判断是否是标段模型or作业面模型，确认跳转模型
                    let filterName = selectModelName.substring(selectModelName.length - 2);
                    // 标段模型处理
                    if (filterName === 'BD') {
                        // 遍历标段列表，查找当前点击标段模型数据
                        for (let i = 0; i < data.bidSectionList.length; i++) {
                            const item = data.bidSectionList[i];
                            let model = item.pModelName + '_' + item.modelName;
                            // 加载标段模型
                            if(selectModelName === model){
                                selectChildModel(item);
                            }
                        }
                    } else if (filterName === 'WR') {
                        console.log(111111);
                    }
                }
            });
        }
    }, [modelData]);

    useEffect(() => {
        // 监听窗体变化
        window.addEventListener('resize', onWindowResize, false);
    }, []);

    useEffect(() => {
        // 定义场景
        scene = new THREE.Scene();
        // 灯光
        setLight();
        // 加载模型
        setGltfModel(dataHubStore.data, 'init');
        // 获取盒子宽高设置相机和渲染区域大小
        let width = datahubBox.current.offsetWidth;
        let height = datahubBox.current.offsetHeight;
        let k = width / height;
        // 定义相机
        camera = new THREE.PerspectiveCamera(45, k, 0.25, 10000);
        camera.position.set(-1500, 2000, -3000);
        camera.lookAt(scene.position);
        // 创建一个webGL对象
        renderer = new THREE.WebGLRenderer({
            //增加下面两个属性，可以抗锯齿
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height); // 设置渲染区域尺寸
        renderer.setClearColor(0x000000, 0.5); // 设置颜色透明度
        // 首先渲染器开启阴影
        renderer.shadowMap.enabled = true;
        // 挂载到DOM节点
        datahubBox.current.appendChild(renderer.domElement);

        // 监听鼠标事件
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;//设置为true则启用阻尼(惯性)，默认false
        // controls.dampingFactor = 0.05;//值越小阻尼效果越强
        // 高亮设置
        setComposer(width, height);
        // 渲染
        renderFn();
    }, [dataHubStore.data]);
    return <div className="ui_datahub_container">
        <div className="ui_model_container" ref={datahubBox}></div>
        <div className="ui_model_list_box">
            {
                showReturnBtn ? <Fragment>
                    {
                        dataHubStore.currentModel.pModelName === dataHubStore.data.modelName ?
                            <Button className='return_btn' onClick={() => returnLast('product')}><LeftOutlined />返回</Button> :
                            <Button className='return_btn' onClick={() => returnLast('bidsection')}><LeftOutlined />返回</Button>
                    }
                </Fragment> : null
            }
            {
                dataHubStore.data && dataHubStore.data.bidSectionList.length > 0 && dataHubStore.data.bidSectionList.map((item) => {
                    return <div className='model_item' key={item.modelName} onClick={() => selectChildModel(item)}>{item.name}</div>;
                })
            }
        </div>
    </div>;
};
export default Datahub;