(function () {
  const noGeolocation = function () {
    alert('Sorry but for reason, we are unable to find your postion!');
  };
  if (!navigator.geolocation || !document.querySelector) {
    noGeolocation();
  } else {
    navigator.geolocation.getCurrentPosition((positionCallBack) => {
      document.querySelector("[name='latitude']").value = positionCallBack.coords.latitude;
      document.querySelector("[name='longitude']").value = positionCallBack.coords.latitude;
    },
    () => {
      noGeolocation();
    });
  }
}());
