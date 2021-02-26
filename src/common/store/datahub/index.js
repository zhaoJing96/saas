/**
 * 主控台数据
 **/
const pModelUrl = require('@/static/images/model/SJKPr.glb');
const bdModelUrl1 = require('@/static/images/model/SJK1BD.glb');
const bdModelUrl2 = require('@/static/images/model/SJK2BD.glb');
const bdModelUrl3 = require('@/static/images/model/SJK3BD.glb');
const bdModelUrl4 = require('@/static/images/model/SJK4BD.glb');
const wModelUrl1 = require('@/static/images/model/SJK1WR.glb');
const wModelUrl2 = require('@/static/images/model/SJK2WR.glb');
const wModelUrl3 = require('@/static/images/model/SJK3WR.glb');
const wModelUrl4 = require('@/static/images/model/SJK4WR.glb');

import {
    action,
    observable
    // action
} from 'mobx';

class DataHubStore {
    @observable data = {
        name: '双江口项目',
        modelName: 'SJKPr',
        modelUrl: pModelUrl,
        bidSectionList: [{
            name: '标段1',
            modelName: 'SJK1BD',
            modelUrl: bdModelUrl1,
            pModelName: 'SJKPr',
            workFaceList: [{
                name: '作业面1',
                modelName: 'SJK1WR',
                modelUrl: wModelUrl1
            }]
        }, {
            name: '标段2',
            modelName: 'SJK2BD',
            modelUrl: bdModelUrl2,
            pModelName: 'SJKPr',
            workFaceList: [{
                name: '作业面2',
                modelName: 'SJK2WR',
                modelUrl: wModelUrl2
            }]
        }, {
            name: '标段3',
            modelName: 'SJK3BD',
            modelUrl: bdModelUrl3,
            pModelName: 'SJKPr',
            workFaceList: [{
                name: '作业面3',
                modelName: 'SJK3WR',
                modelUrl: wModelUrl3
            }]
        }, {
            name: '标段4',
            modelName: 'SJK4BD',
            modelUrl: bdModelUrl4,
            pModelName: 'SJKPr',
            workFaceList: [{
                name: '作业面4',
                modelName: 'SJK4WR',
                modelUrl: wModelUrl4
            }]
        }]
    }; // 模型数据
    @observable currentModel = null; // 当前展示模型
    @observable initModel = []; // 初始化高亮模型数据

    // 设置当前模型name, 用于移除隐藏模型
    @action setCurrentModel = (value) => {
        this.currentModel = value;
    }
    // 设置初始化高亮模型
    @action setInitModel = (value) => {
        this.initModel = value;
    }
}
let dataHubStore = new DataHubStore();
export default dataHubStore;