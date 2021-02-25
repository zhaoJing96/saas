/* eslint-disable no-unused-vars */
// 主控台
import React, { useEffect, useRef } from 'react';
import THREE from '@/common/three';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
const modelUrl = require('@/static/images/model/SJKPr.glb');
let scene, camera, renderer, controls, composer;
let isComposer = false; // 是否组合渲染，现实选中高光效果
let delta = new THREE.Clock().getDelta();//getDelta()方法获得两帧的时间间隔

const Datahub = () => {
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
    // 加载模型
    function setGltfModel() {
        // 导入GlTF模型
        let gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(modelUrl, (gltf) => {
            console.log(gltf);
            gltf.scene.traverse(obj => {
                // 模型Mesh开启阴影
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });
            scene.add(gltf.scene);
        });
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
    useEffect(() => {
        // 定义场景
        scene = new THREE.Scene();
        // 灯光
        setLight();
        // 加载模型
        setGltfModel();
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
        // 渲染
        renderFn();
    }, []);
    return <div className="ui_datahub_container">
        <div className="ui_model_container" ref={datahubBox}></div>
        <div className="ui_model_list_box">
            <Button className='return_btn'>
                <LeftOutlined />
                返回
            </Button>
            <div className='model_item'>模型1</div>
            <div className='model_item'>模型2</div>
            <div className='model_item'>模型3</div>
            <div className='model_item'>模型4</div>
            <div className='model_item'>模型5</div>
            <div className='model_item'>模型6</div>
        </div>
    </div>;
};
export default Datahub;