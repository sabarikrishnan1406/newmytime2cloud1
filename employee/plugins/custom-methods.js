import QRCode from 'qrcode';

export default ({ app,store }, inject) => {

  // Inject it globally so it can be accessed as $isDark in all pages/components
  inject('isDark', () => store.state.theme.isDark);

  inject('qrcode', {
    generate: (text, options) => {
      return new Promise((resolve, reject) => {
        QRCode.toDataURL(text, options, (error, dataURL) => {
          if (error) {
            reject(error);
          } else {
            resolve(dataURL);
          }
        });
      });
    }
  });

  inject("util", {

    getRemainingDays() {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get the last day of the current month at midnight
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(0, 0, 0, 0);

      // Calculate remaining days (excluding today)
      return Math.floor((endOfMonth - today) / (1000 * 60 * 60 * 24));
    },

    getRating(count, from_date, to_date) {
      // Convert the date strings to Date objects
      const fromDate = new Date(from_date);
      const toDate = new Date(to_date);

      // Calculate the difference in time (in milliseconds)
      const timeDifference = toDate - fromDate;

      // Convert the time difference to days
      const totalDaysInMonth = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

      // Calculate the rating
      const rating = (count / totalDaysInMonth) * 5;

      // Return the rating rounded to 2 decimal places
      return parseFloat(rating.toFixed(2));
    },

    getPriorityColor(category) {
      if (category == null) return "";
      else {
        if (category == "Urgent") {
          return "color:#F44336";
        } else if (category == "Informational") {
          return "color:#3F51B5";
        } else if (category == "Meeting") {
          return "color:#FF5722";
        } else if (category == "Priority") {
          return "color:#4CAF50";
        } else if (category == "Informational") {
          return "color:#607D8B";
        } else if (category == "Low Priority") {
          return "color:#000000";
        }
      }
    },
    toTitleCase(str) {
      return str.replace(/_/g, " ").replace(/\w\S*/g, function (text) {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
      });
    },
  });

  inject("dateFormat", {
    format1: (inputdate) => {
      // Create a Date object with the date "2023-09-13"  Output Sun, Jan 01, 2023
      const inputDate = new Date(inputdate);
      const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        weekday: "short",
      };
      const formattedDate = inputDate.toLocaleDateString("en-US", options);
      return formattedDate;
    },
    format2: (inputdate) => {
      // Create a Date object with the date "2023-09-13"  Output: "23-09-13"
      const date = new Date(inputdate);

      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    format3: (inputdate) => {
      const currentDate = new Date(inputdate);

      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to month because it's zero-based.
      const day = currentDate.getDate().toString().padStart(2, "0");
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes} `;
    },
    format4: (inputdate) => {
      const currentDate = new Date(inputdate);

      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to month because it's zero-based.
      const day = currentDate.getDate().toString().padStart(2, "0");
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");

      const inputDate = new Date(inputdate);
      const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        weekday: "short",
      };
      const formattedDate = inputDate.toLocaleDateString("en-US", options);

      return `${formattedDate}  ${hours}:${minutes} `;
    },
    monthStartEnd: (inputdate) => {
      // Get the current date
      const currentDate = new Date(inputdate);

      // Get the first day of the current month
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      // Get the last day of the current month
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Format the dates as strings (in 'YYYY-MM-DD' format)
      const formattedFirstDay = `${firstDayOfMonth.getFullYear()}-${(
        firstDayOfMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-01`;
      const formattedLastDay = `${lastDayOfMonth.getFullYear()}-${(
        lastDayOfMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${lastDayOfMonth.getDate()}`;

      return { first: formattedFirstDay, last: formattedLastDay };
    },
    format_month_name_year: (inputdate) => {
      // Create a Date object with the date "2023-09-13"  Output: "23-09-13"
      const date = new Date(inputdate);

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentDate = date;
      const currentMonth = months[currentDate.getMonth()];
      const currentYear = currentDate.getFullYear();

      return `${currentMonth} ${currentYear}`;
    },

    can(per, thisobj) {
      let u = thisobj.$auth.user;

      return (
        (u && u.permissions.some((e) => e == per || per == "/")) ||
        u.is_master ||
        u.user_type == "branch"
      );
    },
  });

  inject("pagePermission", {
    can(per, thisobj) {
      let u = thisobj.$auth.user;

      // return (
      //   (u && u.permissions.some((e) => e == per || per == "/")) ||
      //   u.is_master ||
      //   u.user_type == "branch"
      // );

      return (
        (u && u.permissions.some((e) => e == per || per == "/")) || u.is_master
      );
    },
  });

  const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, value);
  };

  // Function to get an item from local storage
  const getLocalStorageItem = (key) => {
    return localStorage.getItem(key);
  };

  // Function to remove an item from local storage
  const removeLocalStorageItem = (key) => {
    localStorage.removeItem(key);
  };

  // Inject the functions into the context as $localStorage
  inject('localStorage', {
    set: setLocalStorageItem,
    get: getLocalStorageItem,
    remove: removeLocalStorageItem,
  });
};
