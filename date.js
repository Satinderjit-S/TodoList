
module.exports.getDate=getDate;

function getDate(){
  var date = new Date();
  var options= {
    weekday:"long",
    day:"numeric",
    month:"long"
  };

  var pagedate=date.toLocaleDateString("en-us",options);

  return pagedate;
}

//Refactored function
//module.exports.getDate OR
exports.getDay = function() {
  var date = new Date();
  var options= {
    weekday:"long",
  };

  var pagedate=date.toLocaleDateString("en-us",options);

  return pagedate;
};
