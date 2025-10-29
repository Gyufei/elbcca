import { StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "../auth/user";
import { cloneDeep } from "lodash";
import { TimezonesMap } from "../constants/global";
import { UserEndPointPathMap } from "../end-point";

type PathMap = typeof UserEndPointPathMap;

export interface GlobalStoreSlice {
  users: Array<IUser>;
  activeUser: () => IUser | null;

  timezone: () => string;
  timezoneText: () => string;
  curTimezoneStr: () => string;
  localTimezoneStr: () => string;

  endpoint: () => string | null | undefined;
  userPathMap: () => PathMap;

  addOrUpdateUser: (user: IUser) => void;
  setUserActive: (name: string) => void;
  removeUser: (name: string) => void;
  activeLogout: () => void;
  userLogout: (name: string) => void;
}

export const CreateGlobalStoreState: StateCreator<
  GlobalStoreSlice,
  [],
  [["zustand/persist", unknown]]
> = persist(
  (set, get) => ({
    users: [],

    timezone: () => {
      const activeUser = get().activeUser();
      const userTz = activeUser?.timezone;
      return (
        userTz || String(Math.round((new Date().getTimezoneOffset() * -1) / 60))
      );
    },
    timezoneText: () => {
      const timezone = (get() as any).timezone();
      if (!timezone) return "";
      const temp = timezone >= 0 ? `+${timezone}` : timezone;
      return `UTC${temp}`;
    },
    curTimezoneStr: () => {
      const tz = get().timezone() || 0;
      return TimezonesMap[tz];
    },
    localTimezoneStr: () => {
      const offsetMinus = -new Date().getTimezoneOffset() / 60;
      const offset =
        offsetMinus > 0
          ? `${Math.abs(offsetMinus)}`
          : `-${Math.abs(offsetMinus)}`;
      return TimezonesMap[offset];
    },

    endpoint: () => {
      const activeUser = get().activeUser();
      if (!activeUser) return null;
      return activeUser?.endpoint || null;
    },

    userPathMap: () => {
      const endPoint = get().endpoint();
      const newMap = cloneDeep(UserEndPointPathMap);
      const keys = Object.keys(newMap) as Array<keyof PathMap>;

      keys.map((key) => {
        newMap[key] = endPoint ? `${endPoint}${newMap[key]}` : "";
      });

      return newMap;
    },

    activeUser: () => {
      const users = get().users;
      const activeUser = users.find((u) => u.active);
      return activeUser || null;
    },

    addOrUpdateUser: (user: IUser) => {
      const users = cloneDeep(get().users);

      if (user.active) {
        users.forEach((u) => {
          u.active = false;
        });
      }

      const index = users.findIndex((u) => u.name === user.name);

      if (index === -1) {
        users.push(user);
      } else {
        users[index] = user;
      }

      set(() => ({ users }));
    },

    setUserActive: (name: string) => {
      const users = cloneDeep(get().users);
      const newUsers = users.map((u) => {
        u.active = u.name === name;
        return u;
      });

      set(() => ({ users: newUsers }));
    },

    removeUser: (name: string) => {
      const users = cloneDeep(get().users);
      const newUsers = users.filter((u) => u.name !== name);

      set(() => ({ users: newUsers }));
    },

    activeLogout: () => {
      const users = cloneDeep(get().users);
      const newUsers = users.map((u) => {
        if (u.active) {
          u.token = "";
          u.expires = 0;
        }
        return u;
      });

      set(() => ({ users: newUsers }));
    },

    userLogout: (name: string) => {
      const users = cloneDeep(get().users);
      const newUsers = users.map((u) => {
        if (u.name === name) {
          u.token = "";
          u.expires = 0;
        }
        return u;
      });

      set(() => ({ users: newUsers }));
    },
  }),
  {
    name: "globalStorage", // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    partialize: (state) => ({ users: state.users }),
  },
);
