var taiWantUApp = angular.module('taiWantU', []);

taiWantUApp.controller('taiWantUController', function($scope, $http, $location, $window ) {
	$scope.showHomePage = true;
	$scope.rootUrl = $location.absUrl();


	$scope.testText = function(){
		$http.get("/text/test").then((res,err)=>{
			console.log(res.data);
			$scope.test = res.data;
		});
		console.log("button clicked");
	};


	$scope.loginSignup = function(){
		//$window.location.href =  $location.absUrl() + 'login-signup.html';
		$window.location.href = 'login-signup.html';
	};


	$scope.login = function(user){
		if(!(user.email.length === 0 || user.password.length === 0)){
			$http.post('/user/login',user).then((res,err)=>{
				if(res){
					$scope.loginSignupRes = res;
					if(res.data === "successful login"){
						//console.log($location.host());
						$window.location.href = '/';
					}
				}else{
					console.log(err);
				}

			});
		}
	}

	$scope.signup = function(user){
		if(!(user.email.length === 0 || user.password.length === 0)){
			$http.post('/user/signup',user).then((res,err)=>{
				if(res){
					$scope.loginSignupRes = res;
					if(res.data === "successful signup"){
						$window.location.href = '/';

					}

				}else{
					console.log(err);
				}
			});
		}
	}

});
