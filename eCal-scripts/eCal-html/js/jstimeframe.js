//loosely based on https://github.com/cbeardsmore/Upcoming-iCal-Events/blob/master/Upcoming-iCal-Events.widget/main.coffee

// --------------- CUSTOMIZE ME ---------------
// these are dimensions of the widget in pixels
var BLOCK_HEIGHT, BOTTOM, HEIGHT, LEFT, TOP, WIDTH, MIN_HOUR, BURN_IN_SHIFT, baseCommand, executablePath, options;

TOP = 0;

LEFT = 0;

BOTTOM = 0;

// For t5 lilygo use 540x960 
WIDTH = 540;
HEIGHT = 960;

// how many pixels one-hour event occupies vertically
BLOCK_HEIGHT = 78;

// When the calendar starts
MIN_HOUR = 09;

// Amount to shift contents to avoid burn-in (in pixels)
BURN_IN_SHIFT = 15;

// --------------------------------------------

  intersects: function intersects(ev1, ev2) {
	if (ev1.start_time >= ev2.end_time || ev1.end_time <= ev2.start_time) {
	  return false;
	}
	return true;
  }
  
  afterRender: function afterRender(domEl) {
	return $(domEl).on('click', '.subhead', (e) => {
	  var link;
	  link = $(e.currentTarget).attr('data-link');
	  return this.run("open " + link);
	});
  }
  
  function insertdate(){
	  var today = new Date();
	  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var day = weekday[today.getDay()];
	  var date = today.getDate() + " // " + day;
	  $("#date").append(date);
  }
  
  
  rng = Math.random() * BURN_IN_SHIFT;
  
  function BurnInProtector(){
	  rng = Math.random() * 15;
	  rng2 = Math.random() * 10;
	  // console.log(padding);
	  $("#burn-in-protector").css("padding-top", rng);
	  $("#date").css("padding-left", rng2);
  }
  
 
  
  // Main script
  update: function update(domEl) {
	var events, current_hour, current_time, diff_hours, dom, ev, event, events, height, hour, i, j, k, l, left, len, len1, len2, len3, line, line_regex, lines, link, link_regex, m, min_hour, ref, rel_current_hour, rel_start_hour, result, start_hour, start_pos, start_time, str, today, video_icon, wdth;
	
	
	dom = $("#content");
	dom.empty();
	today = new Date();
	current_time_hour = today.getHours()
	if (current_time_hour>12) {
		  current_time_hour = current_time_hour-12;
	  }
	current_time = current_time_hour.toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
	current_hour = today.getHours() + today.getMinutes() / 60;
	
	// move all-day events to a new array
	   let AllDayEvents=eCal_output.filter(obj => obj['all_day']===1);
	// make sure the all-day events are for today
	   AllDayEvents=AllDayEvents.filter(obj => obj['edate']==='today');
    // remove all-day events from eCal_output
	  eCal_output=eCal_output.filter(obj => !(obj['all_day']===1));
	// remove declined events from eCal_output
	  eCal_output=eCal_output.filter(obj => !(obj['availability']===1)); 
	   
	   
	   console.log (AllDayEvents); 
	   console.log (eCal_output); 
	
	function insertallday(){
		  for (i = 0; i < AllDayEvents.length; i++) {
		  // Event Title
		  title = AllDayEvents[i].title;
		  console.log(title);
		$("#top-right-container").append('<div class="all-day">'+title+'</div>');
		}
	}
	insertallday();
	
	
	events =[];
	
	for (i = 0; i < eCal_output.length; i++) {
		// Event Title
		title = eCal_output[i].title;
		console.log(title);
		
		// Start time
		start_time_unix = eCal_output[i].start_date;
		end_time_unix = eCal_output[i].end_date;
		
		start_time = new Date(start_time_unix * 1000);
		// console.log(start_time);
		end_time = new Date(end_time_unix * 1000);
		// console.log(end_time);
		
		start_date = start_time.getDate();
		end_date = end_time.getDate();
		
		start_hour = start_time.getHours();
		  // console.log(start_hour);
		end_hour = end_time.getHours();
		  // console.log(end_hour);
		  
		notes = eCal_output[i].notes
		link = eCal_output[i].conference_url_detected
		
		event = {
			start_date: start_date,
			start_time: start_hour,
			end_date: end_date,
			end_time: end_hour,
			title: title,
			notes: notes,
			link: link
		  };
		  events.push(event);
		  
	  }

	
	min_hour = Math.floor(MIN_HOUR) - 0.5;
	
	
	for (k = 0, len2 = events.length; k < len2; k++) {
	  event = events[k];
	  diff_hours = event.end_time - event.start_time;
	  rel_start_hour = event.start_time - min_hour;
	  start_pos = rel_start_hour * BLOCK_HEIGHT;
	  height = diff_hours * BLOCK_HEIGHT;
	  left = 50;
	  wdth = WIDTH - 67;
	  for (l = 0, len3 = events.length; l < len3; l++) {
		ev = events[l];
		if (this.intersects(event, ev)) {
		  if (Math.abs(event.start_time - ev.start_time) < 0.5) {
			if (event.start_time < ev.start_time) {
			  wdth = (WIDTH - 67) / 2;
			}
			if (event.start_time === ev.start_time && event.end_time > ev.end_time) {
			  wdth = (WIDTH - 67) / 2;
			}
			if (event.start_time === ev.start_time && event.end_time === ev.end_time && event.title !== ev.title) {
			  if (event.title < ev.title) {
				wdth = (WIDTH - 67) / 2;
			  } else {
				wdth = (WIDTH - 67) / 2 - 11;
				left = 50 + (WIDTH - 67) / 2 + 11;
			  }
			}
			if (event.start_time > ev.start_time || event.end_time < ev.end_time) {
			  wdth = (WIDTH - 67) / 2 - 11;
			  left = 50 + (WIDTH - 67) / 2 + 11;
			}
		  } else {
			if (event.start_time > ev.start_time) {
			  left = 55;
			  wdth = WIDTH - 67 - 5;
			}
		  }
		}
	  }
	  video_icon = "";
	  if (event.link !== "") {
		video_icon = `<i class="fa fa-video" style="font-size: 8px"></i>`;
	  }
	  str = `<div class="subhead" data-link="${event.link}" style="position: absolute; top: ${start_pos + 21 + rng}px; height: ${height - 12}px; width: ${wdth}px; left: ${left}px;">
${video_icon}
${event.title}
</div> `;
	  dom.append(str);
	}
	for (hour = m = ref = Math.floor(min_hour + 1); (ref <= 25 ? m < 25 : m > 25); hour = ref <= 25 ? ++m : --m) {
	  rel_current_hour = hour - min_hour;
	  if (hour>12) {
		  hour = hour-12;
	  }
	  dom.append(`<hr id="hour-line" style="position: absolute; top: ${rel_current_hour * BLOCK_HEIGHT + 11 + rng}px;"></hr>`);
	  dom.append(`<span id="hour-text" style="position: absolute; top: ${rel_current_hour * BLOCK_HEIGHT + 11 - 4 + rng}px;">${hour}:00</span>`);
	}
	rel_current_hour = current_hour - min_hour;
	dom.append(`<hr id="line" style="position: absolute; top: ${rel_current_hour * BLOCK_HEIGHT + 11 + rng}px;"></hr>`);
	dom.append(`<span id="dot" style="position: absolute; top: ${rel_current_hour * BLOCK_HEIGHT + 11 + 4 + rng}px;"></span>`);
	return dom.append(`<span id="line-text" style="position: absolute; top: ${rel_current_hour * BLOCK_HEIGHT + 3 + 2 + rng}px;">${current_time}</span>`);
  }
  
  
  // run
$(document).ready(function () {
BurnInProtector();
// render();
afterRender();
update();
insertdate();

});