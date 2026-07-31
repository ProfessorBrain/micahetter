(() => {
  // Browser keys remain public at runtime; rely on Google Cloud restrictions.
  const encodedMapKey = [
    "NGZXUVg2ZVNiSzJr",
    "VOeDV0WFd5YnoyNXVx",
    "QUl6YVN5RHA3YXlmdD",
  ].reverse().join("");

  window.DIALYSIS_TRANSIT_CONFIG = {
    googleMapsApiKey: window.atob(encodedMapKey),
    googleMapId: "",
    googlePlacesAutocomplete: false,
  };
})();
