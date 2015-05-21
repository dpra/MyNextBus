var UI = require('ui');
var ajax = require('ajax');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'My Next Bus',
  subtitle:'Fetching...'
});

// Display the Card
card.show();

// Construct URL
var busID = '65399';
var serviceNo = '386';
var URL = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' + busID + '&ServiceNo=' + serviceNo;

// Make the request
ajax(
  {
    url: URL,
    type: 'json',
    headers: {'AccountKey': 'a02plDzhcB9iL0SOJwpEgQ==', 'UniqueUserID' : '330f8faa-c393-4315-951e-d13c74c158f4'}
    
  },
  function(data) {
    // Success!
    console.log("Successfully fetched");

    // Extract data
    var subsdatediff;
    var serviceno;
    var mindisplay;
    
    var status = data.Services[0].Status;
    
    if (status.toLowerCase() == "in operation")
    {
    serviceno = data.Services[0].ServiceNo;
    var nextbus = data.Services[0].NextBus;
    
    // Next Bus
    var vesttime = nextbus.EstimatedArrival.substr(0,19);
    var esttime = new Date(vesttime);
    
    var startdate = new Date();
    var diff = esttime - startdate;
    var datediff = new Date(diff);
    
    // Next Subsequent Bus
    var subsbus = data.Services[0].SubsequentBus;
        
    if (subsbus !== null)
    {
    var vsubsesttime = subsbus.EstimatedArrival.substr(0,19);
    var sesttime = new Date(vsubsesttime);
    var subsdiff = sesttime - startdate;
    subsdatediff = new Date(subsdiff);
    }
    
    var mindiff = datediff.getMinutes();
    var subsmindiff = subsdatediff.getMinutes(); 
    
    if (mindiff > 1 || subsmindiff > 1)
    {
      mindisplay = "mins";
    }else
    {
     mindisplay = "min";
    }
      
    // Show to user
      
    card.subtitle("Bus No: " + serviceno);
    card.body("Next Bus: "+ mindiff + " " + mindisplay + "\nNext Subsequent Bus: " + subsmindiff + " " + mindisplay);
    }
    else if(status.toLowerCase() == "not in operation"){
    serviceno = data.Services[0].ServiceNo;
    card.subtitle("Bus No: " + serviceno);
    card.body("Not In Operation");
    }
 
  },
  function(error) {
    // Failure!
    console.log('Failed fetching: ' + error);
  }
);