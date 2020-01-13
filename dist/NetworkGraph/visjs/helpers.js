// import { Constants } from "js-common";
// const ConfigurationTypes = Constants.ConfigurationTypes.Types;
import { ConfigurationTypes } from "../../js-common-deps/ConfigurationTypes";
export function Node(id, attributes, label, group) {
  return {
    id: id,
    label: label,
    group: group,
    attributes: attributes
  };
}
export var Groups = {
  Computer: "computer",
  Hub: "hub",
  Printer: "printer",
  Router: "router",
  Switch: "switch",
  Server: "server",
  Unknown: "unknown",
  Question: "question",
  Halo: "halo",
  HaloForHub: "haloForHub",
  Plus: "plus",
  Minus: "minus",
  GroupSize: "groupSize"
};
export var FilteredGroups = {
  Computer: "computerFiltered",
  Hub: "hubFiltered",
  Printer: "printerFiltered",
  Router: "routerFiltered",
  Switch: "switchFiltered",
  Server: "serverFiltered",
  Unknown: "unknownFiltered"
};
export var APIDeviceTypes = {
  COMPUTER: "COMPUTER",
  WORKSTATION: "WORKSTATION",
  HUB: "HUB",
  PRINTER: "PRINTER",
  ROUTER: "ROUTER",
  SERVER: "SERVER",
  SWITCH: "SWITCH",
  UNKNOWN: "UNKNOWN",
  NETWORK_DEVICE: "NETWORK DEVICE"
};
export function getDeviceType(device) {
  var deviceType = device.attributes["device-type"];

  if (deviceType === APIDeviceTypes.UNKNOWN || deviceType === APIDeviceTypes.NETWORK_DEVICE) {
    var configurationTypeName = device.attributes["configuration-type-name"];

    switch (configurationTypeName) {
      case ConfigurationTypes.SWITCH:
        return APIDeviceTypes.SWITCH;

      case ConfigurationTypes.SERVER:
        return APIDeviceTypes.SERVER;

      case ConfigurationTypes.ROUTER:
        return APIDeviceTypes.ROUTER;

      case ConfigurationTypes.COMPUTER:
        return APIDeviceTypes.WORKSTATION;

      case ConfigurationTypes.PRINTER:
        return APIDeviceTypes.PRINTER;
    }
  }

  return deviceType;
}