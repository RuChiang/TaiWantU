var taiWantUApp = angular.module('taiWantU', []);

taiWantUApp.controller('taiWantUController', function($scope, $http, $location, $window ) {
	$scope.showHomePage = true;
	$scope.rootUrl = $location.absUrl();




	//when the user click the h1 header at index.html
	$scope.testText = function(){
		$http.get("/text/test").then((res,err)=>{
			console.log(res.data);
			$scope.test = res.data;
		});
		console.log("button clicked");
	};

	//when user click the login/signup button at index.html
	$scope.loginSignup = function(){
		//$window.location.href =  $location.absUrl() + 'login-signup.html';
		$window.location.href = 'login-signup.html';

	};

	//when the user click the login button at login-signup.html
	$scope.login = function(user){
		if(!(user.email.length === 0 || user.password.length === 0)){
			$http.post('/user/login',user).then((res,err)=>{
				if(res){
					$scope.loginSignupRes = res;
					if(res.data === "successful login"){
						//console.log($location.host());
						$window.location.href = '/loggedIn.html';
					}
				}else{
					console.log(err);
				}

			});
		}
	}

	//when the user click the signup button at login-signup.html
	$scope.signup = function(user){
		if(!(user.email.length === 0 || user.password.length === 0)){
			$http.post('/user/signup',user).then((res,err)=>{
				if(res){
					$scope.loginSignupRes = res;
					if(res.data === "successful signup"){
						$window.location.href = '/loggedIn.html';
					}

				}else{
					console.log(err);
				}
			});
		}
	}

	$scope.logout = function(){
		console.log("logging out");
		$http.delete('/user/logout').then((res,err)=>{
			if(res){
				console.log(res);
				if(res.data === "successful logout"){
					$window.location.href = '/';
				}
			}
		});
	}

});
