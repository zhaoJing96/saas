/**
 * 3D主控台数据
 **/
import {
    action,
    observable
} from 'mobx';

class DataHub3DStore {
    @observable currentModel = null; // 当前展示模型
    @observable alreadyLoadedModel = []; // 已经加载过的模型
    @observable modelData = []; // 模型数据

    // 设置当前模型name, 用于移除隐藏模型
    @action setCurrentModel = (value) => {
        this.currentModel = value;
    }
    // 3D存储已经加载过的模型，用于模型加载时，加载过的不在加载采用显隐方式展示
    @action setAlreadyLoadedModel = (value) => {
        this.alreadyLoadedModel = value;
    }
    // 3D存储已经加载过的模型数据（Mesh），设置网格模型对象、用于模型二次点击不解析加载模型
    @action setModelData = (value) => {
        this.modelData = value;
    }
    // 重置3D相关设置数据
    @action reset3DSetting() {
        this.modelData = [];
        this.alreadyLoadedModel = [];
        this.currentModel = null;
    }
}
let dataHub3DStore = new DataHub3DStore();
export default dataHub3DStore;
