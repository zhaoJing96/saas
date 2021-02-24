export default window.AMap;
/**
 * 多个高德坐标点计算,返回一个中心点
 * @param points,Array,[{lng:xxx,lat:xxx},...];
 */
export const computeCenter = function (points) {
    let total = points.length;
    let UPX = 0, UPY = 0, UPZ = 0;
    for (let i = 0; i < points.length; i++) {
        const item = points[i];
        let lng = item.lng * Math.PI / 180;
        let lat = item.lat * Math.PI / 180;
        let x, y, z;
        x = Math.cos(lat) * Math.cos(lng);
        y = Math.cos(lat) * Math.sin(lng);
        z = Math.sin(lat);
        UPX += x;
        UPY += y;
        UPZ += z;
    }
    UPX = UPX / total;
    UPY = UPY / total;
    UPZ = UPZ / total;
    let Lng = Math.atan2(UPY, UPX);
    let Hyp = Math.sqrt(UPX * UPX + UPY * UPY);
    let Lat = Math.atan2(UPZ, Hyp);
    const option = { lng: Lng * 180 / Math.PI, lat: Lat * 180 / Math.PI };
    if (isNaN(option.lng)) {
        option.lng = undefined;
    }
    if (isNaN(option.lat)) {
        option.lat = undefined;
    }
    return option;
};
