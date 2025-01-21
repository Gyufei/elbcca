export const LINKS = [
  // {
  //   name: "Dashboard",
  //   href: "/dashboard",
  // },
  {
    name: "WorkFlow",
    href: "/workflow",
  },
  {
    name: "KeyStore",
    href: "/keystore",
  },
  {
    name: "Setting",
    href: "/setting",
  },
];

// export const defaultRoute = "/dashboard";
export const defaultRoute = "/workflow";
export const GAS_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const UNIT256_MAX =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const UNIT32_MAX = "4294967295";

export const AddressRegex = /^0x[a-fA-F0-9]{40}$/;
export const SOLAddressRegex = /^[1-9A-HJ-NP-Za-km-zA-HJ-NP-Z]+$/;
export const httpRegex = /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/;

export const TimezonesMap: Record<string, any> = {
  "-12": "Pacific/Wake",
  "-11": "Pacific/Midway",
  "-10": "Pacific/Honolulu",
  "-9": "America/Anchorage",
  "-8": "America/Los_Angeles",
  "-7": "America/Denver",
  "-6": "America/Chicago",
  "-5": "America/New_York",
  "-4": "America/Caracas",
  "-3": "America/Argentina/Buenos_Aires",
  "-2": "Atlantic/South_Georgia",
  "-1": "Atlantic/Azores",
  "0": "Etc/UTC",
  "1": "Europe/London",
  "2": "Europe/Berlin",
  "3": "Europe/Moscow",
  "4": "Asia/Dubai",
  "5": "Asia/Karachi",
  "6": "Asia/Dhaka",
  "7": "Asia/Bangkok",
  "8": "Asia/Shanghai",
  "9": "Asia/Tokyo",
  "10": "Australia/Sydney",
  "11": "Pacific/Noumea",
  "12": "Pacific/Auckland",
};

export const TzList = (() => {
  const arr = [];
  for (let i = 13; i >= -12; i--) {
    let temp = "";
    if (i > 0) {
      temp = `+${i}`;
    }
    if (i < 0) {
      temp = `-${-1 * i}`;
    }
    arr.push({
      text: `UTC${temp}`,
      value: i,
    });
  }
  return arr;
})();

export const DexImgMap = {
  uniswap: "/icons/uniswap.svg",
  pancakeSwap: "/icons/pancakeswap.png",
  swap: "/icons/swap.svg",
  transfer: "/icons/dex.svg",
};
