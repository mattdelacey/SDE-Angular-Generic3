angular.module('starter.controllers', ['kinvey', 'ngCordova'])

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('MapCtrl', function($scope, $kinvey, $rootScope) {
    console.log('mapctrl');
    var gmarkers = [];

    $scope.initialize = function() {

        console.log('initializing map');

        var myLatlng = new google.maps.LatLng(39.8282109, -98.5795706);
        //$scope.mybrand = mybrand;
        var mapOptions = {
            center: myLatlng,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $rootScope.map = new google.maps.Map(document.getElementById("mymap"),
            mapOptions);
    } // end initialize


     $scope.doRefresh = function() {
            //check to see if a range has been specified
            console.log('refresh');
            if (document.getElementById("myrange").value == "") {
                console.log('no range');
                var dataStore = $kinvey.DataStore.getInstance('Account');

                dataStore.find().then(function(locations) {
                    console.log(locations);
                    locations = locations.cache;
                    for (var i = 0; i < locations.length; i++) {
                        var mylat = parseInt(locations[i]._geoloc[0]);
                        var mylong = parseInt(locations[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(locations[i].company.name);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + locations[i].name + '<br><b>Notes:</b> ' + locations[i].company.name
                        });


                        var mapOptions = {

                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: locations[i].name
                        });
                        gmarkers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }

                });
            } else {
                console.log('range specified');
                console.log('gmarker len = ' + gmarkers.length);
                console.log($rootScope.current_loc);

                var myrange = document.getElementById("myrange").value;

                console.log('getting position');

                // Query for buildings close by.
                var query = new $kinvey.Query();
                var dataStore = $kinvey.DataStore.getInstance('Account');
                query.near('_geoloc', $rootScope.current_loc, myrange);
                var promise = dataStore.find(query);
                promise.then(function(models) {

                    console.log('num markers = ' + models.length);
                    for (i = 0; i < gmarkers.length; i++) {
                        console.log('clearing marker...');
                        gmarkers[i].setMap(null);
                    }


                    for (var i = 0; i < models.length; i++) {
                        var mylat = parseInt(models[i]._geoloc[0]);
                        var mylong = parseInt(models[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(models[i].company.name);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + models[i].name + '<br><b>Notes:</b> ' + models[i].company.name
                        });

                        var mapOptions = {
                            //center: myLatlng,
                            //zoom: 3,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: models[i].name
                        });

                        gmarkers.push(marker);

                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }
                }, function(err) {
                    console.log(err);
                });

            }

        } // end doRefresh

     $scope.$on('$ionicView.beforeEnter', function() {

        console.log( 'before entering map view');
        var dataStore = $kinvey.DataStore.getInstance('Account');

        dataStore.find().then(function(locations) {
            console.log(locations.cache);
            locations = locations.cache;
            console.log(locations.length);
            for (var i = 0; i < locations.length; i++) {
                var mylat = parseInt(locations[i]._geoloc[0]);
                var mylong = parseInt(locations[i]._geoloc[1]);
                console.log(mylat + ", " + mylong);

                var info = new google.maps.InfoWindow({
                    content: '<b>Who:</b> ' + locations[i].accountname + '<br><b>Company:</b> ' + locations[i].accountcompany
                });

                var mapOptions = {

                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var myLatlng = new google.maps.LatLng(mylat, mylong);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: $rootScope.map,
                    title: locations[i].name
                });
                gmarkers.push(marker);
                google.maps.event.addListener(marker, 'click', (function(info) {
                    return function() {
                        info.open($rootScope.map, this);
                    }
                })(info));

            }

        });
    });



})

/*.controller('MapCtrl', function($scope, $kinvey, $rootScope) {

    var gmarkers = [];

    $scope.doRefresh = function() {
            //check to see if a range has been specified
            if (document.getElementById("myrange").value == "") {
                console.log('no range');
                $kinvey.DataStore.find('geo').then(function(locations) {
                    console.log(locations);
                    for (var i = 0; i < locations.length; i++) {
                        var mylat = parseInt(locations[i]._geoloc[0]);
                        var mylong = parseInt(locations[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(locations[i].company.name);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + locations[i].name + '<br><b>Notes:</b> ' + locations[i].company.name
                        });


                        var mapOptions = {

                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: locations[i].name
                        });
                        gmarkers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }

                });
            } else {
                console.log('range specified');
                console.log('gmarker len = ' + gmarkers.length);
                console.log($rootScope.current_loc);

                var myrange = document.getElementById("myrange").value;

                console.log('getting position');

                // Query for buildings close by.
                var query = new $kinvey.Query();
                query.near('_geoloc', $rootScope.current_loc, myrange);
                var promise = $kinvey.DataStore.find('geo', query);
                promise.then(function(models) {

                    console.log('num markers = ' + models.length);
                    for (i = 0; i < gmarkers.length; i++) {
                        console.log('clearing marker...');
                        gmarkers[i].setMap(null);
                    }


                    for (var i = 0; i < models.length; i++) {
                        var mylat = parseInt(models[i]._geoloc[0]);
                        var mylong = parseInt(models[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(models[i].company.name);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + models[i].name + '<br><b>Notes:</b> ' + models[i].company.name
                        });

                        var mapOptions = {
                            //center: myLatlng,
                            //zoom: 3,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: models[i].name
                        });

                        gmarkers.push(marker);

                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }
                }, function(err) {
                    console.log(err);
                });

            }

        } // end doRefresh



    $scope.$on('$ionicView.beforeEnter', function() {

        $kinvey.DataStore.find('geo').then(function(locations) {
            console.log(locations);
            for (var i = 0; i < locations.length; i++) {
                var mylat = parseInt(locations[i]._geoloc[0]);
                var mylong = parseInt(locations[i]._geoloc[1]);
                console.log(mylat + ", " + mylong);
                var info = new google.maps.InfoWindow({
                    content: '<b>Who:</b> ' + locations[i].name + '<br><b>Notes:</b> ' + locations[i].company.name
                });

                var mapOptions = {

                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var myLatlng = new google.maps.LatLng(mylat, mylong);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: $rootScope.map,
                    title: locations[i].name
                });
                gmarkers.push(marker);
                google.maps.event.addListener(marker, 'click', (function(info) {
                    return function() {
                        info.open($rootScope.map, this);
                    }
                })(info));

            }

        });
    });


    $scope.initialize = function() {

        console.log('initializing map');

        var myLatlng = new google.maps.LatLng(39.8282109, -98.5795706);
        //$scope.mybrand = mybrand;
        var mapOptions = {
            center: myLatlng,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $rootScope.map = new google.maps.Map(document.getElementById("mymap"),
            mapOptions);
    }

})*/




.controller('SearchCtrl', function($scope, $kinvey, $sce) {

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('load search view');

        var dataStore = $kinvey.DataStore.getInstance('Products');

        dataStore.find().then(function(result) {
            var products = result.cache;
            console.log(products);
            $scope.products = products;
        });
    });


    $scope.searchme = function() {
        console.log('inside searchctrl');

        console.log(document.getElementById("chosenProduct").value);
        var dataStore = $kinvey.DataStore.getInstance('Products');

        var query = new $kinvey.Query();
        query.equalTo('title', document.getElementById("chosenProduct").value);
        dataStore.find(query).then(function(result) {
            var thisproduct = result.cache;
            console.log(thisproduct);
            $scope.thisproduct = thisproduct;
            $scope.$digest();
            return result.networkPromise;
        }).then(function(thisproduct) {
            $scope.thisproduct = thisproduct;
            $scope.$digest();

            return;
        });
    };
})

.controller('InsertTicketCtrl', function($scope, $kinvey, $ionicLoading) {
    $scope.insertme = function() {
        var mytask = document.getElementById("task").value;
        document.getElementById("task").value = "";
        console.log(mytask);

        var myduedate = document.getElementById("duedate").value;
        console.log(duedate);
        document.getElementById("duedate").value = "";



        var mycomplete = document.getElementById("completed").checked;
        console.log(mycomplete);


        var complete = false;
        if (mycomplete == true) {
            complete = true;
        } else {
            complete = false;
        }


        var data = {};

        data.action = mytask;
        data.duedate = myduedate;
        data.completed = complete;
        data.class = "personal";
        data.Title = "Personal Task";
        console.log(JSON.stringify(data));

        var dataStore = $kinvey.DataStore.getInstance('todo');

        dataStore.save(data).then(function(result) {
            console.log(result);
        });

        $ionicLoading.show({
            template: 'task inserted',
            noBackdrop: true,
            duration: 2000
        });

    };
})





.controller('ProductCtrl', function($scope, $kinvey) {

    var dataStore = $kinvey.DataStore.getInstance('Products');

    $scope.$on('$ionicView.beforeEnter', function() {

        console.log('inside productctrl');

        dataStore.find().then(function(result) {
            var products = result.cache;
            console.log(products);
            $scope.products = products;
            $scope.$digest();
            return result.networkPromise;
        }).then(function(products) {

            console.log(products);
            $scope.products = products;
            $scope.$digest();
            return;
        });
    });
})



.controller('ProjectsCtrl', function($scope, $kinvey) {

    $scope.doRefresh = function() {
        console.log('todorefresh');
        var dataStore = $kinvey.DataStore.getInstance('todo');

        dataStore.find(null, {
            useDeltaFetch: false
        }).then(function(result) {
            var tasks = result.cache;
            console.log(tasks);
            $scope.tasks = tasks;
            $scope.$digest();
            return result.networkPromise;
        }).then(function(tasks) {
            console.log(tasks);
            $scope.tasks = tasks;
            $scope.$digest();
            return;
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('todo load view');
        var dataStore = $kinvey.DataStore.getInstance('todo');

        // pass null and the useDeltaFetch option because some of the delta fetch options for
        // rapid connectors might not be there in SharePoint today
        //
        dataStore.find(null, {
            useDeltaFetch: false
        }).then(function(result) {
            var tasks = result.cache;
            console.log(tasks);
            $scope.tasks = tasks;
            $scope.$digest();
            // use networkPromise with new library
            return result.networkPromise;
        }).then(function(tasks) {
            $scope.tasks = tasks;
            $scope.$digest();
            return;
        });
    });

})

.controller('RefCtrl', function($scope, $kinvey) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    $scope.doRefreshRef = function() {
        console.log('ref refresh view');
        var fileStore = $kinvey.DataStore.getInstance(null, $kinvey.DataStoreType.File);

        var query = new $kinvey.Query();
        query.greaterThan('size', 0);
        var promise = fileStore.find(query);
        promise.then(function(result) {
            console.log(result);
            var files = result;
            console.log(files);
            $scope.files = files;
            $scope.$digest();
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('ref load view');
        var fileStore = $kinvey.DataStore.getInstance(null, $kinvey.DataStoreType.File);

        var query = new $kinvey.Query();
        query.greaterThan('size', 0);
        var promise = fileStore.find(query);
        promise.then(function(result) {
            console.log(result);
            var files = result;
            console.log(files);
            $scope.files = files;
            $scope.$digest();
        });
    });
})

.controller('PartnerCtrl', function($scope, $kinvey) {

    $scope.doRefresh = function() {
        console.log('refresh');

        var dataStore = $kinvey.DataStore.getInstance('Account');

        dataStore.find(null, {
            useDeltaFetch: false
        }).then(function(result) {
            console.log(result);
            var accounts = result.cache;
            console.log(accounts);
            $scope.accounts = accounts;
            return result.networkPromise;
        }).then(function(accounts) {
            $scope.accounts = accounts;
            $scope.$digest();
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('account load view');
        var dataStore = $kinvey.DataStore.getInstance('Account');
        dataStore.find(null, {
            useDeltaFetch: false
        }).then(function(result) {
            var accounts = result.cache;
            console.log(accounts);
            $scope.accounts = accounts;
            return result.networkPromise;
        }).then(function(accounts) {
            $scope.accounts = accounts;
            $scope.$digest();
            return;
        });
    });

})



.controller('BrandCtrl', function($scope, $kinvey) {

    $scope.doRefreshBrand = function() {
        console.log('refresh brand');
        $kinvey.DataStore.find('brand').then(function(mybrand) {
            console.log(mybrand);
            $scope.mybrand = mybrand;
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('partner load view');
        $kinvey.DataStore.find('brand').then(function(brand) {
            console.log(brand);
            $scope.mybrand = brand;
        });
    });

})



.controller('MenuCtrl', function($scope, $kinvey, $ionicSideMenuDelegate, $ionicModal) {
    console.log('inside menuctrl');
    $scope.toggleLeft = function() {
        console.log('inside toggleleft');
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicModal.fromTemplateUrl('templates/modal.html', function(modal) {
        $scope.modal = modal;
    }, {
        animation: 'slide-in-up'
    });
})



.controller('HomeCtrl', function($scope, $kinvey, $ionicSideMenuDelegate, $rootScope, $state) {
    console.log('home');

     navigator.geolocation.getCurrentPosition(function(loc) {
                console.log('getting position');
                var coord = [loc.coords.latitude, loc.coords.longitude];
                console.log(coord);
                $rootScope.current_loc = coord;
        });


    $scope.$on('$ionicView.beforeEnter', function() {
        // we're authenticated, grab logo and color scheme
        console.log('home');
        var query = new $kinvey.Query();
        query.equalTo('ActiveBrand', true);
        var activeUser = $kinvey.User.getActiveUser();

        if (!activeUser) {
            // activeUser is null, go to account tab
            $state.go('menu.tabs.account');
            return;
        }
        console.log(activeUser);

        var dataStore = $kinvey.DataStore.getInstance('DemoBrandingData', $kinvey.DataStoreType.Network);


        dataStore.find(query).then(function(result) {
            console.log(result);
            var brand = result;
            console.log(brand);
            $rootScope.primarycolor = brand[0].PrimaryColor;

            if (brand[0].LogoFileName.indexOf('http') == -1) {
                console.log('local path');
                brand[0].LogoFileName = "img/" + brand[0].LogoFileName;
            }
            $rootScope.logo = brand[0].LogoFileName;
            $rootScope.screenText = brand[0].HomeScreenText;
            $rootScope.textColor = brand[0].PrimaryTextColor;
            $rootScope.customer = brand[0].CustomerName;
            $rootScope.accountsname = brand[0].AccountsName;
            $rootScope.tasksname = brand[0].TasksName;
            $rootScope.addtaskname = brand[0].AddTaskName;
            $rootScope.calcname = brand[0].CalculatorName;
            $rootScope.productsname = brand[0].ProductsName;
            $scope.$digest();
            return result.networkPromise;
        }).catch(function(error) {
            console.log(error);
        });
    });


})



.controller('AccountCtrl', function($scope, $state, $kinvey, $cordovaPush, $http) {
    $scope.userData = {
        email: "",
        password: ""
    };

    $scope.validateUserKinvey = function() {

        console.log($scope.userData.email);

        var promise = $kinvey.User.login({
            username: $scope.userData.email,
            password: $scope.userData.password
        });
        promise.then(
            function(response) {
                //Kinvey login finished with success
                $scope.submittedError = false;
                console.log('logged in with KinveyAuth');
                $state.go('menu.tabs.home');
                return $kinvey.Push.register();
            },
            function(error) {
                //Kinvey login finished with error
                $scope.submittedError = true;
                $scope.errorDescription = error.description;
                console.log("Error login " + error.description); //
            }
        );
    };



    $scope.validateUser = function() {
        console.log('login user');

        var user = new $kinvey.User();
        user.loginWithMIC('http://localhost:8100', $kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, {
            version: 2
        }).then(function(user) {
            console.log('logged in');
            $scope.submittedError = false;
            console.log(user);

            return $kinvey.Push.register();

        }).catch(function(error) {
            console.log(error);
            return null;
        }).then(function() {
            $state.go('menu.tabs.home');
        }, function(err) {
            console.log("error logging in");
            $scope.submittedError = true;
            $scope.errorDescription = err.description;
            console.log(err);
            console.log("Error login " + err.description);
            $state.go('menu.tabs.account');
        });
    }

    $scope.signUp = function() {
        var promise = $kinvey.User.signup({
            username: $scope.userData.email,
            password: $scope.userData.password,
            email: $scope.userData.email
        });
        console.log("signup promise");
        promise.then(
            function() {
                //Kinvey signup finished with success
                $scope.submittedError = false;
                console.log("signup success");
                $state.go('menu.tabs.home');
            },
            function(error) {
                //Kinvey signup finished with error
                $scope.submittedError = true;
                $scope.errorDescription = error.description;
                console.log("signup error: " + error.description);
            }
        );
    };

    $scope.logout = function() {
        console.log('logout user');
        //Kinvey logout starts
        var user = $kinvey.User.getActiveUser();
        if (user) {
            return user.logout().catch(function(error) {
                //Kinvey logout finished with error
                alert("Error logout: " + JSON.stringify(error));
            });
        }

    }

});