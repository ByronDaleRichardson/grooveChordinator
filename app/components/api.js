// api request
$(document).ready(function() {
  var request={
    url:"http://api.guitarparty.com/v2/songs/",
    data:{
      query: "hotel california"
    },
    headers:{
      "Guitarparty-Api-Key": "c17fbe4fc589d2eb77e6413d03bb9f53d66668b7"
    }
  };
});

module.exports = Api;