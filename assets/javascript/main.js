var response = {}

function gitGiphy(emotion){
    $("#emoji").empty();
    console.log("hello");
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=FH40z8RM9VJhyEk0ML5R4TFfhpuV7uPV&q="+ emotion +"&limit=100"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
      let results = response.data;
      // random index for picking a giphy
      let ranIndex = Math.floor(Math.random() * 100);
      // random index for picking a saying
      let sIndex = Math.floor(Math.random() * 5);
      // creating sayings object
      var sayings = {
        happiness:["Yay!","Whoever is happy will make others happy","The pursuit of happiness is real","Be happy with what you have. Be excited about what you want","Have only two kinds of days: happy and hysterically happy"],
        anger:["Argh..","Anger is a short madness","Don't get your back up","If you kick a stone in anger you will hurt your foot","He who angers you conquers you"],
        disgust:["Yuck!","Gross","distasteful","filthy","nasty"],
        fear:["Fear is only as deep as the mind allows","Fear is faith that it won't work out","Fear is a darkroom where negatives develop","But fear doesn't need doors and windows. It works from the inside", "Fear defeats more people than any other one thing in the world"],
        neutral:["ehhh...","The end doesn't justify the means","A rule isn't unfair if it applies to everyone","Give good and get good","If we do not maintain justice, justice will not maintain us"],
        sadness:["Tears come from the heart and not from the brain","You cannot protect yourself from sadness without protecting yourself from happiness.","Breathing is hard. When you cry so much, it makes you realize that breathing is hard.","Things change. And friends leave. Life doesn't stop for anybody.","Remember, it will get better!"],
        surprise:["Surprise!","Expect nothing. Live frugally on surprise.","Do not know yourself. I want to continue to surprise me.   ","Wait long enough, and people will surprise and impress you","The idea of waiting for something makes it more exciting"],
      };
      console.log(ranIndex);
      console.log(results);
      // getting a random giphy from the 10 that we go back
      var emoticon = results[ranIndex].images.fixed_height.url;
      // creating the image tag and adding in the src
      var emoticonImage = $("<img>")
      emoticonImage.attr("src", emoticon);
      // creating the Div to display the saying
      var sayingDiv = $('<div>')
      // picking the text to display 
      if(emotion==='happiness'){
      sayingDiv.text(sayings.happiness[sIndex]);
      }
      else if(emotion==='anger'){
      sayingDiv.text(sayings.anger[sIndex]);
      }
      else if(emotion==='disgust'){
      sayingDiv.text(sayings.disgust[sIndex]);
      }
      else if(emotion==='fear'){
      sayingDiv.text(sayings.fear[sIndex]);
      }
      else if(emotion==='neutral'){
        sayingDiv.text(sayings.neutral[sIndex]);
      }
      else if(emotion==='sadness'){
      sayingDiv.text(sayings.sadness[sIndex]);
      }
      else if(emotion==='surprise'){
      sayingDiv.text(sayings.surprise[sIndex]);
      }
      else {
      sayingDiv.text('weird emotion');
      }
      // displaying giphy and text
      $("#avatar").append(emoticonImage);
      $("#avatar").append(sayingDiv);
      
      console.log(emoticon);
    });
  }

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
}
    //age 
    //create a function to decide the texts we need to return
    function textGenerate(e) {
        var age = e.faces[0].attributes.age.value
        var gender = e.faces[0].attributes.gender.value
        var beautyScore = (e.faces[0].attributes.beauty.male_score + e.faces[0].attributes.beauty.female_score)/2
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
        if (age > 40 && age <= 50) { 
            ageText = "placeholder40to50"
        }
        

        //generate genderText
        if (gender === "male" && age > 0 && age <= 29) {
            genderText = "Dude"
        };
        if (gender === "male" && age >= 30) {
            genderText = "Sir"
        };
        if (gender === "female" && age > 0 && age <= 25) {
            genderText = "Girl"
        };
        if (gender === "female" && age >= 26) {
            genderText = "Ma'am"
        };
                
        //beautyText
        if(beautyScore > 0 && beautyScore <= 25){
            beautyText = "placeholder for beauty"
        };
        if(beautyScore > 25 && beautyScore <= 50){
            beautyText = "placeholder for beauty"
        };
        if(beautyScore > 50 && beautyScore <= 75){
            beautyText = "placeholder for beauty"
        };
        if(beautyScore > 75 && beautyScore <= 100){
            beautyText = "placeholder for beauty"
        };
    }










