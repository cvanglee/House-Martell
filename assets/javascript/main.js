var response = {}
var highestEmotion;
var count = 0;
var doneTyping = false;
var ageText
var genderText
var beautyText
var emotionText
var a = -1;
var count = 0;


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

        //display image
        //fix the orientation
        fixOrientention(base64Image, imageView);

        /*
        //base64方式上传图片
        let dic = {'image_base64' : base64Image};

        facepp.detectFace(dic,success,failed);

        */

        // turn base64 to binary
        let imageData = facepp.dataURItoBlob(base64Image);
        //根据个人需求填写的参数,这里全部写上了,包括年龄性别等,详情看官方文档
        let attributes = 'gender,age,smiling,headpose,facequality,blur,eyestatus,emotion,ethnicity,beauty,mouthstatus,eyegaze,skinstatus';
        //上传图片,获取结果
        let dataDic = { 'image_file': imageData, 'return_landmark': 2, 'return_attributes': attributes };


        //make request to the face detect SDK
        facepp.detectFace(dataDic, success, failed);
    }
}

//fix image orientation problem
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

//if succeeded
function success(e) {
    //display result
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

    function random(array) {
        randomGenerated = Math.floor(Math.random() * array.length);
        return randomGenerated
    }

    // creating sayings objects for all of the texts we have
    var ageArrays = {
        twentyUnder: [
            "Be yourself; everyone else is already taken",
            "You have to be odd to be number 1",
            "Children are the leading cause of old age.",
            "It’s alive! It’s alive!",
            "Are you made of copper and tellurium? Because you're CuTe",
            "What's a nice ghoul like you doing in a crypt like this?",
            "Adolescence is that period in a kid’s life when parents become more difficult.",
            "A certain nervous disorder afflicting the young and inexperienced.",
            "Old age is like everything else; to make a success of it, you’ve got to start young."
        ],

        thirtyUnder: [
            "Success in your twenties is more about setting the table than enjoying the feast",
            "Being an adult is just walking around wondering what you're forgetting.",
            "Remember how when you were little you could just rip off your diaper and run around naked and everyone thought it was funny?",
        ],
        fortyUnder: [
            "Surfing while middle-aged requires a lot of forty, dude.",
            "As you get older, three things happen: The first is your memory goes, and I can't remember the other two",
            "Transitional age is when during a hot day you don't know what you want – ice cream or beer.",
            "We grow too soon old and too late smart.",
            "Life expectancy would grow by leaps and bounds if green vegetables smelled as good as bacon."
        ],
        fiftyUnder: [
            "Middle age is when you still believe you’ll feel better in the morning", 
             "You are twice as sexy as two 20 somethings.", 
             "Middle age is when you're faced with two temptations and you choose the one that will get you home by nine o'clock",
             "It’s not the years, honey. It’s the mileage.",
            "If you want to know what you’ll look like in ten years, look in the mirror after you’ve run a marathon.",
            "You have everything now you had twenty years ago – except now it’s lower."
        ],
        sixtyOver: [
            "The older you get, the earlier it gets late.", 
            "Pastry chefs know that old age crepes up on you.", 
            "You're old enough to remember when emojis were called hieroglyphics.",
            "She is so old… she was the waitress at the last supper.",
            "Eighty is a wonderful age… especially if you’re ninety.",
            "I don't need you to remind me of my age; I have a bladder to do that for me.",
            "You know you are getting older when “Happy Hour” is a nap."
        ]
    };
    var beautyArrays = {
        quarter1: [
            "If you were a chicken, you'd be impeccable.",
            "I wish you were cross-eyed so I could see you twice.",
            "Beauty is only skin deep ...but ugly goes all the way to the bone!",
            "The greatest treasures in you are those invisible to the eye but found by the heart.",
            "The most beautiful makeup is passion, but cosmetics are easier to buy.",
            "You have the body of a 25 year old supermodel, but it takes up too much space in your freezer.",
            "You know ... beauty is in the eye of the beer holder."
        ],

        quarter2: [
            "Is your body from McDonald's? Cause I'm lovin' it!",
            "I know milk does a body good, but girl, how much have you been drinking?",
            "Excuse me? Do you work at Little Ceasars? Cuz Ur Hot And I'm Ready.",
            "You’re beautiful no matter what anybody thinks.",
            "You're so pretty, you could be in a beer commercial.",
        ],
        
        quarter3: [
            "If you were a library book, I’d check you out!",
            "Does your left eye hurt? Because you’ve been looking right all day.",
            "There's no real difference between you and George Clooney.",
            "A pretty face doesn’t mean a pretty heart."
        ],
        
        quarter4: [
            "Are you French, because Eiffel for you!",
            "I must be in a museum, because you are truly a work of art!", 
            "Are you from Tennessee? Because you're the only 10 I see!",
            "If I freeze, it's not a computer virus. I was just stunned by your beauty.",
            "I need more than 140 characters to tell you how beautiful you are."
        ],
    };
    var emotionArrays = {
        happiness: [
            'I see "Yay!" in your face', 
            "Whoever is happy will make others happy", 
            "Your pursuit of happiness is real", 
            "Be happy with what you have. Be excited about what you want", 
            "I see, you have only two kinds of days: happy and hysterically happy"
        ],
        anger: [
            `Don't use your face to say "Argh.."`, 
            "You know, anger is a short madness", 
            "Don't get your back up", 
            "You know, if you kick a stone in anger you will hurt your foot", 
            "He who angers you conquers you"
        ],
        disgust: [
            "What disgusted you?", 
            "Will you feel better if I give you a glass of water?", 
            "Close your eyes and get rid of those filthy scenes.", 
        ],
        fear: [
            "Fear is only as deep as the mind allows", 
            "Fear is faith that it won't work out", 
            "Fear is a darkroom where negatives develop", 
            "But fear doesn't need doors and windows. It works from the inside", 
            "Fear defeats more people than any other one thing in the world"
        ],
        neutral: [
            "ehhh... why're you wearing that pocker face?", 
            "A smile is an inexpensive way to improve your looks", 
            "Give me a smile, dear", 
        ],
        sadness: [
            "Tears come from the heart and not from the brain", 
            "You cannot protect yourself from sadness without protecting yourself from happiness.", 
            "Breathing is hard. When you cry so much, it makes you realize that breathing is hard.", 
            "Things change. And friends leave. Life doesn't stop for anybody.", 
            "Remember, it will get better!"
        ],

        surprise: [
            "What's so surprising?", 
            "Expect nothing. Live frugally on surprise.", 
            "The idea of waiting for something makes it more exciting"
        ],
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

    var displayArrays = [
        ageText,
        emotionText,
        beautyText,
    ]

    console.log(displayArrays)
    console.log(displayArrays.length)
    display(displayArrays) 
}
    
//Yuwen's way to display the lines letter by letter and bubble by bubble
    function display(displayArrays) {
        a = a+1
        if (a < displayArrays.length) {
            addedTime = 0;
            textToProcess = displayArrays[a];
            console.log(textToProcess)
            appendChatBox()
            for (let i in textToProcess) {
                addedTime = addedTime + 50;
                setTimeout(function () {
                    $("#" + count).append(textToProcess[i]);
                    textInside = $("#" + count).text();
                    if (textInside == textToProcess) {
                        display(displayArrays) 
                    }
                }, addedTime);
            }

        } else {
            count = 0;
            a = -1;
        }

    }


// create a function to append empty chat bubble to the screen
appendChatBox = function () {
    count++
    $("#text").append(
        '<div id = "' + count + '" class= "speech-bubble"></div>'
    )
}







