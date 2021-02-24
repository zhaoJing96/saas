// three.js的工具文件
import THREE from '@/common/three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
// 天空盒子环境贴图图片
const skyZ1 = require('@/static/images/three/Sky_DayZ1.png');
const skyZ2 = require('@/static/images/three/Sky_DayZ2.png');
const skyX1 = require('@/static/images/three/Sky_DayX1.png');
const skyX2 = require('@/static/images/three/Sky_DayX2.png');
const skyY1 = require('@/static/images/three/Sky_DayY1.png');
const skyY2 = require('@/static/images/three/Sky_DayY2.png');

// 获取与射线相交的对象数组
/**
 * @param { 事件对象 } event
 * @param { 场景对象 } scene
 * @param { 镜头对象 } camera
 * @param canvas 绘制盒子
 * 当canvas不占满整屏时射线拾取存在偏差，获取点击对象
 */
function getCanvasIntersects(event, scene, camera, canvas) {
    event.preventDefault();
    // 获取元素的大小及其相对于视口的位置
    let getBoundingClientRect = canvas.getBoundingClientRect();
    // 屏幕坐标转标准设备坐标
    let x = ((event.clientX - getBoundingClientRect.left) / canvas.offsetWidth) * 2 - 1; // 标准设备横坐标
    let y = -((event.clientY - getBoundingClientRect.top) / canvas.offsetHeight) * 2 + 1; // 标准设备纵坐标

    let vector = new THREE.Vector3(x, y, 1); // 标准设备坐标
    // 标准设备坐标转世界坐标
    let worldVector = vector.unproject(camera);
    // 射线投射方向单位向量(worldVector坐标减相机位置坐标)
    let ray = worldVector.sub(camera.position).normalize();
    // 创建射线投射器对象
    let rayCaster = new THREE.Raycaster(camera.position, ray);
    // 返回射线选中的对象 第二个参数如果不填 默认是false
    let intersects = rayCaster.intersectObjects(scene.children, true);
    //返回选中的对象数组
    return intersects;
}

//- 点击事件 获取某一个盒子canvas中模型对象
function getBoxClickObjFn(event, scene, camera, canvas) {
    let intsersects = getCanvasIntersects(event, scene, camera, canvas);
    if (intsersects.length > 0) {
        return intsersects;
    }
}

// 获取与射线相交的对象数组
/**
 * @param { 事件对象 } event
 * @param { 场景对象 } scene
 * @param { 镜头对象 } camera
 */
function getBodyCanvasIntersects(event, scene, camera) {
    // 声明 raycaster 和 mouse 变量
    let rayCaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    event.preventDefault();
    if (event.touches) {
        mouse.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
    } else {
        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    rayCaster.setFromCamera(mouse, camera);
    // 返回射线选中的对象 第二个参数如果不填 默认是false
    let intersects = rayCaster.intersectObjects(scene.children, true);
    //返回选中的对象数组
    return intersects;
}
//- 点击事件 获取某一个盒子canvas中模型对象
function getBodyBoxClickObjFn(event, scene, camera) {
    let intsersects = getBodyCanvasIntersects(event, scene, camera);
    if (intsersects.length > 0) {
        return intsersects;
    }
}
//- 拉近视野
/**
 * @param { 空间对象 } scene
 * @param { 相机对象 } camera
 * @param { 渲染 } renderer
 * @param { 拉近位置 } zoom
 */
function zoomIn(scene, camera, renderer, zoom, time = 1000) {
    console.log(camera.fov, time);
    if (camera && camera.type === "PerspectiveCamera") {
        camera.fov = zoom;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
}
/**
 * 绘制墙体
 * @param {墙体坐标点} objs
 * @param {区域位于空间y轴位置} yHei
 * @param {几何图形组} group
 * @param {墙体贴图图片} wallImg
 */
function drawPloygonWall(objs, yHei, group, wallImg) {
    //长度
    let lens = Math.sqrt(Math.pow((Number(objs.eZ) - Number(objs.sZ)), 2) + Math.pow((Number(objs.eX) - Number(objs.sX)), 2));
    //位置
    let posx = (objs.eX + objs.sX) / 2;
    let posz = (objs.eZ + objs.sZ) / 2;
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(wallImg);
    texture.wrapS = THREE.RepeatWrapping; //水平方向如何包裹
    texture.wrapT = THREE.RepeatWrapping; // 垂直方向如何包裹
    // uv两个方向纹理重复数量、看板中重复数量
    texture.repeat.set(15, 1);
    // 设置偏移 纹理在单次重复时，从一开始将分别在U、V方向上偏移多少。 这个值的范围通常在0.0之间1.0
    texture.offset = new THREE.Vector2(0, 0);
    //旋转角度
    let rotate = -Math.atan2((objs.eZ - objs.sZ), (objs.eX - objs.sX));
    let box = new THREE.BoxGeometry(lens, 1.5, 0); //- 墙体参数 墙体高度1.5
    let material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1
    });
    let mesh = new THREE.Mesh(box, material);
    mesh.position.set(posx, yHei + (1.5 / 2), posz);
    mesh.rotation.y = rotate;
    group.add(mesh);
}

/**
 * 绘制旁站、危险区域多边形区域
 * @param {场景对象} scene
 * @param {区域数据对象数据} dataObj 必须包含区域id、名称、点数据  {id:'',name:'',points:[]}
 * @param {绘制区域类型} type 旁站：sideStand、危险区域：danger
 * @param {绘制区域颜色} type 旁站：0xFFBE14、危险区域：0xFF0018
 * @param {墙体贴图图片} wallImg
 */
function drawPloygonShape(scene, dataObj, type, color, wallImg) {
    // 创建组、添加几何对象边缘线、底部图形
    let group = new THREE.Group();

    let points = dataObj.points;
    let pointArr = [];
    for (let i = 0; i < points.length; i++) {
        const item = points[i];
        pointArr.push(new THREE.Vector3(item[0], item[1], item[2]));
    }
    // 点绘制成线，绘制边缘线
    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = pointArr;
    let lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 10
    });
    let lineMesh = new THREE.LineLoop(lineGeometry, lineMaterial);
    lineMesh.position.set(0, 0, 0);
    lineMesh.userData.name = type + '_line';
    lineMesh.userData.id = dataObj.id;
    lineMesh.userData.dangerName = dataObj.name;

    // 墙体数据处理
    let wallArr = [...pointArr, pointArr[0]];
    for (let i = 0; i < wallArr.length; i++) {
        if (i !== wallArr.length - 1) {
            let params = {
                eZ: wallArr[i + 1].z,
                sZ: wallArr[i].z,
                eX: wallArr[i + 1].x,
                sX: wallArr[i].x
            };
            // 绘制墙体
            drawPloygonWall(params, points[0][1], group, wallImg);
        }
    }

    // 根据绘制的点，来定义一个二维形状平面
    let shape = new THREE.Shape();
    shape.moveTo(pointArr[0].x, pointArr[0].z);
    for (let i = 1; i < pointArr.length; i++) {
        shape.lineTo(pointArr[i].x, pointArr[i].z);
    }
    shape.autoClose = true;
    // 从一个或多个路径形状中创建一个单面多边形几何体。
    let shapeGeometry = new THREE.ShapeBufferGeometry(shape, 25);
    let shapeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    let shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shapeMesh.rotateX(Math.PI / 2);
    shapeMesh.position.set(0, points[0][1] + 0.1, 0);
    shapeMesh.userData.name = type + '_plane';
    shapeMesh.userData.id = dataObj.id;
    shapeMesh.userData.dangerName = dataObj.name;

    // 添加一个小方块，用于调用css2d渲染器，显示信息看板
    let smallBoxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    let smallBoxMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
    });
    let smallBoxShape = new THREE.Mesh(smallBoxGeometry, smallBoxMaterial);
    smallBoxShape.position.set(points[0][0], points[0][1], points[0][2]);
    smallBoxShape.userData.name = type + '_small_box';

    group.add(shapeMesh);
    group.add(lineMesh);
    group.add(smallBoxShape);
    group.userData.name = type + '_group';
    group.userData.id = dataObj.id;
    group.userData.dangerName = dataObj.name;
    scene.add(group);
}

/**
 * 绘制场景天空盒子
 * @param {场景对象} scene
 */
function drawSkyBox(scene) {
    let textureLoader = new THREE.CubeTextureLoader();
    let urls = [
        skyX1,
        skyX2,
        skyY1,
        skyY2,
        skyZ1,
        skyZ2
    ];
    let cubeTexture = textureLoader.load(urls);
    scene.background = cubeTexture;
}
/**
 * 添加场景灯光
 * @param {场景对象} scene
 */
function sceneLight(scene) {
    // 添加平行光光源
    let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(0, 50, 0);
    scene.add(directionalLight1);

    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(1, 0, 1);
    scene.add(directionalLight2);

    let directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight3.position.set(-1, 0, -1);
    scene.add(directionalLight3);
}
/**
 * @name 设置模型透明
 * @param {模型} model
 * @param {透明的} opacity
 */
function setModelOpacity(model, opacity) {
    function whileModel(targetModel) {
        const _tipModel = targetModel.children;
        if (_tipModel.length > 0) {
            for (let i = 0; i < _tipModel.length; i++) {
                const _current = _tipModel[i];
                if (_current.type === 'Mesh') {
                    _current.material.transparent = true;
                    _current.material.opacity = opacity;
                } else if (_current.children.length > 0) {
                    whileModel(_current);
                }
            }
        }
    }
    whileModel(model);
    return model;
}
/**
 * 模型移入高亮
 * @param { 区域宽度 } width
 * @param { 区域高度 } height
 * @param { 场景对象 } scene
 * @param { 摄像机对象} camera
 */
function threeJs_Composer(width, height, scene, camera, renderer) {
    let composer = new EffectComposer(renderer);
    let renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    let selectedObjects = [];

    let outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
    //---------可通过修改下方代码对特效进行调整---------------
    outlinePass.edgeStrength = 5;//包围线浓度
    outlinePass.edgeGlow = 1;//边缘线范围
    outlinePass.edgeThickness = 3;//边缘线浓度
    outlinePass.pulsePeriod = 2;//包围线闪烁频率 #00FF00 #FF4500
    outlinePass.visibleEdgeColor.set('#00FF00');//包围线颜色 FF4500
    outlinePass.hiddenEdgeColor.set('#00FF00');//被遮挡的边界线颜色 190a05
    //---------------------------------------------------
    composer.addPass(outlinePass);
    let effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = true;
    composer.addPass(effectCopy);
    composer.selectedObjectEffect = function (objs) {
        selectedObjects = [];
        for (let i = 0; i < objs.length; i++) {
            selectedObjects.push(objs[i]);
        }
        outlinePass.selectedObjects = selectedObjects;
        // isComposer = true;
    };
    return composer;
}

export {
    getBoxClickObjFn,
    getBodyBoxClickObjFn,
    zoomIn,
    drawPloygonShape,
    drawSkyBox,
    sceneLight,
    setModelOpacity,
    getCanvasIntersects,
    getBodyCanvasIntersects,
    threeJs_Composer
};
