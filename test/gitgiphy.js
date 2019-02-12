
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
