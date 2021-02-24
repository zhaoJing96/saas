//项目所有常量
export default {
    //正则
    reg: {
        //用户名
        name: /^\w{1,20}|[\u4e00-\u9fa5]+$/,
        //部门名称
        deptName: /^\w{1,30}|[\u4e00-\u9fa5]+$/,
        //手机
        mobile: /^1(3|4|5|6|7|8|9)\d{9}$/,
        //密码
        password: /^\w{6,32}$/,
        //图形验证码
        verfiyCode: /^\w{4}$/,
        //短信码
        note: /^\d{4}$/,
        //正整数和负整数
        altitude: /^(-([1-9]|[1-9][0-9])*)|([1-9]|[1-9][0-9]*)$/,
        // 密码验证 不能输入汉字
        noChinese: /^[^\u4e00-\u9fa5]{0,}$/,
        // 员工工号 只能输入数字字母下划线
        workCodeVerfiy: /^[a-zA-Z0-9_]{1,}$/,
        // 身份证验证
        identityCardVerfiy: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        // 正整数
        intNumber: /^\+?[1-9][0-9]*$/,
        //正整数 安全规则接近危险区、电压、电流、脱帽时长、电量、心率、周边人距离
        positiveInteger: /^([0]|[1-9][0-9]*)$/,
        // 只能输入一位小数 安全规则气体、体温验证
        floatOneNumber: /^-?\d+\.?\d{1,1}$/,
        // 经度坐标验证
        lngVerfiy: /^(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
        // 纬度坐标验证
        latVerfiy: /^([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/,
        // 半径验证 只能输入正数 且只能两位小数
        radiusVerfiy:  /^[0-9]+(.[0-9]{0,2})?$/
    },
    //storage
    storage: {
        //当前项目ID
        currentProjectId: 'PID',
        //当前用户基本信息
        currentUser: 'U',
        //当前用户类型
        currentUserType: 'UT',
        // 报警处理显示已结束
        showEnded: 'ENDED',
        //主导航KEYS
        currentMenuKey: 'MK',
        //主导航的下级submenu keys
        currentSubMenuKey: 'MSK',
        //主导航的下级submenu keys
        currentToken: 'TOKEN',
        //安全规则跳转是修改还是详情
        jumpPageType: 'JT',
        // 部门脱帽统计 部门id
        currentDepartId: 'DID'
    }
};
