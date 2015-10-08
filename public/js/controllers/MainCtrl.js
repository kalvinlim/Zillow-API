angular.module('MainCtrl', ['percentFilter', 'endDateFilter']).controller('MainController', function($scope, $resource, $sce) {
	
	//var entry = $resource('/mock/api/v1/person.json');
	var entry = $resource('/api/v1/search.json?address=:address&citystatezip=:citystatezip');
	//var entry = $resource('/mock/api/v1/search.json');
	
	$scope.form;
	$scope.address;
	$scope.city;
	$scope.mapsUrl = 'https://www.google.com/maps/embed/v1/search?key='+$scope.mapsApiKey+'&q=';
	$scope.estimate;
	$scope.low;
	$scope.high;
	$scope.change;
	$scope.bathrooms;
	$scope.finishedSqFt;
	$scope.lastSoldDate;
	$scope.lastSoldPrice;
	$scope.yearBuilt;
	$scope.bedrooms;
	
	$scope.search = function(){
		
	$scope.state;
	$scope.zip
	$scope.searchQueried = false;
	$scope.mapsApiKey = 'AIzaSyAtwVSPdFvVErwpn25y2JjvNOVYsjvaK7Q';
		
		$scope.address = encodeURI($scope.form.address);
		$scope.citystatezip = encodeURI($scope.form.city + " " + $scope.form.state); 
		//console.log($scope.citystatezip);
		//console.log($scope.address);
		$scope.result = entry.get({ address: $scope.address, citystatezip: $scope.citystatezip}, function(data){
			console.log($scope.form);
			console.log(data);
			
			//var zestimate = data["SearchResults:searchresults"].response[0].results[0].result[0];
			
			$scope.estimate = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].amount[0]["_"];
			$scope.low = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].valuationRange[0].low[0]["_"];
			$scope.high = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].valuationRange[0].high[0]["_"];
			
			console.log(data["SearchResults:searchresults"].response[0].results[0].result[0]);

			console.log(data["SearchResults:searchresults"].response[0].results[0].result[0].bathrooms[0]);

			$scope.bedrooms = data["SearchResults:searchresults"].response[0].results[0].result[0].bedrooms[0] || null	;
			$scope.bathrooms = data["SearchResults:searchresults"].response[0].results[0].result[0].bathrooms[0];
			$scope.finishedSqFt = data["SearchResults:searchresults"].response[0].results[0].result[0].finishedSqFt[0];
			$scope.lastSoldDate = data["SearchResults:searchresults"].response[0].results[0].result[0].lastSoldDate[0];
			$scope.lastSoldPrice = data["SearchResults:searchresults"].response[0].results[0].result[0].lastSoldPrice[0]["_"];
			$scope.yearBuilt = data["SearchResults:searchresults"].response[0].results[0].result[0].yearBuilt[0];
 
			$scope.change = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].valueChange[0]["_"];


			$scope.searchQueried = true;		
		});
	}
	
	$scope.getMapsUrl = function(){
		//var location = $scope.result.demographics.locationDeduced.deducedLocation.replace(/\s+/g, '').split(',').join('+'); //Strip whitespace, then replace commas with '+'
		$scope.mapsUrl = 'https://www.google.com/maps/embed/v1/search?key='+$scope.mapsApiKey+'&q=' + $scope.address;		
		return $scope.trustSrc($scope.mapsUrl);
	}

	$scope.trustSrc = function(src) {
    	return $sce.trustAsResourceUrl(src);
  	}
    	
});