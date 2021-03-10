/**
 * 2D主控台数据
 **/

import {
    action,
    observable
} from 'mobx';

class DataHub2DStore {
    @observable currentSelectData = null; // 当前选中数据

    // 设置当前选中数据
    @action setCurrentSelectData = (value) => {
        this.currentSelectData = value;
    }
    // 清楚2D主控台设置数据
    @action reset2DSetting() {
        this.currentSelectData = null;
    }

}
let dataHub2DStore = new DataHub2DStore();
export default dataHub2DStore;
