//api接口地址
//base url for China

const FACE_HOST_CN = "https://api-cn.faceplusplus.com/";
const FACE_HOST_US = "https://api-us.faceplusplus.com/";

const FACE_FACEPP = "facepp/v3/";
const FACE_DETECT = FACE_FACEPP + "detect";
const FACE_COMPARE = FACE_FACEPP + "compare";
const FACE_SEARCH = FACE_FACEPP + "search";

// facetoken
const FACETOEKN = FACE_FACEPP + "face/";
const FACETOEKN_ANALYZE = FACETOEKN + "analyze";
const FACETOEKN_SET_USERID = FACETOEKN + "setuserid";
const FACETOEKN_GET_DETAIL = FACETOEKN + "getdetail";

//faceSet
const FACESET = FACE_FACEPP + "faceset/";
const FACESET_CREATE = FACESET + "create";
const FACESET_ADDFACE = FACESET + "addface";
const FACESET_REMOVE_FACE = FACESET + "removeface";
const FACESET_ADDFACE_ASYNC = FACESET + "async/addface";
const FACESET_REMOVE_FACE_ASYNC = FACESET + "async/removeface";
const FACEAET_TASK_QUERY = FACESET + "async/task_status";
const FACESET_UPDATE = FACESET + "update";
const FACESET_GET_DETAIL = FACESET + "getdetail";
const FACESET_GET_FACESETS = FACESET + "getfacesets";
const FACESET_DELETE = FACESET + "delete";


//人体检测和人体抠图
const HUMANBODY_DETECT = "humanbodypp/v1/detect";
const HUMANBODY_SEGMENT = "humanbodypp/v2/segment";
const HUMANBODY_SKELETON = "humanbodypp/v1/skeleton";
const HUMANBODY_GESTURE = "humanbodypp/beta/gesture";

//人脸融合
const IMAGE_MERGEFACE = "imagepp/v1/mergeface";

//OCR 识别身份证/驾驶证/行驶证/银行卡,Only for china

// 美颜api
const FACE_BEAUTY = "facepp/beta/beautify";

//证件识别
const OCR_CN = "cardpp/";
const OCR_IDCARD = OCR_CN + "v1/ocridcard";
const OCR_DRIVER_LICENSE = OCR_CN + "v2/ocrdriverlicense";
const OCR_VEHICLE_LICENSE = OCR_CN + "v1/ocrvehiclelicense";
const OCR_BNAKCARD = OCR_CN + "v1/ocrbankcard";

//车牌识别/文字识别/场景识别/文字识别
const IMAGE_CN = "imagepp/";
const IMAGE_Plate = IMAGE_CN + "v1/licenseplate";
const IMAGE_Object = IMAGE_CN + "beta/detectsceneandobject";
const IMAGE_Text = IMAGE_CN + "v1/recognizetext";


// fill in apikey and apisecret
/* FACEPP对象
 *  apikey : 填写apikey
 *  apisecret : 填写 apisecret
 */

function FACEPP(apikey, apisecret, isChina) {

    if (apikey == null || apisecret == null) {
        alert('apikey 或 apisecret should not be empty');
        console.log('apikey or apisecret can not be null');
    }

    this.apikey = apikey;
    this.apisecret = apisecret;
    this.baseurl = FACE_HOST_US;
    

    //人脸检测
    this.detectFace = function (param, success, failed) {

        var url = this.baseurl + FACE_DETECT;

        this.request(url, param, success, failed);
    };

    //人脸比对
    this.compareFace = function (param, success, failed) {
        var url = this.baseurl + FACE_COMPARE;
        this.request(url, param, success, failed);
    };


//from base64 to binary and save base64 data
    /* base64转二进制
     * 传入base64数据
     */
    this.dataURItoBlob = function (dataURI) { // 图片转成Buffer
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

//ajax request
    /* POST请求
     * url: 请求地址
     * 请求携带的参数
     */
    this.request = function (url, dic, success, failed) {//发送POST请求

        const formData = new FormData();

        formData.append('api_key', this.apikey);
        formData.append('api_secret', this.apisecret);

        for (var key in dic) {//遍历拼接
            formData.append(key, dic[key]);
        }

        $.ajax({
            url: url,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            error: function() {
                $("#welcome").text("I couldn't read that image. Try another one, please!")
            },
            timeout: 20000,//20秒超时时间
            // }).done(success).fail(failed);
        }).then(function (e) {
            console.log(e)
            $("#text").empty();
            emotionCompare(e)
            textGenerate(e);
        })
    }
}

function error() {
    $("#welcome").text("That didn't work well. Try another one, please!")
}
