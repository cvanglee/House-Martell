var response = {}
var highestEmotion;
var count = 0;
var doneTyping = false;
var ageText
var genderText
var beautyText
var emotionText


function gitGiphy(emotion) {
    console.log("hello");
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=FH40z8RM9VJhyEk0ML5R4TFfhpuV7uPV&q=" + emotion + "&limit=100"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let results = response.data;
        // random index for picking a giphy
        let ranIndex = Math.floor(Math.random() * 100);
        console.log(ranIndex);
        console.log(results);
        // getting a random giphy from the 10 that we go back
        var emoticon = results[ranIndex].images.fixed_height.url;
        // creating the image tag and adding in the src
        var emoticonImage = $("<img>")
        emoticonImage.attr("src", emoticon);
        // displaying giphy and text
        console.log("is running");
        $("#gif").attr("src", emoticon);
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
    for (let i = 0; i < emotionValueArray.length; i++) {
        if (emotionValueArray[i] > highest) {
            highest = emotionValueArray[i];
            highestEmotion = emotionNameArray[i];
        }
    };
    gitGiphy(highestEmotion);
    console.log(highestEmotion);
    console.log(emotionNameArray)
    console.log(emotionValueArray)
}

//age 
//create a function to decide the texts we need to return
function textGenerate(e) {
    // declare variables to store data from the face++ api
    var age = e.faces[0].attributes.age.value;
    var gender = e.faces[0].attributes.gender.value;
    var beautyScore = (e.faces[0].attributes.beauty.male_score + e.faces[0].attributes.beauty.female_score) / 2;

    function random (array) {
        randomGenerated = Math.floor(Math.random() * array.length);
        return randomGenerated
    }

    // creating sayings objects for all of the texts we have
    var ageArrays = {
        twentyUnder: ["Be yourself; everyone else is already taken",
            "You have to be odd to be number 1",
            "Children are the leading cause of old age.",
            "It’s alive! It’s alive!",
            "Are you made of copper and tellurium? Because you're CuTe",
            "What's a nice ghoul like you doing in a crypt like this?",
            "Adolescence is that period in a kid’s life when parents become more difficult.",
            "Zeal: A certain nervous disorder afflicting the young and inexperienced.",
            "Old age is like everything else; to make a success of it, you’ve got to start young."
        ],

        thirtyUnder: ["Success in your twenties is more about setting the table than enjoying the feast",
            "Being an adult is just walking around wondering what you're forgetting.",
            "Remember how when you were little you could just rip off your diaper and run around naked and everyone thought it was funny?",
        ],
        fortyUnder: ["Surfing while middle-aged requires a lot of forty, dude.",
            "As you get older, three things happen: The first is your memory goes, and I can't remember the other two",
            "Transitional age is when during a hot day you don't know what you want – ice cream or beer.",
            "We grow too soon old and too late smart.",
            "ife expectancy would grow by leaps and bounds if green vegetables smelled as good as bacon."
        ],
        fiftyUnder: ["Middle age is when you still believe you’ll feel better in the morning", "You are twice as sexy as two 20 somethings.", "Middle age is when you're faced with two temptations and you choose the one that will get you home by nine o'clock"],
        sixtyOver: ["The older you get, the earlier it gets late.", "Pastry chefs know that old age crepes up on you.", "You're old enough to remember when emojis were called hieroglyphics."]
    };
    var beautyArrays = {
        quarter1: ["If you were a chicken, you'd be impeccable.",
            "I wish you were cross-eyed so I could see you twice.",
            "Beauty is only skin deep ...but ugly goes all the way to the bone!"],
        quarter2: ["Is your body from McDonald's? Cause I'm lovin' it!",
            "smile is an inexpensive way to improve your looks",
            "I know milk does a body good, but damn girl, how much have you been drinking?"],
        quarter3: ["If you were a library book, I’d check you out!",
            "Does your left eye hurt? Because you’ve been looking right all day.",
            "There's no real difference between me and George Clooney."],
        quarter4: ["Are you French, because Eiffel for you!"],
    };
    var emotionArrays = {
        happiness: ["Yay!", "Whoever is happy will make others happy", "The pursuit of happiness is real", "Be happy with what you have. Be excited about what you want", "Have only two kinds of days: happy and hysterically happy"],
        anger: ["Argh..", "Anger is a short madness", "Don't get your back up", "If you kick a stone in anger you will hurt your foot", "He who angers you conquers you"],
        disgust: ["Yuck!", "Gross", "distasteful", "filthy", "nasty"],
        fear: ["Fear is only as deep as the mind allows", "Fear is faith that it won't work out", "Fear is a darkroom where negatives develop", "But fear doesn't need doors and windows. It works from the inside", "Fear defeats more people than any other one thing in the world"],
        neutral: ["ehhh...", "The end doesn't justify the means", "A rule isn't unfair if it applies to everyone", "Give good and get good", "If we do not maintain justice, justice will not maintain us"],
        sadness: ["Tears come from the heart and not from the brain", "You cannot protect yourself from sadness without protecting yourself from happiness.", "Breathing is hard. When you cry so much, it makes you realize that breathing is hard.", "Things change. And friends leave. Life doesn't stop for anybody.", "Remember, it will get better!"],
        surprise: ["Surprise!", "Expect nothing. Live frugally on surprise.", "Do not know yourself. I want to continue to surprise me.   ", "Wait long enough, and people will surprise and impress you", "The idea of waiting for something makes it more exciting"],
    };



    //generate genderText
    if (gender === "Male" && age > 0 && age <= 29) {
        genderText = "Dude, "
    };
    if (gender === "Male" && age >= 30) {
        genderText = "Sir, "
    };
    if (gender === "Female" && age > 0 && age <= 25) {
        genderText = "Girl, "
    };
    if (gender === "Female" && age >= 26) {
        genderText = "Ma'am, "
    };


    //generate ageText
    if (age > 0 && age <= 20) {
        randNum = random(ageArrays.twentyUnder)
        ageText = genderText + ageArrays.twentyUnder[randNum];
    }
    if (age > 20 && age <= 30) {
        randNum = random(ageArrays.thirtyUnder)
        ageText = genderText + ageArrays.thirtyUnder[randNum];
    }
    if (age > 30 && age <= 40) {
        randNum = random(ageArrays.fortyUnder)
        ageText = genderText + ageArrays.fortyUnder[randNum];
    }
    if (age > 40 && age <= 50) {
        randNum = random(ageArrays.fiftyUnder)
        ageText = genderText + ageArrays.fiftyUnder[randNum];
    }
    if (age > 60) {
        randNum = random(ageArrays.sixtyOver)
        ageText = genderText + ageArrays.sixtyOver[randNum];
    }

    // picking the emotion text to display 
    if (highestEmotion === 'happiness') {
        randNum = random(emotionArrays.happiness)
        emotionText = (emotionArrays.happiness[randNum]);
    }
    else if (highestEmotion === 'anger') {
        randNum = random(emotionArrays.anger)
        emotionText = (emotionArrays.anger[randNum]);
    }
    else if (highestEmotion === 'disgust') {
        randNum = random(emotionArrays.disgust)
        emotionText = (emotionArrays.disgust[randNum]);
    }
    else if (highestEmotion === 'fear') {
        randNum = random(emotionArrays.fear)
        emotionText = (emotionArrays.fear[randNum]);
    }
    else if (highestEmotion === 'neutral') {
        randNum = random(emotionArrays.neutral)
        emotionText = (emotionArrays.neutral[randNum]);
    }
    else if (highestEmotion === 'sadness') {
        randNum = random(emotionArrays.sadness)
        emotionText = (emotionArrays.sadness[randNum]);
    }
    else if (highestEmotion === 'surprise') {
        randNum = random(emotionArrays.surprise)
        emotionText = (emotionArrays.surprise[randNum]);
    }
    else {
        emotionText = ('weird emotion');
    }





    //beautyText
    if (beautyScore > 0 && beautyScore <= 25) {
        randNum = random(beautyArrays.quarter1)
        beautyText = (beautyArrays.quarter1[randNum])
    };
    if (beautyScore > 25 && beautyScore <= 50) {
        randNum = random(beautyArrays.quarter2)
        beautyText = (beautyArrays.quarter2[randNum])
    };
    if (beautyScore > 50 && beautyScore <= 75) {
        randNum = random(beautyArrays.quarter3)
        beautyText = (beautyArrays.quarter3[randNum])
    };
    if (beautyScore > 75 && beautyScore <= 100) {
        randNum = random(beautyArrays.quarter4)
        beautyText = (beautyArrays.quarter4[randNum])
    };
    console.log(ageText)
    console.log(emotionText)
    console.log(beautyText)
    display(ageText)
}

function display(text) {
    console.log("running!")
    appendChatBox();
    styleBubbleText(text)
}



// create a function to append chat bubble with text to the screen
appendChatBox = function () {
    count++
    $("#text").append(
        '<div id = "' + count + '" class= "speech-bubble"></div>'
    )
}



function actionBarSetTimeout(char, addedTime) {
    setTimeout(function () {

        $("#" + divId).append(char);
        textInside = $("#" + divId).html();
        if (textInside == textToProcess) {
            if (count === 1) {
                display(emotionText)
            }
            if (doneTyping === true &&
                count === 2) {
                display(beautyText)
            }
            if (count === 3) {
                count = 0
            }
            doneTyping = true;
        }
    }, addedTime);
}
//===============================================
let styleBubbleText = function (text) {
    addedTime = 0;
    textToProcess = text;
    console.log(text)
    doneTyping = false;
    divId = count
    for (i = 0; i < textToProcess.length; i++) {
        addedTime += 50;
        actionBarSetTimeout(textToProcess[i], addedTime);
    }


}


