angular.module('MainCtrl', ['percentFilter', 'endDateFilter']).controller('MainController', function($scope, $resource, $sce, $routeParams) {
	
	//var entry = $resource('/mock/api/v1/person.json');
	var entry = $resource('/api/v1/search.json?address=:address&citystatezip=:citystatezip');
	//var entry = $resource('/mock/api/v1/search.json');
	
	console.log($routeParams);
	$scope.address = $routeParams.address;
	$scope.citystatezip = $routeParams.citystatezip; 

	if($scope.address && $scope.citystatezip){
		$scope.search($scope.address,$scope.citystatezip);
	}

	$scope.form;

	$scope.city;
	$scope.state;
	$scope.zip;
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
	
	$scope.searchByForm = function(address, city, state, zip){
		
		$scope.city = city;
		$scope.state = state;
		$scope.zip = zip;
		
		$scope.citystatezip = encodeURI(city+" "+state+" "+zip);
		
		$scope.search(address, $scope.citystatezip);
	}

	$scope.search = function(address, citystatezip){
		
		$scope.state;
		$scope.zip
		$scope.searchQueried = false;
		$scope.mapsApiKey = 'AIzaSyAtwVSPdFvVErwpn25y2JjvNOVYsjvaK7Q';
		
	//	$scope.address = encodeURI(address);
		//$scope.citystatezip = encodeURI($scope.city + " " + $scope.state); 
		
		$scope.result = entry.get({ address: address, citystatezip: citystatezip}, function(data){
			//console.log($scope.form);
			//console.log(data);

			var result = data["SearchResults:searchresults"].response[0].results[0].result[0];

			$scope.estimate = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].amount[0]["_"];
			$scope.low = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].valuationRange[0].low[0]["_"];
			$scope.high = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].valuationRange[0].high[0]["_"];

			//console.log(data["SearchResults:searchresults"].response[0].results[0].result[0]);

			//console.log(data["SearchResults:searchresults"].response[0].results[0].result[0].bathrooms[0]);

			//console.log(result.bedrooms);
			$scope.bedrooms = result.bedrooms === undefined ? '-' : result.bedrooms[0];
			$scope.bathrooms = data["SearchResults:searchresults"].response[0].results[0].result[0].bathrooms[0];
			$scope.finishedSqFt = data["SearchResults:searchresults"].response[0].results[0].result[0].finishedSqFt[0];
			$scope.lastSoldDate = data["SearchResults:searchresults"].response[0].results[0].result[0].lastSoldDate[0];
			$scope.lastSoldPrice = data["SearchResults:searchresults"].response[0].results[0].result[0].lastSoldPrice[0]["_"];
			$scope.yearBuilt = data["SearchResults:searchresults"].response[0].results[0].result[0].yearBuilt[0];

			$scope.change = data["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].valueChange[0]["_"];


			
			$scope.address = decodeURI(address);
			
			var foo = decodeURI(citystatezip).split(" ");
			console.log(foo);
			$scope.city = foo[0];
			$scope.state = foo[1];
			$scope.zip = foo[2];

			console.log($scope.state);
			console.log(decodeURI(citystatezip));
			console.log(citystatezip);

			$scope.searchQueried = true;		
		});
}

$scope.getMapsUrl = function(){
		//var location = $scope.result.demographics.locationDeduced.deducedLocation.replace(/\s+/g, '').split(',').join('+'); //Strip whitespace, then replace commas with '+'
		$scope.mapsUrl = 'https://www.google.com/maps/embed/v1/search?key='+$scope.mapsApiKey+'&q=' + encodeURI($scope.address + " " + $scope.citystatezip);		
		console.log($scope.mapsUrl);
		return $scope.trustSrc($scope.mapsUrl);
	}

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}

});