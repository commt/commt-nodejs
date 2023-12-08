export default ({ longId = true, idStrLen = 32 }) => {
  let idStr;

  if (longId) {
    // always start with a letter -- base 36 makes for a nice shortcut
    idStr = (Math.random() * 25).toString(36).replace(".", "") + "-";
    // add a timestamp in milliseconds (base 36 again) as the base
    idStr += (Math.random() * 55).toString(36).replace(".", "") + "-";
    // similar to above, complete the Id using random, alphanumeric characters
    do {
      idStr += Math.floor(Math.random() * 35).toString(36);
    } while (idStr.length < idStrLen);
  } else {
    idStr =
      (Math.random() * 25).toString(36).replace(".", "") +
      (Math.random() * 45).toString(36).replace(".", "");
  }

  return idStr;
};
