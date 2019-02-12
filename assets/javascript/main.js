var response = {}



//Click and select a photo
function clickInput() {
    document.getElementById('input').click();
}


var facepp = new FACEPP(APIKEY, APISERET, 1);


// /Upload the image in form of URL
// let dic = {'image_url' : 'https://www.faceplusplus.com.cn/scripts/demoScript/images/demo-pic6.jpg'};

// facepp.detectFace(dic,success,failed);



// Turn the photo into manageable data
function selectImage(input) {

    let imageView = document.getElementById('preview');

    const reader = new FileReader();

    reader.readAsDataURL(input.files[0]);

    reader.onload = function (e) {

        //移除之前的人脸框
        $("#facesContainer div").remove();

        //图片的base64数据
        const base64Image = e.target.result;

        //显示图片
        //修复显示方向不对问题
        fixOrientention(base64Image, imageView);

        /*
        //base64方式上传图片
        let dic = {'image_base64' : base64Image};

        facepp.detectFace(dic,success,failed);

        */

        // 以二进制的方式上传图片
        // 将base64转为二进制
        let imageData = facepp.dataURItoBlob(base64Image);
        //根据个人需求填写的参数,这里全部写上了,包括年龄性别等,详情看官方文档
        let attributes = 'gender,age,smiling,headpose,facequality,blur,eyestatus,emotion,ethnicity,beauty,mouthstatus,eyegaze,skinstatus';
        //上传图片,获取结果
        let dataDic = { 'image_file': imageData, 'return_landmark': 2, 'return_attributes': attributes };


        //调用接口，检测人脸
        facepp.detectFace(dataDic, success, failed);
    }
}

//if succeed
function success(e) {
    //显示结果
    console.log(e);
    console.log("run")
    var emotionNameArray = [
        "anger",
        "disgust",
        "fear",
        "happiness",
        "neutral",
        "sadness",
        "surprise"
    ]
    var emotionValueArray = [];
    emotionValueArray.push(e.faces[0].attributes.emotion.angry)
    emotionValueArray.push(e.faces[0].attributes.emotion.disgust)
    emotionValueArray.push(e.faces[0].attributes.emotion.fear)
    emotionValueArray.push(e.faces[0].attributes.emotion.happiness)
    emotionValueArray.push(e.faces[0].attributes.emotion.neutral)
    emotionValueArray.push(e.faces[0].attributes.emotion.sadness)
    emotionValueArray.push(e.faces[0].attributes.emotion.surprise)

    console.log(emotionNameArray)

    console.log(emotionValueArray)
}

//if it failed, send the error message
function failed(e) {
    console.log(e);
    let textView = document.getElementById('text');
    textView.innerText = JSON.stringify(e);
}


function fixOrientention(base64Image, imageView) {
    const image = new Image();

    image.onload = () => {
        const canvas = document.createElement('canvas');

        const initSize = image.src.length;

        let width = image.naturalWidth;
        let height = image.naturalHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 旋转图片操作
        EXIF.getData(image, function () {
            const orientation = EXIF.getTag(this, 'Orientation');
            console.log(`orientation:${orientation}`);
            switch (orientation) {
                // 正常状态
                case 1:
                    console.log('旋转0°');
                    canvas.height = height;
                    canvas.width = width;
                    ctx.drawImage(image, 0, 0, width, height);
                    break;
                // 旋转90度
                case 6:
                    console.log('旋转90°');
                    canvas.height = width;
                    canvas.width = height;
                    ctx.rotate(Math.PI / 2);
                    ctx.translate(0, -height);
                    ctx.drawImage(image, 0, 0, width, height);
                    break;
                // 旋转180°
                case 3:
                    console.log('旋转180°');
                    canvas.height = height;
                    canvas.width = width;
                    ctx.rotate(Math.PI);
                    ctx.translate(-width, -height);
                    ctx.drawImage(image, 0, 0, width, height);
                    break;
                // 旋转270°
                case 8:
                    console.log('旋转270°');
                    canvas.height = width;
                    canvas.width = height;
                    ctx.rotate(-Math.PI / 2);
                    ctx.translate(-width, 0);
                    ctx.drawImage(image, 0, 0, width, height);
                    break;

                default:
                    console.log('default 旋转0°');
                    canvas.height = height;
                    canvas.width = width;
                    ctx.drawImage(image, 0, 0, width, height);
                    break;
            }
        });

        var newBase64 = canvas.toDataURL('image/jpeg', 1.0);
        imageView.src = newBase64;
    };
    image.src = base64Image;
}



//emotion
//create a function to save and compare emotion
function emotionCompare(e) {
    var emotionNameArray = [
        "anger",
        "disgust",
        "fear",
        "happiness",
        "neutral",
        "sadness",
        "surprise"
    ]


    var emotionValueArray = [];
    emotionValueArray.push(e.faces[0].attributes.emotion.anger)
    emotionValueArray.push(e.faces[0].attributes.emotion.disgust)
    emotionValueArray.push(e.faces[0].attributes.emotion.fear)
    emotionValueArray.push(e.faces[0].attributes.emotion.happiness)
    emotionValueArray.push(e.faces[0].attributes.emotion.neutral)
    emotionValueArray.push(e.faces[0].attributes.emotion.sadness)
    emotionValueArray.push(e.faces[0].attributes.emotion.surprise)
    let highest = 0;
    let highestEmotion = 0;
    for (let i = 0; i < emotionValueArray.length; i++) {
        if (emotionValueArray[i] > highest) {
            highest = emotionValueArray[i];
            highestEmotion = emotionNameArray[i];
        }
    };
    console.log(highestEmotion);
    console.log(emotionNameArray)
    console.log(emotionValueArray)



    //age 
    //create a function to decide the texts we need to return
    function textGenerate {
        var ageText
        var genderText
        var glassesText
        var beautyText
        var mouthText

        //generate ageText
        if (age > 0 && age <= 20) {
            ageText = "placeholder0to20"
        }
        if (age > 20 && age <= 30) {
            ageText = "placeholder20to30"
        }
        if (age > 30 && age <= 40) {
            ageText = "placeholder30to40"
        }
        if (age > 40 && age <= 50) { }
        ageText = "placeholder40to50"

        //generate genderText
        if (gender === "male") {
            gendertext = "placeholder for male"
        }
        else {
            gendertext = "placeholder for female"
        }


        //glassesText
        if (glasses === "none") {
            glassesText = "placeholder for no glasses"
        }
        else if (glasses === "normal") {
            glassesText = "placeholder for light glasses"
        }
        else {
            glassesText = "placeholder for dark 'sunglasses'"
        }
        //beautyText
        //dylan's code 

        //mouthText
        if (mouth > 50) {
            mouthText = "placeholder for mouth open"
        } else {
            mouthText = ""
        }

    }
}







