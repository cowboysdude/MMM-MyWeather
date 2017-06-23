 /* Magic Mirror
  * Module: MMM-MyWeather
  *
  * By John Wade
  * MIT Licensed.
  */
 Module.register("MMM-MyWeather", {

    
     defaults: {
         updateInterval: 10 * 60 * 1000, 
         animationSpeed: 5,
         initialLoadDelay: 10, 
         retryDelay: 2500,
         image: false,
         days: 5,
         header: false,
         zip: 14904,
         key: '',
         rotateInterval: 5 * 1000,
     },

    
     getScripts: function() {
         return ["moment.js"];
     },

     getStyles: function() {
         return ["MMM-MyWeather.css"];
     },

    
     start: function() {
         Log.info("Starting module: " + this.name);

         requiresVersion: "2.1.0",

        //  Set locale.
         moment.locale(config.language);
         this.today = "";
    this.url = "http://api.apixu.com/v1/forecast.json?key="+this.config.key+"&q="+this.config.zip+"&days="+this.config.days;                     this.activeItem = 0;
         this.rotateInterval = null;
         this.scheduleUpdate();
     },
     
      scheduleCarousel: function() {
        console.log("Scheduling weather...");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },    
     
     
     processWeather: function(data) {
         this.today = data.Today;
         this.weather = data.forecast.forecastday;
         this.current = data.current;
         this.location = data.location;
         this.week = data.Week;
     },

     scheduleUpdate: function() {
         setInterval(() => {
             this.getWeather();
         }, this.config.updateInterval);

         this.getWeather(this.config.initialLoadDelay);
     },
     
     stripZeros: function (dateStr){
       return dateStr.split('-').reduce(function(date, datePart){
        return date += parseInt(datePart) + '-'
         }, '').slice(0, -1);
        },

     getWeather: function() {
         this.sendSocketNotification('GET_WEATHER', this.url);
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "WEATHER_RESULT") {
             this.processWeather(payload);
             if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }    
             this.updateDom(this.config.animationSpeed);
         }
     },
 
       



     getDom: function() {
     	
     	var current = this.current;
        var location = this.location;
        
     	
         var large = document.createElement("div");
         var wrapper = document.createElement("div");
         
         if (this.config.header != false){
         var header = document.createElement("header");
         header.innerHTML = "Weather Info";
         wrapper.appendChild(header);
         }
        var top = document.createElement("div");
         
        var weatherTable = document.createElement("table");
        var locationRow = document.createElement("tr");
        
        var locationCol = document.createElement("th");
        locationCol.classList.add("small", "bright", "location");
        locationCol.setAttribute("colspan", 3);
        if (this.config.days > 1){
		locationCol.innerHTML = "Weather for the next "+this.config.days+ " days for "+location.name+", "+location.region;	
		} else if (this.config.days === 1){
		locationCol.innerHTML = "Current weather for "+location.name+", "+location.region;	
		} else {
		locationCol.innerHTML = "Please input number of Days for "+location.name+", "+location.region;	
		}
        locationRow.appendChild(locationCol);
        weatherTable.appendChild(locationRow);
        
        var currentRow = document.createElement("tr");
        var currentDay = document.createElement("th");
        currentDay.classList.add("xsmall", "bright");
currentDay.innerHTML = "Current Temp: "+Math.round(current.temp_f)+"&#730;  Wind speed: "+current.wind_mph+"  Wind Direction: "+current.wind_dir;
        currentRow.appendChild(currentDay);
        weatherTable.appendChild(currentRow);
        
        var nextcurrentRow = document.createElement("tr");
        var nextcurrentDay = document.createElement("th");
        nextcurrentDay.classList.add("xsmall", "bright");
        nextcurrentDay.innerHTML = "Current Condition: "+current.condition.text+ " and Humidity is "+current.humidity+"%";
        nextcurrentRow.appendChild(nextcurrentDay);
        weatherTable.appendChild(nextcurrentRow);
        
        var firstrow = document.createElement("tr");
        firstrow.classList.add('xsmall','bright');

        var day = document.createElement("th");
        day.classList.add("small", "bright");
        day.innerHTML = "Date";
        firstrow.appendChild(day);
        weatherTable.appendChild(firstrow);

        var dayhigh = document.createElement("th");
        dayhigh.classList.add("small", "bright");
        dayhigh.innerHTML = "High";
        firstrow.appendChild(dayhigh);
        weatherTable.appendChild(firstrow);

        var daylow = document.createElement("th");
        daylow.classList.add("small", "bright");
        daylow.innerHTML = "Low";
        firstrow.appendChild(daylow);
        weatherTable.appendChild(firstrow);
        
        var sunrise = document.createElement("th");
        sunrise.classList.add("small", "bright");
        sunrise.innerHTML = "Sunrise";
        firstrow.appendChild(sunrise);
        weatherTable.appendChild(firstrow);

        var sunset = document.createElement("th");
        sunset.classList.add("small", "bright");
        sunset.innerHTML = "Sunset";
        firstrow.appendChild(sunset);
        weatherTable.appendChild(firstrow);
        
        var humidity = document.createElement("th");
        humidity.classList.add("small", "bright");
        humidity.innerHTML = "H%";
        firstrow.appendChild(humidity);
        weatherTable.appendChild(firstrow);
        
        var condition = document.createElement("th");
        condition.classList.add("small", "bright");
        condition.innerHTML = "Expected Condition";
        firstrow.appendChild(condition);
        weatherTable.appendChild(firstrow);
        
        if(this.config.image === true){
        var weatherPic = document.createElement("th");
        weatherPic.classList.add("small", "bright");
        weatherPic.innerHTML = " ";
        firstrow.appendChild(weatherPic);
        weatherTable.appendChild(firstrow);
		}
         
         var weather = this.weather;
			var keys = Object.keys(this.weather);
              if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
           var weather = this.weather[keys[this.activeItem]];
		console.log(weather);	
			
         wdate = weather.date;

         var newDate = moment(wdate).format('MM-DD-YYYY');
         
			
         var row = document.createElement("tr");
         var dateColumn = document.createElement("td");
       
        var today = new Date();
            var dd = today.getDate();
            
            var dayPlus = today.getDate() + 14;
            var mm = today.getMonth() + 1;// January is 0!
            var nMonth = today.getMonth() + 6;
            var yyyy = today.getFullYear();
            if(mm<10){mm='0'+mm;} 
            
            var weekday = new Array(7);
            weekday[0] =  "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

           var dddd = weekday[today.getDay()];
        
        
        var weatherDate = moment(weather.date).format('MM-DD-YYYY');  
        var currentDate = mm + '-' + dd + '-' + yyyy; 
        var currentDay = dddd;
		var withoutZero = this.stripZeros(weatherDate);
		
		
		if (weatherDate === currentDate){
		dateColumn.classList.add("xsmall", "bright");
        dateColumn.innerHTML = "Today is "+currentDay;	
		} else {
		dateColumn.classList.add("xsmall", "dimmed");
        dateColumn.innerHTML = withoutZero;
		}
        row.appendChild(dateColumn);
        weatherTable.appendChild(row);
         
        var highColumn = document.createElement("td");
        if (weather.day.maxtemp_f < 60){
		highColumn.classList.add("xsmall", "dimmed");
        highColumn.innerHTML = Math.round(weather.day.maxtemp_f)+"&#730;";	
		} else if (weather.day.maxtemp_f > 80){
		highColumn.classList.add("xsmall", "bright", "hitemp");
        highColumn.innerHTML = Math.round(weather.day.maxtemp_f)+"&#730;";	
		} else {
		highColumn.classList.add("xsmall", "dimmed");
        highColumn.innerHTML = Math.round(weather.day.maxtemp_f)+"&#730;";	
		}
        row.appendChild(highColumn);
        weatherTable.appendChild(row);
        
        var lowColumn = document.createElement("td");
        if (weather.day.mintemp_f < 35){
        lowColumn.classList.add("xsmall", "bright", "lowtemp");
        lowColumn.innerHTML = Math.round(weather.day.mintemp_f)+"&#730;";
		} else {
		lowColumn.classList.add("xsmall", "dimmed");
        lowColumn.innerHTML = Math.round(weather.day.mintemp_f)+"&#730;";			
		}
        row.appendChild(lowColumn);
        weatherTable.appendChild(row);
        
         var sunriseColumn = document.createElement("td");
        sunriseColumn.classList.add("xsmall", "dimmed");
        sunriseColumn.innerHTML = weather.astro.sunrise;
        row.appendChild(sunriseColumn);
        weatherTable.appendChild(row);

        var sunsetColumn = document.createElement("td");
        sunsetColumn.classList.add("xsmall", "dimmed");
        sunsetColumn.innerHTML = weather.astro.sunset;
        row.appendChild(sunsetColumn);
        weatherTable.appendChild(row);
        
        var humidColumn = document.createElement("td");
         if (weather.day.avghumidity > 85){
        humidColumn.classList.add("xsmall", "bright", "humid");
		humidColumn.innerHTML = weather.day.avghumidity+"%";	
		} else {
		humidColumn.classList.add("xsmall", "dimmed");
		humidColumn.innerHTML = weather.day.avghumidity+"%";	
		}
        humidColumn.innerHTML = weather.day.avghumidity+"%";
        row.appendChild(humidColumn);
        weatherTable.appendChild(row);

        var imageUrl =  weather.day.condition.icon;
        var weatherImage = "<img src="+imageUrl+" height=25px; width=25px;>";

        if(this.config.image === false){
        if (weather.day.condition.text != "undefined" || null){
        var currentColumn = document.createElement("td");
        if(weather.day.condition.text==='Sunny'){
		currentColumn.classList.add("xsmall","bright","sun");
        currentColumn.innerHTML = weather.day.condition.text;	
		} else if (weather.day.condition.text==='Partly cloudy') {
		currentColumn.classList.add("xsmall","pcloudy");
        currentColumn.innerHTML = weather.day.condition.text;	
		} else if (weather.day.condition.text==='Overcast'){
		currentColumn.classList.add("xsmall","overcast");
        currentColumn.innerHTML = weather.day.condition.text;	
		} else if (weather.day.condition.text==='Moderate or heavy rain shower') {
		currentColumn.classList.add("xsmall","modrain");
        currentColumn.innerHTML = weather.day.condition.text;	
		} else {
		currentColumn.classList.add("xsmall","bright");
        currentColumn.innerHTML = weather.day.condition.text;	
		}
        
        row.appendChild(currentColumn);
        weatherTable.appendChild(row);
        }
		}
        
        if(this.config.image === true){
        var weatherIcon = document.createElement("td");
        weatherIcon.innerHTML = weatherImage;
        row.appendChild(weatherIcon);
        weatherTable.appendChild(row);
		} 
			
		large.appendChild(weatherTable);
		wrapper.appendChild(large);
		}
		
         return wrapper;
     },
 });