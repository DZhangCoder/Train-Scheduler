// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCQ1eNXEs_LG-dpVAyXzc4UGwyBUOyIhKA",
    authDomain: "train-scheduler-34178.firebaseapp.com",
    databaseURL: "https://train-scheduler-34178.firebaseio.com",
    projectId: "train-scheduler-34178",
    storageBucket: "train-scheduler-34178.appspot.com",
    messagingSenderId: "638693369826"
};
firebase.initializeApp(config);
var database = firebase.database();

// 2. Push user input to Firebase 
//Button for adding trains 
$("#addTrainButton").on("click", function (event) {
    event.preventDefault();

    // Grabs user input 
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var trainFrequency = $("#frequency").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTime: firstTrainTime,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);

    alert("Train information successfully added");

    // Clears all of the text-boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");
});

// 3. Create a Firebase event to retrieve train data from the train database when user adding a new entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTime;
    var trainFrequency = childSnapshot.val().frequency;

    // Logs everything to console
    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(trainFrequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainFormatted = moment(nextTrain).format("HH:mm")
 
    console.log("ARRIVAL TIME: " + nextTrainFormatted);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrainFormatted), 
        $("<td>").text(tMinutesTillTrain),
    );

    // Append the new row to the table
    $("#train_table > tbody").append(newRow);
})





