/* eslint-disable no-unused-vars */
// 主控台
import React, { useEffect, useRef } from 'react';
import THREE from '@/common/three';
// import { getCanvasIntersects } from '@/common/utils/three.js'; // three自定义公共方法
// const modelUrl = require('@/static/image/ZN_Mao.glb');

let scene, camera, renderer, controls, composer;
let isComposer = false; // 是否组合渲染，现实选中高光效果
let delta = new THREE.Clock().getDelta();//getDelta()方法获得两帧的时间间隔
const Datahub = () => {
    const datahubBox = useRef(); // canvas盒子
    // 设置灯光
    function setLight() {
        //- 添加平行光光源
        let lightTop = new THREE.DirectionalLight(0xffffff, 0.1);
        let lightBottom = new THREE.DirectionalLight(0xffffff, 0.1);
        let lightLeft = new THREE.DirectionalLight(0xffffff, 0.6);
        let lightRight = new THREE.DirectionalLight(0xffffff, 0.6);
        let lightBefore = new THREE.DirectionalLight(0xffffff, 0.6);
        let lightAfter = new THREE.DirectionalLight(0xffffff, 0.6);
        lightTop.position.set(4, 6, 4);
        lightBottom.position.set(4, -6, 4);
        lightLeft.position.set(5, 6, 0);
        lightRight.position.set(-5, 6, 0);
        lightBefore.position.set(-1, -1, -1);
        lightAfter.position.set(1, -1, 1);
        scene.add(lightTop);
        // 光源开启阴影
        lightTop.castShadow = true;
        lightTop.shadow.mapSize = new THREE.Vector2(1024, 1024);
        lightTop.shadow.bias = -0.001;
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

        //坐标辅助线加入到场景中
        // let axisHelper = new THREE.AxesHelper();
        // scene.add(axisHelper);

        // 获取盒子宽高设置相机和渲染区域大小
        let width = datahubBox.current.offsetWidth;
        let height = datahubBox.current.offsetHeight;
        let k = width / height;
        // 定义相机
        camera = new THREE.PerspectiveCamera(5, k, 0.1, 100);
        camera.position.set(1, 0, 6);
        camera.lookAt(scene.position);
        // 创建一个webGL对象
        renderer = new THREE.WebGLRenderer({
            //增加下面两个属性，可以抗锯齿
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height); // 设置渲染区域尺寸
        renderer.setClearColor(0x000000, 1); // 设置颜色透明度
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
        <div style={{ width: '100%', height: '100%' }} ref={datahubBox}></div>
    </div>;
};
export default Datahub;