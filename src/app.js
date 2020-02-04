'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Dialogflow, FacebookMessenger, Slack } = require('jovo-platform-dialogflow');

const app = new App();

app.use(
    new Dialogflow().use(
        new Slack(),
        new FacebookMessenger()
    ),
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() { return this.toIntent('HelloWorld');},


    HelloWorld() {


        this.tell("Hello world");


    },


    CountDown() {

        let currentDate = new Date(); 
        let relaseDate = new Date(2019,10,14,0,0,0);
        let title =  "Pokemon Sword and Shield";
        let time  = getCountDown(currentDate,relaseDate);
        let speaches;
        if(time){
             speaches = [
                `${title} is coming out in ${time}!`,
                `${title} is releasing in ${time}!`,
                `Only ${time} until ${title}!`,
                `${time} left until ${title}!`
            ]
        }
        else{
            let extraText =  "Go catch a Wooloo!";
             speaches = [
                `${title} is out now!`,
                `${title} is out! ${extraText}`,
                `${title} is here! Let's play!`,
                `${time} left until ${title}!`
            ]

            time = "Out Now!"
        }


        this.$speech.addText(speaches);
        // this.$speech.addText("speaches " + this.$inputs.title.id);
        this.showSimpleCard(title, time);

        this.tell(this.$speech);
    },


});




function getCountDown(currentDate, countdown) {
    var countDownDate = new Date(countdown).getTime();
    var now = new Date(currentDate).getTime();
    var distance = countDownDate - now;
    var utcOffset = 5;
    var daysLeft = Math.floor((Date.UTC(countdown.getFullYear(), countdown.getMonth(), countdown.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24)) - 1;
console.log("\n\n\n"+distance);
    
    if(daysLeft <= 0){
        return null;
    }


    var days = Math.floor(daysLeft);
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //	hours = hours + utcOffset;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var dayText;

    days = singularPlural(days, 'day', 'days');
    hours = singularPlural(hours, 'hour', 'hours');
    minutes = singularPlural(minutes, 'minute', 'minutes');

    var list = [days, hours, minutes]
    return addGrammar(list);


}


function addGrammar(list) {
    list = list.filter(Boolean);
    var numberOfItems = list.length;

    if (numberOfItems == 0) { return '' }

    var ret = '';

    for (var i = 0; i < numberOfItems; i++) {

        ret = ret + ' ';
        if (i == numberOfItems - 2 && !(numberOfItems <= 1)) {
            ret = ret + list[i] + ', and';

        } else if (numberOfItems > 1 && i != numberOfItems - 1) {
            ret = ret + list[i] + ',';
        } else {
            ret = ret + list[i];
        }

    }

    return ret;

}

function singularPlural(count, singular, plural) {

    if (count > 1) {
        return count + ' ' + plural;
    } else if (count == 1) {
        return count + ' ' + singular;
    } else {
        return '';
    }

}




module.exports.app = app;
