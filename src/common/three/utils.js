/* eslint-disable */
import React from 'react';
import THREE from './index'
import threeJsStore from '@/common/store/threeJS'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import ReactDOM from 'react-dom';
import LoadingModels from '@/view/component/threeJS/loadingModels';
import './threebsp.js';

/**
 * # three.js
 * # 动画创建函数
 * @method createAnimationFn
 * @param {params} require: targetElem（动画目标，注意目标需要设置name）, vectorList（动画移动三维坐标）。其余具体见option
 * @return {AnimationAction} 动画对象。.play()为激活动画 .paused为暂停或开始动画
 */
function ThreeJsCreateAnimationFn(params) {
    if (!params.targetElem || !params.vectorList) {
        throw params.targetElem ? "动画创建错误：轨迹三维坐标必传" : "动画创建错误：运动目标必传";
    }
    const _paramsVectorList = params.vectorList
    if (!Array.isArray(_paramsVectorList) || _paramsVectorList.length < 2) {
        throw "动画创建错误：至少两个点才能组成一个运动轨迹";
    }
    // const gap = params.gap ? (params.gap < 100 ? 500 : params.gap) : 500
    const gap = params.gap || params.vectorList.length
    const option = {
        targetElem: params.targetElem, // 运动目标
        vectorList: params.vectorList, // 传入的关键三维坐标
        gap: gap, // 点粒度
        autoPlay: params.autoPlay, // 自动播放
        loop: params.loop, // 循环播放
        timeScale: params.timeScale, // 播放速度
        clampWhenFinished: params.clampWhenFinished // 播放结束是否暂停在最后一帧
    }
    let _animationTimeLine = [] // 关键帧时间数组
    let _animationList = [] // 时间对应的帧
    let _curve = new THREE.CatmullRomCurve3(option.vectorList)
    const _pointList = _curve.getSpacedPoints(option.gap)
    _pointList.map((item, index) => {
        _animationList.push(item.getComponent(0))
        _animationList.push(item.getComponent(1))
        _animationList.push(item.getComponent(2))
        _animationTimeLine.push(index)
    })
    const _posTrack = new THREE.KeyframeTrack(`${option.targetElem.name}.position`, _animationTimeLine, _animationList)
    const _animateDuration = _animationTimeLine.length
    const _animationClip = new THREE.AnimationClip(`动画${option.targetElem.name || 'defaultAniamte'}`, _animateDuration, [_posTrack])
    const _animationMixer = new THREE.AnimationMixer(option.targetElem)
    const _animationAction = _animationMixer.clipAction(_animationClip)
    _animationAction.timeScale = option.timeScale
    _animationAction.repetitions = option.gap // 剪辑执行次数
    !option.loop ? _animationAction.loop = THREE.LoopOnce : ''
    _animationAction.clampWhenFinished = option.clampWhenFinished
    const _clock = new THREE.Clock();
    function animationFn() {
        let animationId = null
        threeJsStore.setThreeJsAnimateTimeRecord(_animationAction.time)
        if (_animationAction.time === _animationTimeLine.length) {
            return cancelAnimationFrame(animationId)
        }
        _animationMixer.update(_clock.getDelta())
        animationId = requestAnimationFrame(() => {
            animationFn()
        })
    }
    animationFn()
    if (option.autoPlay) {
        _animationAction.play()
    }
    return _animationAction
}

/**
 * # three.js
 * # 模型轮廓描边函数
 * @method createAnimationFn
 * @param {params} require: targetElem(作用目标), camera(相机), renderer(渲染函数)
 * @return {void}
 */
function ThreeJsModuleOutLineFn(params) {
    if (!params.targetElem || !params.camera, !params.renderer) {
        throw "后期处理创建错误：targetElem、camera、renderer必传"
    }
    // 参数初始化
    const option = {
        targetElem: params.targetElem, // 作用目标
        appointTarget: params.appointTarget, // 指定描边的目标 type = Array
        camera: params.camera, // 相机
        renderer: params.renderer, // 渲染函数
        edgeStrength: params.edgeStrength, // 线条宽度 默认3
        edgeGlow: params.edgeGlow, // 线条扩散强度 0-1 默认1
        edgeThickness: params.edgeThickness, // 线条模糊化 0-1 默认1
        pulsePeriod: params.pulsePeriod, // 线条闪烁频率 默认0
        visibleEdgeColor: params.visibleEdgeColor, // 线条颜色 默认0xffffff
        usePatternTexture: params.usePatternTexture, // 命中时目标是否显示其纹理, 传入图片地址即可
        event: params.event || 'mousemove' // 触发事件 默认mousemove
    }
    // 创建效果处理器
    const _composer = new EffectComposer(option.renderer)
    const _renderPass = new RenderPass(option.targetElem, option.camera)
    _composer.addPass(_renderPass)
    const _outLineVector2 = new THREE.Vector2(window.innerWidth, window.innerHeight)
    const _outlinePass = new OutlinePass(_outLineVector2, option.targetElem, option.camera)
    _outlinePass.edgeStrength = option.edgeStrength || 2.0
    _outlinePass.edgeGlow = option.edgeGlow || 0.1
    _outlinePass.edgeThickness = option.edgeThickness || 0.1
    _outlinePass.pulsePeriod = option.pulsePeriod || 0
    option.usePatternTexture ? _outlinePass.usePatternTexture = true : ''
    option.visibleEdgeColor ? _outlinePass.visibleEdgeColor.set(option.visibleEdgeColor) : ''
    _composer.addPass(_outlinePass)
    if (_outlinePass.usePatternTexture) {
        const _outLineImgTexture = texture => {
            _outlinePass.patternTexture = texture
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
        }
        const _imgLoader = new THREE.TextureLoader()
        _imgLoader.load(option.usePatternTexture, _outLineImgTexture)
    }
    // 拷贝渲染结果
    const _copyPass = new ShaderPass(CopyShader)
    _copyPass.renderToScreen = true
    _composer.addPass(_copyPass)
    // 以下是鼠标拾取逻辑
    const _raycaster = new THREE.Raycaster()
    const _selectedObjects = null
    // 获取鼠标移动时坐标获取
    function getMoveCoordinates(event) {
        const coordinates = {}
        let x = 0, y = 0
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX
            y = event.changedTouches[0].pageY
        } else {
            x = event.clientX
            y = event.clientY
        }
        coordinates.x = (x / window.innerWidth) * 2 - 1
        coordinates.y = - (y / window.innerHeight) * 2 + 1
        getCurrentCheckIntersection(coordinates)
    }
    // 获取第一个交集模型
    function getCurrentCheckIntersection(coordinates) {
        _raycaster.setFromCamera(coordinates, option.camera)
        const intersects = _raycaster.intersectObject(option.targetElem, true)
        _outlinePass.selectedObjects = []
        if (intersects.length > 0) {
            const _targetElem = intersects[0].object
            const _appointTarget = params.appointTarget
            if (_appointTarget.length > 0) {
                const _hasTarget = _appointTarget.findIndex(name => name === _targetElem.name)
                if (_hasTarget >= 0) {
                    _outlinePass.selectedObjects = [_targetElem]
                }
            } else {
                _outlinePass.selectedObjects = [_targetElem]
            }
        }
    }
    // 添加页面响应式
    function onWindowResize() {
        const width = window.innerWidth
        const height = window.innerHeight
        option.camera.aspect = width / height
        option.camera.updateProjectionMatrix()
        option.renderer.setSize(width, height)
        _composer.setSize(width, height)
    }
    // 监听事件
    window.addEventListener(option.event, getMoveCoordinates)
    window.addEventListener('resize', onWindowResize, false)
    // 渲染效果处理器
    function updateComposer() {
        requestAnimationFrame(updateComposer)
        _composer.render()
    }
    updateComposer()
}

/**
 * # three.js
 * # 轨迹生成函数
 * @method ThreeJsCreateTrackFn
 * @param {params} require: list(数据源: 数组)
 * @return {_mesh} 返回一个轨迹材质。再add to scene即可
 */
function ThreeJsCreateTrackFn(params) {
    if (!params.list || !Array.isArray(params.list)) {
        throw "轨迹创建错误：list为数组必传"
    }
    // const segments = params.segments ? (params.segments < 100 ? 500 : params.segments) : 64
    const segments = params.segments || 64
    const option = {
        list: params.list, // 轨迹关键点
        radius: params.radius || 1, // 管道半径
        segments: segments, // 总段数，管道是一节一节组成的
        radialSegments: params.radialSegments || 8, // 横截面段数，控制管道是否圆润
        color: params.color || 0x00ff00, // 管道颜色
        isClose: !!params.isClose // 是否关闭管道
    }
    const _curveList = new THREE.CatmullRomCurve3(option.list)
    const _geometry = new THREE.TubeGeometry(_curveList, option.segments, option.radius, option.radialSegments, option.isClose)
    const _material = new THREE.MeshBasicMaterial({ color: option.color, side: THREE.DoubleSide })
    const _mesh = new THREE.Mesh(_geometry, _material)
    return _mesh
}

/**
 * # three.js
 * # 基于tween.js补间动画简易封装函数
 * @method ThreeJsTweenFn
 * @param {params} require: start{x,y,z} end{x,y,z}
 * @return {_mesh} 返回一个start ——> end的动画对象
 */
function ThreeJsTweenFn(start, end, timer = 1500) {
    if (!start || !end) {
        throw "补间动画创建错误：注意参数"
    }
    const _tween = new TWEEN.Tween(start)
    let _anmateId = null
    _tween._status = true
    _tween.to(end, timer)
    _tween.start()
    function _updateFn() {
        if (!_tween._status) {
            TWEEN.remove(_tween)
            return cancelAnimationFrame(_anmateId)
        }
        TWEEN.update()
        _anmateId = requestAnimationFrame(_updateFn)
    }
    _updateFn()
    return _tween
}

/**
 * # three.js
 * # 相机观察目标切换函数
 * @method ThreeJsObserverChangeFn
 * @param {params} require: list(数据源: 数组)
 * @return {void}
 */
function ThreeJsObserverChangeFn(params) {
    const option = {
        ctrls: params.ctrls, // OrbitControls 控制器
        targetElem: params.targetElem, // 观察目标
        timer: params.timer, // 过度时长
    }
    const _ctrls = option.ctrls
    const _startTarget = _ctrls.target
    const _endTarget = option.targetElem.position
    const _start = {
        x: _startTarget.x,
        y: _startTarget.y,
        z: _startTarget.z
    }
    const _end = {
        x: _endTarget.x,
        y: _endTarget.y,
        z: _endTarget.z
    }
    _ctrls.enabled = false
    const _tween = ThreeJsTweenFn(_start, _end, option.timer)
    _tween.onUpdate(function (object) {
        _ctrls.target.x = object.x
        _ctrls.target.y = object.y
        _ctrls.target.z = object.z
        _ctrls.update()
    }).onComplete(function () {
        _ctrls.enabled = true
        _tween._status = false
    })
}

/**
 * # three.js
 * # 碰撞检测函数 两个模型之间是否碰撞
 * @method ThreeJsCollisionDetectionFn
 * @param {*} require: meshObj1, meshObj2
 * @return {boolean} boolean
 */
function ThreeJsCollisionDetectionFn(meshObj1, meshObj2) {
    meshObj1.geometry.computeBoundingBox()
    meshObj2.geometry.computeBoundingBox()
    meshObj1.updateMatrixWorld()
    meshObj2.updateMatrixWorld()
    const box1 = meshObj1.geometry.boundingBox.clone()
    box1.applyMatrix4(meshObj1.matrixWorld)
    const box2 = meshObj2.geometry.boundingBox.clone()
    box2.applyMatrix4(meshObj2.matrixWorld)
    const result = box1.intersectsBox(box2)
    return result
}
/**
 * 设置镜头拉近效果
 * @param {*} controls 控制器
 * @param {*} camera 相机对象
 * @param {*} aimsPosition 目标位置
 * @param {*} time 拉近时间
 * @param {*} callback 回调函数
 * @param {*} initType 是否直接拉到目标位置  true直接拉到目标位置  false把镜头拉到修正位置
 * @param { * } radiusY 角度 或者说 Y轴高度
 */
function setCameraPosition(controls, camera, aimsPosition, time, callback, radius = 10, initType = false) {
    //- 摄像机看向的位置
    let lookPosition = new THREE.Vector3(aimsPosition.x, aimsPosition.y, aimsPosition.z);
    // lookPosition.y += radius * 1.5;
    //- 计算镜头到目标点的距离,用于判断位置偏移矫正
    let datas = [
        {
            position: { x: aimsPosition.x - (radius * 2.0), y: aimsPosition.y + (radius * 1.5), z: aimsPosition.z - (radius * 2.0) },
            distance: 0
        },
        {
            position: { x: aimsPosition.x + (radius * 2.0), y: aimsPosition.y + (radius * 1.5), z: aimsPosition.z + (radius * 2.0) },
            distance: 0
        },
        {
            position: { x: aimsPosition.x + (radius * 2.0), y: aimsPosition.y + (radius * 1.5), z: aimsPosition.z - (radius * 2.0) },
            distance: 0
        },
        {
            position: { x: aimsPosition.x - (radius * 2.0), y: aimsPosition.y + (radius * 1.5), z: aimsPosition.z + (radius * 2.0) },
            distance: 0
        }
    ];
    datas[0].distance = camera.position.distanceTo(datas[0].position);
    datas[1].distance = camera.position.distanceTo(datas[1].position);
    datas[2].distance = camera.position.distanceTo(datas[2].position);
    datas[3].distance = camera.position.distanceTo(datas[3].position);
    let min = 0;
    let mindatas = datas[0].distance;
    for (let i = 0; i < datas.length; i++) {
        if (mindatas > datas[i].distance) {
            mindatas = datas[i].distance;
            min = i;
        }
    }
    //- 控制器
    let tweenObj1 = new TWEEN.Tween(controls.target)
        .to(aimsPosition, time)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(function () {
            controls.update();
        }).start().onComplete(() => {
            tweenObj1._status = false
        });
    //- 镜头
    let tweenObj2 = new TWEEN.Tween(camera.position)
        .to(initType ? aimsPosition : datas[min].position, time)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(() => {
            camera.lookAt(lookPosition)
        })
        .onComplete(function () {
            camera.lookAt(lookPosition)
            callback()
            tweenObj2._status = false
        }).start();
}
/**
 * 添加模型加载标签
 * @param {*} model 需要被添加加载中的模型
 */
function addModelLoadingInfo(model) {
    let domDiv = document.createElement('div');
    domDiv.className = 'loadingbox2';
    ReactDOM.render(
        <LoadingModels />,
        domDiv
    );
    domDiv.style.marginTop = '-1em';
    let loadingLabel = new THREE.CSS2DObject(domDiv);
    loadingLabel.position.set(0, 15, 0);
    // loadingLabel.scale.multiplyScalar(0.02); //- 缩放级别
    loadingLabel.name = 'loadingbox';
    model.add(loadingLabel);
}
function hideModelLoadingInfo(scene) {
    let loadingbox = scene.getObjectByName('loadingbox');
    if (loadingbox) {
        loadingbox.parent.remove(loadingbox);
    }
}
/**
 * 
 * @param {Object} scene  场景对象 
 * @param {*} wall  墙体材质 
 * @param {Array} center 中心点
 * @param {Number} radius 半径
 * @param {*} color 底座颜色
 */
function dropCircleElectricFence(scene, wall, center, radius, type, datas, color) {
    /**
     * 创建网格模型
     */
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(wall);
    texture.wrapS = THREE.RepeatWrapping; //水平方向如何包裹
    texture.wrapT = THREE.RepeatWrapping; // 垂直方向如何包裹
    // uv两个方向纹理重复数量、看板中重复数量
    texture.repeat.set(15, 1);
    let smallCylinderGeom = new THREE.CylinderGeometry(radius - 0.1, radius - 0.1, 1.5, 100, 14); //- 中心小圆
    let largeCylinderGeom = new THREE.CylinderGeometry(radius, radius, 1.5, 100, 4);  //- 外圆
    let smallCylinderBSP = new ThreeBSP(smallCylinderGeom);  //- 中心圆bsp对象
    let largeCylinderBSP = new ThreeBSP(largeCylinderGeom);   //- 外圈圆bsp对象
    let intersectionBSP = largeCylinderBSP.subtract(smallCylinderBSP);  //- 获取差集
    let redMaterial = new THREE.MeshBasicMaterial({   //- 设置空心圆柱体的样式
        map: texture,
        transparent: true,
        opacity: 1
    })
    let hollowCylinder = intersectionBSP.toMesh(redMaterial);  //- 添加样式
    if (center.length < 0) {
        return;
    }
    hollowCylinder.position.set(center[0], center[1], center[2]);
    //- 添加底座
    let geometry = new THREE.CircleGeometry(radius, 100);
    let material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    let circle = new THREE.Mesh(geometry, material);
    circle.position.set(center[0], center[1] + 1, center[2]);
    circle.rotateX(Math.PI / 2)
    //- 添加信息盒子基础点
    let infoPonitGeometry = new THREE.BoxGeometry(1, 1, 1);
    let infoPonitMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0
    });
    let cube = new THREE.Mesh(infoPonitGeometry, infoPonitMaterial);
    cube.position.set(center[0], center[1] + 1, center[2]);
    cube.name = 'infoPoint';

    let group = new THREE.Group()
    group.name = type;
    group.userData = datas;
    group.add(cube);
    group.add(circle);
    group.add(hollowCylinder);
    scene.add(group);
}
export {
    ThreeJsCreateAnimationFn,
    ThreeJsModuleOutLineFn,
    ThreeJsCreateTrackFn,
    ThreeJsTweenFn,
    ThreeJsObserverChangeFn,
    ThreeJsCollisionDetectionFn,
    setCameraPosition,
    addModelLoadingInfo,
    hideModelLoadingInfo,
    dropCircleElectricFence
}