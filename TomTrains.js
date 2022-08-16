Module.register("TomTrains", {
  defaults: {
    origin: "LDS",
    username: undefined,
    password: undefined,
    amount: 5
  },

  __getData() {
    this.sendSocketNotification("GetTrains", {
      origin: this.config.origin,
      username: this.config.username,
      password: this.config.password
    });
  },

  start() {
    this.nunjucksEnvironment().addFilter("trainTime", (text) => {
      if (text) {
        return `${text.substr(0, 2)}:${text.substr(2)}`;
      }
    });

    this.nunjucksEnvironment().addFilter("compareTime", (bookedTime, realTime) => {
      if (realTime > bookedTime) {
        return { text: "Late", class: "darkred" }
      } else if (realTime < bookedTime) {
        return { text: "Early", class: "lightblue" };
      } else {
        return { text: "On Time", class: "green" };
      }
    });

    setTimeout(() => {
      setInterval(() => {
        this.__getData();
      }, 600000);
      this.__getData();
    }, 1000);
  },

  socketNotificationReceived(id, payload) {
    if (id === "GetTrainsResult") {
      this.payload = payload;

      this.updateDom(300);
    }
  },

  getTemplateData() {
    return {
      data: this.payload,
      config: this.config
    }
  },

  getScripts() {
    return ["moment.js"]
  },

  getTemplate() {
    return "TrainInfo.njk";
  },

  getStyles() {
    return ["trains.css"];
  },
});