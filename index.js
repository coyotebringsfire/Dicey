var Die=require('./Die');

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * For additional samples, visit the Alexa Skills Kit developer documentation at
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
         */

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("Roll" === intentName) {
        Roll(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Dicey, "
                + "Please tell me what you want rolled, ";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what you want rolled by saying, "
                + "roll three d six minus one";
    var shouldEndSession = true;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function Roll(intent, session, callback) {
    var cardTitle = intent.name,
        diceToRollSlot = intent.slots.Dice,
        diceToRoll = "",
        repromptText = "",
        sessionAttributes = {},
        shouldEndSession = true,
        speechOutput = "";

    if (diceToRollSlot) {
        diceToRoll = diceToRollSlot.value;
        // parse the request and roll dice
        sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = toWords(doRoll(diceToRoll));
        repromptText = "You can ask me to roll dice by saying, roll three d six";
    } else {
        speechOutput = "I'm not sure what you want me to roll, please try again";
        repromptText = "I'm not sure what you want me to roll, You can ask me "
                + "to roll dice by saying, roll three d six";
    }

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

var doRoll=function(words) {
    var operands=[], operator, d,
        currentWord=words.shift();
    while( currentWord ) {
        switch(true) {
            case currentWord.match(/[\d]+d[\d]+/)!=null:
                d=new Die();
                var rollResult=d.roll(currentWord);
                operands.push( rollResult.sum );
                if( operands.length > 1) {
                    doOperator(operator, operands);
                }
                break;
            case currentWord.match(/[\d]+/)!=null:
                operands.push(parseInt(currentWord));
                if( operands.length > 1) {
                    doOperator(operator, operands);
                }
                break;
            case currentWord==="+":
            case currentWord==="plus":
                operator="+";
                break;
            case currentWord==="-":
            case currentWord==='minus':
                operator="-";
                break;
        }
        currentWord=words.shift();
    }

    return operands[0];
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}