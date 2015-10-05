var contollers = angular.module('CovalentFitness.controllers', [])

contollers.controller('AppCtrl', function($scope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });

})

contollers.controller('SignupCtrl', function($scope, $location, Auth) {

  $scope.signupData = {};

  $scope.doSignup = function() {
    Auth.signup($scope.signupData)
      .then(function() {
        $location.path('/api/workouts'); // for right now
      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('LoginCtrl', function($scope, $location, Auth) {

  // Form data for the login
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    Auth.login($scope.loginData)
      .then(function() {
        $location.path('/app/workouts');
      })
      .catch(function(error) {
        console.error(error);
      });

  };
})

contollers.controller('LogoutCtrl', function($scope, Auth) {

  $ionicModal.fromTemplateUrl('views/logout.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.doLogout = function() {
    Auth.logout()
      .then(function() {
        $location.path('/app/signuplogin');
      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('UniversalFeedCtrl', function($scope) {

  $scope.UniversalFeed = [];

  $scope.loadUniversalFeed = function() {
    var oldestListed = $scope.UniversalFeed[length - 1]

    Feed.getUniversalFeed(15, oldestListed.id)
      .then(function(feed) {

        $scope.UniversalFeed.concat(feed)

      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('FollowingFeedCtrl', function($scope) {

  $scope.FollowingFeed = [];

  $scope.loadFollowingFeed = function() {

    var oldestListed = $scope.FollowingFeed[length - 1] || null

    Feed.getFollowingFeed(15, oldestListed.id)
      .then(function(feed) {

        $scope.FollowingFeed.concat(feed)

      })
      .catch(function(error) {
        console.error(error);
      });
  };
});

contollers.controller('FollowingCtrl', function($scope) {

  $scope.followingUsers = {}

  $scope.loadFollowing = function() {
    Following.getFollowing()
      .then(function(followingUsers) {
        $scope.followingUsers = followingUsers
      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('WorkoutsCtrl', function($scope, $location, WorkoutServices) {
  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;

  $scope.workoutList = [];

  //functions for Workouts Controller ==========

  $scope.loadWorkoutList = function() {
    WorkoutServices.getAllWorkouts()
      .then(function(allWorkouts) {
        $scope.workoutList = allWorkouts;
      });
  };

  $scope.selectWorkout = function(wrkt) {
    WorkoutServices.setWorkout(wrkt);
    $location.path('/app/workout');
  };

  $scope.addWorkout = function() {
    WorkoutServices.setWorkout(null);
    $location.path('/app/editWorkout'); // removed .then()
  };

  $scope.templateWorkout = function() {
    WorkoutServices.setWorkout(wrkt)
      .then($location.path('/app/editWorkout'));
  };

  $scope.editWorkout = function(wrkt) {
    WorkoutServices.setWorkout(wrkt)
      .then($location.path('/app/editWorkout'));
  };

  $scope.loadWorkoutList();

})

contollers.controller('WorkoutCtrl', function($scope, $location, WorkoutServices) {

  $scope.workout = null;

  //functions for Workout Controller ==========

  $scope.loadWorkout = function() {
    WorkoutServices.getSpecificWorkout()
      .then(function(specWorkout) {
        $scope.workout = specWorkout;
      });
  };

  $scope.editWorkout = function(wrkt) {
    WorkoutServices.setWorkout(wrkt)
      .then($location.path('/app/editWorkout'));
  };

  //nav ==========

  // $scope.goBack = function() {
  //   WorkoutServices.setWorkout(null);
  //   $location.path('/app/workouts'); // removed .then()
  // };

  $scope.loadWorkout();

})

contollers.controller('WorkoutEditsCtrl', function($scope, $location, $ionicModal, WorkoutServices) {

  // button func ==========
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  //*****NOTE the modal is unfinished*****

  // modal for collection edit info ==========
  $ionicModal.fromTemplateUrl('../views/workoutEditsModal.html', {
    scope: $scope,
    animation: 'slide-in-up' // I am having trouble finding an alternate animation. 
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();

  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  //workoutedits controller vars and functions ==========
  $scope.currentWorkout = null;

  // $scope.goBack = function() {
  //   WorkoutServices.setWorkout(null);
  //   $location.path('/app/workouts'); // removed .then()
  // };

  //right now edits send to server each time, maybe we can accumulate these here and send to server on 'save' or 'exit'.  We should talk about which we want.

  $scope.adEx = function() {
    //getting this figured out with modal *****
  };

  $scope.editEx = function() {
    //getting this figured out with modal *****
  };

  $scope.deleteEx = function(move) {
    WorkoutServices.deleteMoveFromWorkout(move)
      .then($scope.loadCurrentWorkout());
  };

  $scope.loadCurrentWorkout = function() {
    WorkoutServices.getSpecificWorkout()
      .then(function(specWorkout) {
        $scope.currentWorkout = specWorkout;
      });
  };

  //need to if check current WO (blank or current) and set initial state
  if (WorkoutServices.selectedWorkout.id === null) {
    $scope.currentWorkout = {};
  } else {
    $scope.loacCurrentWorkout();
  }
});
